import { NextResponse } from "next/server";

export const NotFoundResponse = NextResponse.json(
  {
    issues: [
      {
        path: "id",
        message: "Not found",
      },
    ],
  },
  {
    status: 404,
  },
);

export const UnauthorizedResponse = NextResponse.json(
  {
    issues: [
      {
        message: "Unauthorized",
      },
    ],
  },
  {
    status: 401,
  },
);
