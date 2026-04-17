import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  church_name: string | null;
  created_at: string;
};

export async function getCurrentUserWithProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,first_name,last_name,role,church_name,created_at")
    .eq("id", user.id)
    .single<Profile>();

  return { user, profile: profile ?? null };
}
