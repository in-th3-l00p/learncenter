"use client";

import { useDisclosure } from "@nextui-org/modal";
import GenerateModal from "@/app/notes/[id]/components/generateModal";
import { Button } from "@nextui-org/button";
import { RiAiGenerate } from "react-icons/ri";
import React from "react";

export default function GenerationButton() {
  const {
    isOpen: isGenerateOpen,
    onOpen: onGenerateOpen,
    onOpenChange: onGenerateOpenChange
  } = useDisclosure();

  return (
    <>
      <GenerateModal
        isOpen={isGenerateOpen}
        onOpenChange={onGenerateOpenChange}
      />

      <Button
        title={"Generate"}
        type={"button"}
        isIconOnly
        onClick={onGenerateOpen}
      >
        <RiAiGenerate />
      </Button>
    </>
  );
}