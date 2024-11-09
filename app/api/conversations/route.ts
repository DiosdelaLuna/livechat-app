import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    console.log("Current User:", currentUser);

    if (!currentUser?.id || !currentUser?.email) {
      console.error("Unauthorized access: No current user found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { userId, isGroup, members, name } = body;
    console.log("Request Body:", body);

    if (isGroup && (!members || members.length < 2 || !name)) {
      console.error("Invalid group data:", { isGroup, members, name });
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          userIds: [
            ...members.map((member: { value: string }) => member.value),
            currentUser.id,
          ],
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        include: { users: true },
      });
      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userIds: { equals: [currentUser.id, userId] } },
          { userIds: { equals: [userId, currentUser.id] } },
        ],
      },
    });

    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        userIds: [currentUser.id, userId],
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: { users: true },
    });
    return NextResponse.json(newConversation);
  } catch (error: any) {
    console.error(
      "Error in POST /api/conversations:",
      error.message,
      error.stack
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
