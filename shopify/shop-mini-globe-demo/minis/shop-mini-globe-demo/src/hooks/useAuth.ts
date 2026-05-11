// src/hooks/useAuth.ts
import {
  useGenerateUserToken,
  useSecureStorage,
} from "@shopify/shop-minis-react";
import { useCallback, useEffect, useState } from "react";
import { GADGET_API_BASE } from "../config";

const AUTH_API = `${GADGET_API_BASE}/shop-mini/auth`;

interface AuthData {
  token: string;
  expiresAt: number;
}

export function useAuth() {
  const { generateUserToken } = useGenerateUserToken();
  const { getSecret, setSecret, removeSecret } = useSecureStorage();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load stored token on mount
  useEffect(() => {
    async function loadToken() {
      try {
        const stored = await getSecret();
        if (stored && stored != "secret-value") {
          const data: AuthData = JSON.parse(stored);
          // Check if still valid (with 1 day buffer)
          if (data.expiresAt > Date.now() + 86400000) {
            setJwtToken(data.token);
          } else {
            await removeSecret(); // Clear expired token
          }
        } else {
          await removeSecret();
        }
      } catch (error) {
        console.error("Failed to load token:", error);
      }
    }
    loadToken();
  }, [getSecret, removeSecret]);

  // Get or refresh JWT token
  const getValidToken = useCallback(async (): Promise<string> => {
    // Check if current token is still valid
    if (jwtToken) {
      const stored = await getSecret();
      if (stored) {
        const data: AuthData = JSON.parse(stored);
        if (data.expiresAt > Date.now() + 86400000) {
          return jwtToken;
        }
      }
    }

    // Get new token
    setIsLoading(true);
    try {
      // Get Shop Mini token
      const result = await generateUserToken();
      if (!result.data?.token) {
        throw new Error("Failed to generate Shop Mini token");
      }

      // Exchange for JWT
      const response = await fetch(AUTH_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${result.data.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const { token, expiresIn } = await response.json();

      // Store securely
      const authData: AuthData = {
        token,
        expiresAt: Date.now() + expiresIn * 1000,
      };
      await setSecret({ value: JSON.stringify(authData) });

      setJwtToken(token);
      return token;
    } finally {
      setIsLoading(false);
    }
  }, [jwtToken, generateUserToken, getSecret, setSecret]);

  // Clear authentication
  const clearAuth = useCallback(async () => {
    await removeSecret();
    setJwtToken(null);
  }, [removeSecret]);

  return { getValidToken, clearAuth, isLoading, isAuthenticated: !!jwtToken };
}
