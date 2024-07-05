"use client";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function UnauthorizedToast() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("unauthorized"))
      toast({
        title: "Unauthorized",
        description: "You are not authorized to access this resource."
      });
  }, []);

  return (
    <></>
  );
}