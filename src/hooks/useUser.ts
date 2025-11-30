import { useCallback, useEffect, useState } from "react";
import { useToken } from "./useToken";

export const useUser = () => {

  const [token] = useToken();

  const getPayloadFromToken = (token: string) => {

    const encodePayload = token.split(".")[1];
    
    return JSON.parse(atob(encodePayload));
  };

  const [user, setUser] = useState(() => {
    if (!token) return null;
    return getPayloadFromToken(token as string);
  });
    
  const refresh = useCallback(() => {
    if (!token) {
      setUser(null);
      return;
    }
    setUser(getPayloadFromToken(token));
  }, [token]);

    useEffect(() => {
        if (!token) {
            setUser(null);
        } else {
            setUser(getPayloadFromToken(token as string))
        }
    }, [token])
    
    return [user, refresh] as const;
};
