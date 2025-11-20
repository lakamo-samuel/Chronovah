export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Enter a valid email";
  return "";
}

export function validatePassword(password: string) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
}

export function validateName(name: string) {
  if (!name) return "Name is required";
  if (name.trim().length < 2) return "Enter at least 2 characters";
  return "";
}
