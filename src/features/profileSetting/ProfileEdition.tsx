// src/components/SettingsPage/ProfileEditor.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useUser } from "../../hooks/useUser";

type setProfileProp = {
    setProfileImg: React.Dispatch<React.SetStateAction<string | null>>,
    profileImg: string|null
};

export function ProfileEditor({ profileImg,setProfileImg }: setProfileProp) {
  const [user] = useUser();
  const { email, name: currentName } = user;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImg, setLocalImg] = useState<string | null>(profileImg ?? null);

  useEffect(() => {
    setLocalImg(profileImg ?? null);
  }, [profileImg]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLocalImg(reader.result);
        setProfileImg(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const imgSrc = useMemo(
    () => (localImg && localImg !== "" ? localImg : "/default-user.jpg"),
    [localImg]
  );

  return (
    <section className="flex items-center gap-6 mb-10 flex-col justify-center sm:flex-row">
      <div className="relative w-30 h-30">
        <img
          src={imgSrc}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border border-blue-600 ring-blue-600 ring"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow hover:bg-gray-50"
          aria-label="Change profile picture"
        >
          <Camera size={18} className="text-amber-600"/>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div>
        <p className="font-medium text-lg text-gray-800 dark:text-gray-100">{currentName || "Your Name"}</p>
        <p className="text-gray-500 text-sm dark">{email || "your@email.com"}</p>
      </div>
    </section>
  );
};
