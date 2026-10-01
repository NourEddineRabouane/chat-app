// Must use NEXT_PUBLIC_ for client-side environment variables
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!backendUrl) {
  throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
}

export type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export async function clientApi(
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

  const isFormData = rest.body instanceof FormData;

  return fetch(url.toString(), {
    ...rest,
    //  This tells the browser to automatically attach all cookies (including HttpOnly ones)
    // to the cross-origin request.
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
  });
}
