import config from "../config";
import { redisClient } from "../utils/redis";

const ID_TOKEN_KEY = "bloodlink:bkash:idToken";
const REFRESH_TOKEN_KEY = "bloodlink:bkash:refreshToken";

interface IBkashTokenResponse {
  id_token?: string;
  refresh_token?: string;
  errorMessage?: string;
}

export const getBkashIdToken = async (): Promise<string> => {
  try {

    const bkashIdToken = await redisClient.get(ID_TOKEN_KEY);
    const bkashIdTokenTTL = await redisClient.ttl(ID_TOKEN_KEY);

    const bkashRefreshToken =
      await redisClient.get(REFRESH_TOKEN_KEY);
    const bkashRefreshTokenTTL =
      await redisClient.ttl(REFRESH_TOKEN_KEY);

 
    if (bkashIdToken && bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }
    if (
      bkashRefreshToken &&
      bkashRefreshTokenTTL > 600
    ) {
      const refreshResponse = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/token/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config.bkash_username,
            password: config.bkash_password,
          },
          body: JSON.stringify({
            app_key: config.bkash_app_key,
            app_secret: config.bkash_app_secret,
            refresh_token: bkashRefreshToken,
          }),
        }
      );

      const refreshResult =
        (await refreshResponse.json()) as IBkashTokenResponse;

      if (!refreshResponse.ok) {
        throw new Error(
          refreshResult.errorMessage ||
            "bKash token refresh failed"
        );
      }

      if (!refreshResult.id_token) {
        throw new Error(
          "Invalid bKash refresh token response"
        );
      }

      await redisClient.set(
        ID_TOKEN_KEY,
        refreshResult.id_token,
        {
          expiration: {
            type: "EX",
            value: 60 * 60,
          },
        }
      );

      return refreshResult.id_token;
    }


    const response = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config.bkash_username,
          password: config.bkash_password,
        },
        body: JSON.stringify({
          app_key: config.bkash_app_key,
          app_secret: config.bkash_app_secret,
        }),
      }
    );

    const result =
      (await response.json()) as IBkashTokenResponse;

    if (!response.ok) {
      throw new Error(
        result.errorMessage ||
          "bKash token grant failed"
      );
    }

    if (!result.id_token || !result.refresh_token) {
      throw new Error(
        "Invalid bKash token response"
      );
    }

    await redisClient.set(
      ID_TOKEN_KEY,
      result.id_token,
      {
        expiration: {
          type: "EX",
          value: 60 * 60,
        },
      }
    );

    // Save refresh token
    await redisClient.set(
      REFRESH_TOKEN_KEY,
      result.refresh_token,
      {
        expiration: {
          type: "EX",
          value: 60 * 60 * 24 * 28,
        },
      }
    );

    return result.id_token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("bKash authentication failed");
  }
};