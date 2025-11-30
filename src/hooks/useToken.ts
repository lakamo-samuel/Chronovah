import { useState } from "react";

export const useToken = (): [string | null, (newToken: string) => void] => {
  const [token, setTokenInternal] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setTokenInternal(newToken);
  };

  return [token, setToken];
};