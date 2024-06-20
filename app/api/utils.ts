import { NextResponse } from "next/server";

export const NotFoundResponse = NextResponse.json(
  {
    errors: [
      {
        path: "id",
        msg: "Not found",
      },
    ],
  },
  {
    status: 404,
  },
);

export const UnauthorizedResponse = NextResponse.json(
  {
    errors: [
      {
        msg: "Unauthorized",
      },
    ],
  },
  {
    status: 401,
  },
);
