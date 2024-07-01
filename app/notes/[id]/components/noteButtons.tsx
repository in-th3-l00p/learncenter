import { useDisclosure } from "@nextui-org/modal";
import { UpdateModal } from "@/app/notes/[id]/components/updateModal";
import { Button } from "@nextui-org/button";
import { IoSettings } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";
import React from "react";

export function NoteButtons() {
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onOpenChange: onSettingsOpenChange
  } = useDisclosure();

  return (
    <div className={"flex flex-col gap-4"}>
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

      <Button
        title={"Generate"}
        type={"button"}
        isIconOnly
      >
        <RiAiGenerate />
      </Button>
    </div>
  );
}