import React from "react";
import { Button } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";

export default function SignOutButton() {
  const supabase = createClient();

  return (
    <Button color="danger" onPress={() => supabase!.auth.signOut()}>
      Sign out
    </Button>
  );
}
