import { useToast } from "@/components/ui/use-toast";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { NoteType } from "@/models/Note";
import { Divider } from "@nextui-org/divider";
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";

export function AddNote({ selectedNotes, setSelectedNotes }: {
  selectedNotes: string[];
  setSelectedNotes: (newSelectedNotes: string[]) => void;
}) {
  const { toast } = useToast();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [notes, setNotes] = useState<NoteType[] | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>(selectedNotes);

  useEffect(() => {
    fetch("/api/notes?select=_id,title", {
      cache: "no-cache"
    })
      .then((resp) => {
        if (!resp.ok)
          throw resp.json();
        return resp.json();
      })
      .then(setNotes)
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch notes for generation purposes"
        });
        setError(true);
      });
  }, []);

  useEffect(() => {
    setSelected(selectedNotes);
  }, [selectedNotes]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add note</ModalHeader>
              <Divider />
              <ModalBody className={"py-4"}>
                {error && (
                  <p className="text-center">Failed to fetch notes.</p>
                )}
                {(notes !== null && notes.length === 0) && (
                  <p className="text-center">You have no notes.</p>
                )}
                {!!notes && (
                  <CheckboxGroup
                    label={"Select notes"}
                    value={selected}
                    onValueChange={setSelected}
                  >
                    {notes.map((note, index) => (
                      <Checkbox
                        key={index}
                        value={note._id}
                      >
                        {note.title}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                )}
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button
                  type={"button"}
                  onClick={() => {
                    setSelectedNotes(selected);
                    onClose();
                  }}
                >
                  Select
                </Button>
                <Button
                  type={"button"}
                  color={"danger"}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button type={"button"} onClick={() => onOpen()} isIconOnly>
        +
      </Button>
    </>
  );
}