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
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        image: image,
        senderId: currentUser.id,
        seenIds: [currentUser.id],
        conversationId: conversationId,
      },
    });

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messagesIds: {
          push: newMessage.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("InternalError", { status: 500 });
  }
}
