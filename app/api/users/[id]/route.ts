import { NextResponse } from "next/server";

import User from "@/models/User";
import { NotFoundResponse } from "@/app/api/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await User.findById(params.id);

    if (!user) return NotFoundResponse;

    return NextResponse.json(user);
  } catch (e) {
    return NotFoundResponse;
  }
}
