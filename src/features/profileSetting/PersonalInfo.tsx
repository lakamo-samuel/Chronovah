import React, { useState, useCallback, useEffect } from 'react';
import { User, Quote, Loader } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { useImageUpload } from '../../hooks/useImageUpload';
import settingApiCall from '../../services/SettingApiCall';
import Button from '../../ui/Button';
import { useToast } from '../../hooks/useToast';

interface FormErrors {
  name?: string;
  username?: string;
  bio?: string;
  favoriteQuote?: string;
}

function PersonalInfo() {
  const { user, updateUser } = useUser();
  const { success, error: showError } = useToast();
  const { uploadImage, isUploading: isUploadingImage, error: uploadError } = useImageUpload();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    favoriteQuote: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        favoriteQuote: '',
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.favoriteQuote && formData.favoriteQuote.length > 300) {
      newErrors.favoriteQuote = 'Quote must be less than 300 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showError('Image must be less than 5MB');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload avatar using Cloudinary
      try {
        const cloudinaryUrl = await uploadImage(file);
        
        // Update user with new image URL
        const updateUserResult = await updateUser({ avatar: cloudinaryUrl });
        if (!updateUserResult) {
          showError('Failed to update profile with new avatar');
          return;
        }
        
        // Also update the backend profile with profileImageUrl
        const payload: any = { name: formData.name };
        if (formData.favoriteQuote.trim() !== '') {
          payload.favoriteQuote = formData.favoriteQuote;
        }
        
        const response = await settingApiCall.updateProfile(payload);
        
        if (!response.success) {
          showError(response.error || 'Failed to save profile');
          return;
        }
        
        success('Avatar uploaded successfully');
      } catch (err) {
        showError(uploadError || 'Failed to upload avatar');
      }
    },
    [uploadImage, uploadError, updateUser, formData.name, formData.favoriteQuote, showError, success]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    const payload: any = {
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
    };
    
    if (formData.favoriteQuote.trim() !== '') {
      payload.favoriteQuote = formData.favoriteQuote;
    }

    const response = await settingApiCall.updateProfile(payload);

    setIsLoading(false);

    if (response.success) {
      setSuccessMessage('Profile updated successfully');
      await updateUser(formData);
    } else {
      setErrors({ name: response.error || 'Failed to update profile' });
    }
  };

  return (
    <div className="p-6 bg-card rounded-2xl border border-default shadow-soft space-y-6">
      <h2 className="font-ui-lg-bold text-primary mb-4">Personal Information</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Upload */}
        <div className="mb-6">
          <label className="block text-sm font-ui-sm-bold text-primary mb-4">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-default border-2 border-default flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-muted" />
                )}
              </div>
              {(isLoading || isUploadingImage) && (
                <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                  <Loader size={20} className="text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Upload Input */}
            <div className="flex-1">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isLoading || isUploadingImage}
                className="hidden"
              />
              <label htmlFor="avatar" className="block">
                <div className="px-4 py-2 border-2 border-dashed border-default rounded-lg text-center cursor-pointer hover:border-primary transition-colors">
                  <p className="text-sm font-ui-sm-bold text-primary">
                    Click to upload
                  </p>
                  <p className="text-xs text-muted mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted transition-all"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Username *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a unique username"
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted transition-all"
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.username}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Bio
            <span className="text-xs text-muted ml-2">
              ({formData.bio.length}/500)
            </span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            rows={3}
            maxLength={500}
            className="w-full px-3 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted resize-none transition-all"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.bio}
            </p>
          )}
        </div>

        {/* Favorite Quote */}
        <div>
          <label htmlFor="favoriteQuote" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Favorite Quote
            <span className="text-xs text-muted ml-2">
              ({formData.favoriteQuote.length}/300)
            </span>
          </label>
          <div className="relative">
            <Quote className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="favoriteQuote"
              type="text"
              name="favoriteQuote"
              value={formData.favoriteQuote}
              onChange={handleInputChange}
              placeholder="Share your favorite quote"
              maxLength={300}
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted transition-all"
            />
          </div>
          {errors.favoriteQuote && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.favoriteQuote}
            </p>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm">
            ✓ {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={() => {}}
            loading={isLoading}
            type="submit"
            className="min-w-[150px]"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;