"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUserWithSession = (conversation: FullConversationType) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );
    return otherUser[0];
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

const useOtherUser = (conversation: FullConversationType) => {
  const OtherUserComponent = () => {
    const user = useOtherUserWithSession(conversation);
    return user;
  };

  return OtherUserComponent();
};

export default useOtherUser;
