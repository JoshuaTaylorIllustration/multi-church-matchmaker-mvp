import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

type RequestBody = {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  church_name?: string;
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Dev quick signup is disabled in production." },
      { status: 403 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as RequestBody;

  if (!body.email || !body.password || !body.first_name || !body.last_name) {
    return NextResponse.json(
      { error: "email, password, first_name, and last_name are required." },
      { status: 400 },
    );
  }

  const admin = createAdminClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: {
      first_name: body.first_name,
      last_name: body.last_name,
      church_name: body.church_name ?? "",
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.user?.id) {
    return NextResponse.json(
      { error: "User was created but no user id was returned." },
      { status: 500 },
    );
  }

  await admin.from("profiles").upsert(
    {
      id: data.user.id,
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      church_name: body.church_name ?? null,
      role: "user",
    },
    { onConflict: "id" },
  );

  return NextResponse.json({
    message: "Dev quick signup complete. You can log in immediately.",
    email: body.email,
  });
}
