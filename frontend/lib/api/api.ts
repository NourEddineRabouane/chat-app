import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API_URL;

if (!backendUrl) {
  throw new Error("BACKEND_API_URL is not defined");
}

export type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export async function api(
  path: string,
  options: ApiOptions = {},
): Promise<Response> {
  const { params, headers, ...rest } = options;

  const url = new URL(`${backendUrl}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const cookieHeader = (await cookies()).toString();
  const isFormData = rest.body instanceof FormData;

  return fetch(url.toString(), {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Cookie: cookieHeader,
      ...headers,
    },
    cache: rest.cache ?? "no-store",
  });
}
