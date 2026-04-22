import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

type DemoUser = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  church_name: string;
  role: "user" | "reference" | "area_director" | "platform_admin";
};

const DEMO_PASSWORD = "Passw0rd!";
const CORE_DEMO_USERS: DemoUser[] = [
  {
    email: "demo.user@local.test",
    password: DEMO_PASSWORD,
    first_name: "Demo",
    last_name: "User",
    church_name: "Grace Church",
    role: "user",
  },
  {
    email: "demo.reference@local.test",
    password: DEMO_PASSWORD,
    first_name: "Demo",
    last_name: "Reference",
    church_name: "Grace Church",
    role: "reference",
  },
  {
    email: "demo.admin@local.test",
    password: DEMO_PASSWORD,
    first_name: "Demo",
    last_name: "Admin",
    church_name: "Grace Church",
    role: "platform_admin",
  },
];

const AREA_DIRECTOR_DEMO_USER: DemoUser = {
  email: "demo.area@local.test",
  password: DEMO_PASSWORD,
  first_name: "Demo",
  last_name: "Area Director",
  church_name: "Grace Church",
  role: "area_director",
};

function isAlreadyRegisteredError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("already") || normalized.includes("registered");
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Demo user creation is disabled in production." },
      { status: 403 },
    );
  }

  const requesterClient = await createClient();
  const {
    data: { user: requester },
  } = await requesterClient.auth.getUser();

  if (!requester) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: requesterProfile } = await requesterClient
    .from("profiles")
    .select("role")
    .eq("id", requester.id)
    .single<{ role: string }>();

  if (requesterProfile?.role !== "platform_admin") {
    return NextResponse.json(
      { error: "Only platform_admin can create demo users." },
      { status: 403 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add both environment variables before using this utility.",
      },
      { status: 500 },
    );
  }

  const admin = createAdminClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  let includeAreaDirector = true;

  try {
    const body = (await request.json()) as { includeAreaDirector?: boolean };
    if (typeof body?.includeAreaDirector === "boolean") {
      includeAreaDirector = body.includeAreaDirector;
    }
  } catch {
    // keep default includeAreaDirector=true when body is empty
  }

  const targetUsers = includeAreaDirector
    ? [...CORE_DEMO_USERS, AREA_DIRECTOR_DEMO_USER]
    : CORE_DEMO_USERS;

  const results: Array<{ email: string; status: string }> = [];

  for (const demoUser of targetUsers) {
    const { data, error } = await admin.auth.admin.createUser({
      email: demoUser.email,
      password: demoUser.password,
      email_confirm: true,
      user_metadata: {
        first_name: demoUser.first_name,
        last_name: demoUser.last_name,
        church_name: demoUser.church_name,
      },
    });

    if (error && !isAlreadyRegisteredError(error.message)) {
      results.push({ email: demoUser.email, status: `failed: ${error.message}` });
      continue;
    }

    if (data.user?.id) {
      await admin.from("profiles").upsert(
        {
          id: data.user.id,
          email: demoUser.email,
          first_name: demoUser.first_name,
          last_name: demoUser.last_name,
          church_name: demoUser.church_name,
          role: demoUser.role,
        },
        { onConflict: "id" },
      );

      results.push({ email: demoUser.email, status: error ? "already existed, role synced" : "created" });
      continue;
    }

    await admin
      .from("profiles")
      .update({
        role: demoUser.role,
        first_name: demoUser.first_name,
        last_name: demoUser.last_name,
        church_name: demoUser.church_name,
      })
      .eq("email", demoUser.email);

    results.push({ email: demoUser.email, status: "already existed, role synced" });
  }

  return NextResponse.json({
    message: includeAreaDirector
      ? "Demo user operation complete (including area director)."
      : "Demo user operation complete (core roles only).",
    shared_password: DEMO_PASSWORD,
    users: results,
  });
}
