import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST() {
  cookies().delete(ADMIN_ACCESS_COOKIE);
  return NextResponse.json({ ok: true });
}
