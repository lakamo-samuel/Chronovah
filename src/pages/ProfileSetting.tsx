
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from '../features/profileSetting/PersonalInfo';
import PasswordSetting from '../features/profileSetting/PasswordSetting';
import GoBackLink from '../ui/GoBackLink';
import DangerZone from '../features/settings/DangerZone';
import settingApiCall from '../services/SettingApiCall';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

function ProfileSetting() {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteAccount = async () => {
    const response = await settingApiCall.deleteAccount();

    if (response.success) {
      success('Account deleted successfully. Redirecting...');
      // Redirect to login or home
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    } else {
      error(response.error || 'Failed to delete account');
      setErrorMessage(response.error || 'Failed to delete account');
    }
  };

  return (
    <div className="w-full space-y-8 max-w-3xl mx-auto mt-5 px-4 py-10 mb-10">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* Header */}
      <div className="flex flex-col gap-3 mb-8">
        <GoBackLink />
        <div>
          <h1 className="text-3xl font-ui-2xl text-primary mb-1">
            Profile Settings
          </h1>
          <p className="text-muted text-sm">
            Manage your account information, password, and preferences
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          ✕ {errorMessage}
        </div>
      )}

      {/* Personal Information Section */}
      <section>
        <PersonalInfo />
      </section>

      {/* Password Section */}
      <section>
        <PasswordSetting />
      </section>

      {/* Danger Zone Section */}
      <section>
        <DangerZone
          onClick={handleDeleteAccount}
          title="Delete Account"
          description="Once you delete your account, there is no going back. All your data will be permanently deleted. This action cannot be undone."
          confirmText="Delete my account"
        >
          Delete Account
        </DangerZone>
      </section>

      {/* Footer Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
        <h3 className="font-ui-sm-bold text-blue-900 dark:text-blue-300 mb-2">
          💡 Tips
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Keep your password strong and unique</li>
          <li>• Update your profile picture to help others recognize you</li>
          <li>• Your data is securely encrypted and stored</li>
          <li>• Contact support if you need help recovering your account</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileSetting;
