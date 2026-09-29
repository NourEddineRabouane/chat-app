import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await fetch(`${process.env.BACKEND_API_URL}/auth/logout`);

    const cookieStore = await cookies();

    // Clear the backend tokens from NextJS domain memory
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.error();
  }
}
