// components/UserAvatar.tsx
// Reusable avatar component used in Header, DashHeader, mobile menu, etc.
// Shows the Cloudinary-transformed profile image when available,
// falls back to initials on error or when no image exists.

import { useState } from "react";
import { getAvatarUrl } from "../lib/cloudinary";

interface UserAvatarProps {
  name?: string | null;
  avatar?: string | null;
  /** Tailwind size classes, e.g. "w-8 h-8" */
  size?: string;
  /** Extra classes to add to the outer element */
  className?: string;
  /** Font size for initials, e.g. "text-sm" */
  textSize?: string;
}

export default function UserAvatar({
  name,
  avatar,
  size = "w-9 h-9",
  className = "",
  textSize = "text-sm",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const transformedUrl = getAvatarUrl(avatar);
  const showImage = !!transformedUrl && !imgError;

  return (
    <div
      className={`${size} rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold flex-shrink-0 overflow-hidden shadow-soft ${className}`}
    >
      {showImage ? (
        <img
          src={transformedUrl}
          alt={name ?? "User avatar"}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={textSize}>{initials}</span>
      )}
    </div>
  );
}
