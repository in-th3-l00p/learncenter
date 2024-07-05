"use client";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorToasts() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("unauthorized"))
      toast({
        title: "Unauthorized",
        description: "You are not authorized to access this resource."
      });
    if (searchParams.has("error"))
      toast({
        title: "Error",
        description: "An error occurred while trying to access this resource."
      });
  }, []);

  return (
    <></>
  );
}