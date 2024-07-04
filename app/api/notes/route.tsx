import { getServerSession } from "next-auth";
import Note from "@/models/Note";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      status: 401,
      body: { error: "Unauthorized" },
    };
  }

  const { searchParams } = new URL(req.url);

  let query = Note.find({
    "users.userId": session.user?.id,
  })
    .sort({
      createdAt: "asc",
    });
  if (searchParams.has("ids")) {
    query = query.find({
      _id: {
        $in: searchParams.get("ids")!.split(","),
      },
    });
  }
  if (searchParams.has("select"))
    query = query
      .select(searchParams.get("select")!
      .replace(",", " "))

  return NextResponse.json(await query.exec());
}