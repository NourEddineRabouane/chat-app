import { clientApi } from "@/lib/api/clientApi";
import type { UpdateUserProfileRequest, UserProfile } from "./user.types";

async function profileCall<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await clientApi(path, options);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Some Spring error responses have no JSON body.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const getCurrentProfile = () =>
  profileCall<UserProfile>("/api/users/me");

export const updateCurrentProfile = (request: UpdateUserProfileRequest) =>
  profileCall<UserProfile>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(request),
  });
