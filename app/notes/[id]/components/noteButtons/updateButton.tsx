"use client";

import { useDisclosure } from "@nextui-org/modal";
import { UpdateModal } from "@/app/notes/[id]/components/updateModal";
import React from "react";
import { Button } from "@nextui-org/button";
import { IoSettings } from "react-icons/io5";

export default function UpdateButton() {
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onOpenChange: onSettingsOpenChange
  } = useDisclosure();

  return (
    <>
      <UpdateModal
        isOpen={isSettingsOpen}
        onOpenChange={onSettingsOpenChange}
      />

      <Button
        title={"Settings"}
        type={"button"}
        isIconOnly
        onClick={onSettingsOpen}
      >
        <IoSettings />
      </Button>
    </>
  );
}