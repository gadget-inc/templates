const USER_TOKEN_VERIFY_MUTATION = `
  mutation VerifyUserToken($token: String!) {
    userTokenVerify(token: $token) {
      tokenExpiresAt
      publicId
      userIdentifier
      userState
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export interface TokenVerificationResult {
  isValid: boolean;
  publicId?: string;
  tokenExpiresAt?: string;
  userState?: "VERIFIED" | "GUEST";
  error?: string;
}

/**
 * Verify a user token with the Shop Minis Admin API
 * No caching - direct validation only
 */
export async function verifyShopMiniToken(
  token: string,
  adminApiUrl: string,
  adminApiKey: string
): Promise<TokenVerificationResult> {
  try {
    const response = await fetch(adminApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminApiKey}`,
      },
      body: JSON.stringify({
        query: USER_TOKEN_VERIFY_MUTATION,
        variables: { token },
      }),
    });

    if (!response.ok) {
      return {
        isValid: false,
        error: `Admin API request failed with status ${response.status}`,
      };
    }

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors?.length > 0) {
      return {
        isValid: false,
        error: result.errors[0].message || "GraphQL error occurred",
      };
    }

    // Check for user errors from the mutation
    const { userTokenVerify } = result.data || {};
    if (!userTokenVerify) {
      return {
        isValid: false,
        error: "Invalid response from Admin API",
      };
    }

    if (userTokenVerify.userErrors?.length > 0) {
      const error = userTokenVerify.userErrors[0];
      return {
        isValid: false,
        error: `${error.code}: ${error.message}`,
      };
    }

    // Token is valid
    const { publicId, tokenExpiresAt, userState } = userTokenVerify;

    return {
      isValid: true,
      publicId,
      tokenExpiresAt,
      userState,
    };
  } catch (error: any) {
    return {
      isValid: false,
      error: error.message || "Failed to verify token",
    };
  }
}
