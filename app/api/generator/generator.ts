import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NotFoundResponse, UnauthorizedResponse } from "@/app/api/utils";
import { NextResponse } from "next/server";
import Note from "@/models/Note";
import generate from "@/app/api/generator/generations";
import User from "@/models/User";
import stripe from "@/lib/stripe";

const requestSchema = z.object({
  noteId: z.string().min(1),
  additionalQuery: z.string().optional()
});

export default function createGenerator(
  entityName: string,
  schema: any,
  additionalSchemaDescription: string,
  zodSchema: z.Schema
): (req: Request) => Promise<NextResponse> {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);
    if (!session) return UnauthorizedResponse;

    const user = await User.findById(session.user.id);
    if (!user) return UnauthorizedResponse;

    if (!user.subscriptionId)
      return UnauthorizedResponse;

    const subscription =
      await stripe.subscriptions.retrieve(user.subscriptionId);
    if (!subscription || subscription.status !== "active")
      return UnauthorizedResponse;

    const body = requestSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json(
        JSON.stringify(body.error),
        { status: 400 }
      );
    }

    const note = await Note.findById(body.data.noteId);
    if (!note) return NotFoundResponse;
    if (note.users[0].userId.toString() !== session.user.id)
      return UnauthorizedResponse;

    try {
      return NextResponse.json(
        await generate(
          note,
          entityName,
          schema,
          additionalSchemaDescription,
          zodSchema,
          user.customerId,
          body.data.additionalQuery
        ),
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        error,
        { status: 400 }
      );
    }
  }
}