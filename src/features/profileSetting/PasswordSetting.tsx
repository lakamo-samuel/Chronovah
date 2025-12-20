import { useState, useMemo } from "react";

import Button from "../../ui/Button";

import PasswordInput from "./PasswordSettingInput";
import StrengthMeter from "./PasswordStrengthMeter";

type FormErrors = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
};

export default function PasswordSetting() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errors, setErrors] = useState<FormErrors>({});

  // Real-time strength (0-100) for new password
  const strength = useMemo(() => {
    const pwd = newPassword || "";
    let score = 0;

    if (pwd.length > 0) score += Math.min(30, pwd.length * 2); // length factor
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    // cap 100
    return Math.min(100, score);
  }, [newPassword]);

  // Simple inline validation as you type (excluding form submit checks)
  const inlineValidate = (val: string, label: string) => {
    if (label === "New Password" && val.length > 0 && val.length < 8) {
      return "Minimum length is 8 characters.";
    }
    if (label === "New Password" && val && !/\d/.test(val)) {
      // require a number as a light rule
      // return "Include at least one number.";
    }
    return "";
  };

  // const isFormValid = useMemo(() => {
  //   const errs: FormErrors = {};
  //   if (!oldPassword) errs.oldPassword = "Please enter your old password.";
  //   if (!newPassword) errs.newPassword = "Please enter a new password.";
  //   if (!confirmPassword)
  //     errs.confirmPassword = "Please confirm your new password.";
  //   if (newPassword && confirmPassword && newPassword !== confirmPassword)
  //     errs.form = "New password and confirmation do not match.";

  //   // Inline example: add non-empty checks
  //   if (oldPassword && newPassword && newPassword === oldPassword)
  //     errs.form = "New password must be different from old password.";

  //   // Example strength gating (optional)
  //   if (newPassword && strength < 40)
  //     errs.form = "Password is not strong enough.";

  //   setErrors((prev) => ({ ...prev, ...errs }));
  //   return Object.keys(errs).length === 0;
  // }, [oldPassword, newPassword, confirmPassword, strength]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length > 0) return;

    // TODO: integrate with your API / auth logic
    console.log("Password change requested:", { oldPassword, newPassword });
  };

  return (
    <form
      className="space-y-6 bg-white dark:bg-[#0B1120] p-6 rounded-xl shadow-sm mt-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="font-semibold text-lg mb-4 dark:text-gray-100">
        Change Password
      </h2>

      <PasswordInput
        label="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Enter old password"
        error={errors.oldPassword}
      />

      <PasswordInput
        label="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
        error={
          errors.newPassword || inlineValidate(newPassword, "New Password")
        }
      >
        {/* Show strength meter below the input when this component supports children; otherwise we render separately */}
      </PasswordInput>

      {/* Strength meter for New Password (rendered after the New Password input) */}
      <div className="ml-1">
        <StrengthMeter value={strength} />
      </div>

      <PasswordInput
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        error={errors.confirmPassword}
      />

      {errors.form ? (
        <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
      ) : null}

      <div className="flex justify-end">
        <Button
          onClick={async () => {
            console.log("click");
          }}
          loading={false}
        >
          Change password
        </Button>
      </div>
    </form>
  );
}
