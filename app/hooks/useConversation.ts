"use client";

import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

type ConversationHookResult = {
  isOpen: boolean;
  conversationId: string;
};

const useConversation = (): ConversationHookResult => {
  const params = useParams();
  const pathname = usePathname();

  const conversationId = useMemo(() => {
    if (!pathname) return "";

    const paths = pathname.split("/");
    const id = paths[paths.length - 1];

    return id || "";
  }, [pathname]);

  const isOpen = useMemo(() => {
    if (!pathname) return false;

    const isConversationPath = pathname.includes("/conversations/");
    const isNewConversationPath = pathname.includes("/conversations/new");

    return isConversationPath && !isNewConversationPath;
  }, [pathname]);

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
