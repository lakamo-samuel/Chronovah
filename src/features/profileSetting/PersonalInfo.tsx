import React, { useState, useCallback, useEffect } from 'react';
import { User, Quote, Loader, Camera } from 'lucide-react';
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
  const { user, updateUser, refresh } = useUser();
  const { success, error: showError } = useToast();
  const { uploadImage, isUploading: isUploadingImage } = useImageUpload();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    favoriteQuote: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        favoriteQuote: '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Full name is required';
    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    if (formData.bio && formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';
    if (formData.favoriteQuote && formData.favoriteQuote.length > 300) newErrors.favoriteQuote = 'Quote must be less than 300 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError('Image must be less than 5MB');
        return;
      }

      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        // 1. Upload to Cloudinary via the same hook used everywhere else
        const cloudinaryUrl = await uploadImage(file);

        // 2. Save the URL to the backend via PUT /user/profile
        const profileResponse = await settingApiCall.updateProfile({
          name: formData.name,
          avatar: cloudinaryUrl,
        });

        if (!profileResponse.success) {
          showError(profileResponse.error || 'Failed to save avatar to profile');
          return;
        }

        // 3. Update the local user state so the avatar shows everywhere immediately
        await updateUser({ avatar: cloudinaryUrl });

        // 4. Refresh auth state so Header/Sidebar avatars update without a page reload
        await refresh();

        setAvatarPreview(cloudinaryUrl);
        success('Profile picture updated');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to upload avatar';
        showError(msg);
        // Revert preview on failure
        setAvatarPreview(user?.avatar || null);
      }
    },
    [uploadImage, updateUser, refresh, formData.name, showError, success, user?.avatar]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    const payload: Record<string, string> = {
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
    };
    if (formData.favoriteQuote.trim()) payload.favoriteQuote = formData.favoriteQuote;

    const response = await settingApiCall.updateProfile(payload);
    setIsLoading(false);

    if (response.success) {
      setSuccessMessage('Profile updated successfully');
      await updateUser({ name: formData.name, username: formData.username, bio: formData.bio });
    } else {
      setErrors({ name: response.error || 'Failed to update profile' });
    }
  };

  return (
    <div className="p-6 bg-card rounded-2xl border border-default shadow-soft space-y-6">
      <h2 className="font-ui-lg-bold text-primary">Personal Information</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-ui-sm-bold text-primary mb-4">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            {/* Avatar preview with upload overlay */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-default border-2 border-default flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-muted" />
                )}
              </div>
              {/* Loading overlay */}
              {isUploadingImage && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <Loader size={20} className="text-white animate-spin" />
                </div>
              )}
              {/* Camera button */}
              {!isUploadingImage && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-soft"
                  aria-label="Change profile picture"
                >
                  <Camera size={14} className="text-white" />
                </label>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploadingImage}
                className="hidden"
              />
            </div>

            {/* Upload area */}
            <div className="flex-1">
              <label htmlFor="avatar-upload" className={`block cursor-pointer ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="px-4 py-3 border-2 border-dashed border-default rounded-xl text-center hover:border-primary-500 transition-colors">
                  {isUploadingImage ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader size={16} className="animate-spin text-primary-500" />
                      <p className="text-sm text-muted">Uploading…</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-primary">Click to upload</p>
                      <p className="text-xs text-muted mt-1">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
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
              id="name" type="text" name="name"
              value={formData.name} onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary transition-all"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-accent-red">{errors.name}</p>}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Username *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="username" type="text" name="username"
              value={formData.username} onChange={handleInputChange}
              placeholder="Choose a unique username"
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary transition-all"
            />
          </div>
          {errors.username && <p className="mt-1 text-sm text-accent-red">{errors.username}</p>}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Bio <span className="text-xs text-muted font-normal">({formData.bio.length}/500)</span>
          </label>
          <textarea
            id="bio" name="bio"
            value={formData.bio} onChange={handleInputChange}
            placeholder="Tell us about yourself"
            rows={3} maxLength={500}
            className="w-full px-3 py-3 bg-default border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary resize-none transition-all"
          />
          {errors.bio && <p className="mt-1 text-sm text-accent-red">{errors.bio}</p>}
        </div>

        {/* Favorite Quote */}
        <div>
          <label htmlFor="favoriteQuote" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Favorite Quote <span className="text-xs text-muted font-normal">({formData.favoriteQuote.length}/300)</span>
          </label>
          <div className="relative">
            <Quote className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="favoriteQuote" type="text" name="favoriteQuote"
              value={formData.favoriteQuote} onChange={handleInputChange}
              placeholder="Share your favorite quote"
              maxLength={300}
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary transition-all"
            />
          </div>
          {errors.favoriteQuote && <p className="mt-1 text-sm text-accent-red">{errors.favoriteQuote}</p>}
        </div>

        {successMessage && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-700 dark:text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button loading={isLoading} type="submit" className="min-w-[150px]">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;
