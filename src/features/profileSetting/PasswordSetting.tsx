import { useState, useMemo } from "react";
import Button from "../../ui/Button";
import PasswordInput from "./PasswordSettingInput";
import StrengthMeter from "./PasswordStrengthMeter";
import settingApiCall from "../../services/SettingApiCall";

type FormErrors = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
};

 function PasswordSetting() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Real-time strength (0-100) for new password
  const strength = useMemo(() => {
    const pwd = newPassword || "";
    let score = 0;

    if (pwd.length > 0) score += Math.min(30, pwd.length * 2);
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    
    return Math.min(100, score);
  }, [newPassword]);

  const inlineValidate = (val: string, label: string) => {
    if (label === "New Password" && val.length > 0 && val.length < 8) {
      return "Minimum length is 8 characters.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    // Run final validation
    const finalErrors: FormErrors = {};
    if (!oldPassword)
      finalErrors.oldPassword = "Please enter your old password.";
    if (!newPassword) finalErrors.newPassword = "Please enter a new password.";
    if (!confirmPassword)
      finalErrors.confirmPassword = "Please confirm your new password.";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      finalErrors.form = "New password and confirmation do not match.";
    if (newPassword && oldPassword && newPassword === oldPassword)
      finalErrors.form = "New password must be different from old password.";
    if (newPassword && strength < 40)
      finalErrors.form = "Password is not strong enough.";

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length > 0) return;

    // API call
    setIsLoading(true);
    const response = await settingApiCall.changePassword({
      oldPassword,
      newPassword,
    });
    setIsLoading(false);

    if (response.success) {
      setSuccessMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrors({ form: response.error || "Failed to change password" });
    }
  };

  return (
    <form
      className="space-y-6 bg-card p-6 rounded-2xl border border-default shadow-soft mt-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="font-ui-lg-bold text-primary mb-6">Change Password</h2>

      <PasswordInput
        label="Current Password"
        value={oldPassword}
        onChange={(e) => {
          setOldPassword(e.target.value);
          setSuccessMessage("");
          if (errors.oldPassword) {
            setErrors({ ...errors, oldPassword: undefined });
          }
        }}
        placeholder="Enter your current password"
        error={errors.oldPassword}
      />

      <PasswordInput
        label="New Password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setSuccessMessage("");
          if (errors.newPassword) {
            setErrors({ ...errors, newPassword: undefined });
          }
        }}
        placeholder="Enter a new password"
        error={
          errors.newPassword || inlineValidate(newPassword, "New Password")
        }
      />

      {/* Strength meter for New Password */}
      {newPassword && (
        <div className="ml-1">
          <StrengthMeter value={strength} />
        </div>
      )}

      <PasswordInput
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setSuccessMessage("");
          if (errors.confirmPassword) {
            setErrors({ ...errors, confirmPassword: undefined });
          }
        }}
        placeholder="Confirm your new password"
        error={errors.confirmPassword}
      />

      {/* Form-level errors */}
      {errors.form ? (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          ✕ {errors.form}
        </div>
      ) : null}

      {/* Success message */}
      {successMessage ? (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm">
          ✓ {successMessage}
        </div>
      ) : null}

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="min-w-[150px]"
        >
          Change Password
        </Button>
      </div>
    </form>
  );
}

export default PasswordSetting;
