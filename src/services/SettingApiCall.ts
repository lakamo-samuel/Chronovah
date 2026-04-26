import { protectedAxios, publicAxios } from '../../axios';

export interface ProfileUpdateData {
  name?: string;
  username?: string;
  bio?: string;
  favoriteQuote?: string;
  avatar?: string;
}

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const settingApiCall: {
  updateProfile: (data: ProfileUpdateData) => Promise<ApiResponse>;
  changePassword: (data: PasswordChangeData) => Promise<ApiResponse>;
  deleteAccount: () => Promise<ApiResponse>;
  uploadAvatar: (file: File) => Promise<ApiResponse<{ avatarUrl: string }>>;
  requestPasswordReset: (email: string) => Promise<ApiResponse>;
  confirmPasswordReset: (token: string, newPassword: string, confirmNewPassword: string) => Promise<ApiResponse>;
} = {
  // Update user profile information
  updateProfile: async (data: ProfileUpdateData): Promise<ApiResponse> => {
    try {
      const response = await protectedAxios.put('/user/profile', data);
      return {
        success: true,
        message: response.data?.message || 'Profile updated successfully',
        data: response.data?.data || response.data?.user,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to update profile',
      };
    }
  },

  // Change password
  changePassword: async (data: PasswordChangeData): Promise<ApiResponse> => {
    try {
      const response = await protectedAxios.post('/user/change-password', data);
      return {
        success: true,
        message: response.data?.message || 'Password changed successfully',
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to change password',
      };
    }
  },

  // Delete account
  deleteAccount: async (): Promise<ApiResponse> => {
    try {
      const response = await protectedAxios.delete('/user/account');
      return {
        success: true,
        message: response.data?.message || 'Account deleted successfully',
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to delete account',
      };
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await protectedAxios.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        message: response.data?.message || 'Avatar uploaded successfully',
        data: response.data?.data,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to upload avatar',
      };
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await publicAxios.post('/user/reset-password/request', { email });
      return {
        success: true,
        message: response.data?.message || 'Reset link sent to your email',
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to request password reset',
      };
    }
  },

  // Confirm password reset
  confirmPasswordReset: async (token: string, newPassword: string, confirmNewPassword: string): Promise<ApiResponse> => {
    try {
      const response = await publicAxios.post('/user/reset-password/confirm', {
        token,
        newPassword,
        confirmNewPassword,
      });
      return {
        success: true,
        message: response.data?.message || 'Password reset successfully',
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to reset password',
      };
    }
  },
};

export default settingApiCall;
