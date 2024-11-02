"use client";

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useCallback, useState } from "react";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/conversations", {
        userId: data.id,
      });
      setConversationId(response.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [data.id]);

  return (
    <div
      onClick={handleClick}
      className="
        w-full
        relative
        flex
        items-center
        space-x-3
        bg-white
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
      "
    >
      <Avatar user={data} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
      {conversationId && (
        <a href={`/conversations/${conversationId}`} className="hidden">
          Go to Conversation
        </a>
      )}
    </div>
  );
};

export default UserBox;
