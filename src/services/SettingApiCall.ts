import { useEffect } from "react";

/* inside the hook, after state declarations ... */

import { useState, useCallback } from "react";
import { useToken } from "../hooks/useToken";
import { useUser } from "../hooks/useUser";
import axios from "axios";

export function useDetailsSettings() {
  const [isLoading, setIsLoading] = useState(false);

  const [user, refresh] = useUser();
  const [token, setToken] = useToken();

  // Local editable fields
  const [name, setName] = useState(user?.name ?? "");
  const [profileImg, setProfileImg] = useState(user?.info?.profileImg ?? "");
  const [favQuote, setFavQuote] = useState(user?.info?.favQuote ?? "");

  const id = user?.id;
useEffect(() => {
  setName(user?.name ?? "");
  setProfileImg(user?.info?.profileImg ?? "");
  setFavQuote(user?.info?.favQuote ?? "");
}, [user?.name, user?.info?.profileImg, user?.info?.favQuote]);
  const handlePersonalInfoSubmit = useCallback(async () => {
    if (!id) throw new Error("User id unavailable");
    if (!token) throw new Error("Auth token unavailable");

    try {
      setIsLoading(true);

      const response = await axios.put(
        `/api/user/${id}`,
        { name, profileImg, favQuote },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newToken = response.data?.token;
      if (newToken) setToken(newToken);

      refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`${message} Failed to update user`);
    } finally {
      setIsLoading(false);
    }
  }, [id, token, name, profileImg, favQuote, setToken, refresh]);

  return {
    name,
    profileImg,
    favQuote,
    setName,
    setProfileImg,
    setFavQuote,
    handlePersonalInfoSubmit,
    isLoading,
  };
}
