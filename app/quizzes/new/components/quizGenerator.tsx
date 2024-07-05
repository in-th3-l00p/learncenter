import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import React, { useState } from "react";
import { NoteType } from "@/models/Note";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import GenerationAccordion from "@/components/NewForm/generation/GenerationAccordion";

export function QuizGenerator() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [note, setNote] = useState<NoteType | null>(null);
  const [selection, setSelection] = useState<string | null>(null);

  return (
    <>
      {note && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Generate from {note?.title}</ModalHeader>
                <Divider />
                <ModalBody>
                  {selection && (
                    <>
                      <p>Selection:</p>
                      <div
                        className={"max-h-[300px] overflow-y-auto"}
                      >
                        {selection}
                      </div>
                    </>
                  )}
                </ModalBody>
                <Divider />
                <ModalFooter>
                  <Button type={"button"}>Generate</Button>
                  <Button
                    type={"button"}
                    color={"danger"}
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <GenerationAccordion
        entityName={"quiz"}
        actions={[{
          name: "Generate questions",
          handler: (note, selection) => {
            setSelection(selection);
            setNote(note);
            onOpen();
          }
        }]}
      />
    </>
  );
}