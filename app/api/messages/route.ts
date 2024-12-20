import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversationId: conversationId,
        senderId: currentUser.id,
        seenIds: [currentUser.id],
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messagesIds: {
          push: newMessage.id,
        },
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log("ERROR_MESSAGES", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
