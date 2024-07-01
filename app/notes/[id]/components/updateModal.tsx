import React, { useContext, useState } from "react";
import NoteContext from "@/app/notes/[id]/context/NoteContext";
import { ZodError } from "zod";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Divider } from "@nextui-org/divider";
import ZodErrorParagraph from "@/components/ZodErrorParagraph";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

export function UpdateModal({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { note, setNote } = useContext(NoteContext);
  const [title, setTitle] = useState<string>(note.title);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ZodError | null>(null);

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={"inside"}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Settings</ModalHeader>
            <Divider />
            <ModalBody className={"py-4"}>
              <ZodErrorParagraph error={error} path={["title"]} />
              <Input
                className={"mb-4"}
                label={"Title"}
                placeholder={"Note title"}
                type={"text"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={loading}
              />

              {!confirmDelete && (
                <div className={"flex justify-end"}>
                  <Button
                    type={"button"}
                    onClick={() => setConfirmDelete(true)}
                    color={"danger"}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              )}

              {confirmDelete && (
                <div className="flex items-end justify-between gap-8">
                  <p>Are you sure you want to delete this note?</p>

                  <div className="flex gap-2">
                    <Button
                      type={"button"}
                      color={"danger"}
                      disabled={loading}
                      onClick={() => {
                        setLoading(true);
                        fetch(`/api/notes/${note._id}`, {
                          method: "DELETE"
                        })
                          .then((resp) => {
                            if (!resp.ok) throw resp.json();
                            return resp.json();
                          })
                          .then(() => {
                            onClose();
                            setLoading(false);
                            window.location.href = "/dashboard#notes";
                          })
                          .catch(async (err) => {
                            setError(await err);
                            setLoading(false);
                          });
                      }}
                    >
                      Confirm
                    </Button>

                    <Button
                      type={"button"}
                      onClick={() => setConfirmDelete(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button
                type={"button"}
                disabled={loading}
                className={"flex items-center gap-2"}
                onClick={() => {
                  setLoading(true);
                  fetch(`/api/notes/${note._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ ...note, title })
                  })
                    .then((resp) => {
                      if (!resp.ok) throw resp.json();
                      return resp.json();
                    })
                    .then((data) => {
                      setNote(data);
                      onClose();
                      setLoading(false);
                    })
                    .catch(async (err) => {
                      setError(await err);
                      setLoading(false);
                    });
                }}
              >
                {loading && (
                  <Spinner
                    size={"sm"}
                    color={"success"}
                  />
                )}
                Save
              </Button>

              <Button
                color={"danger"}
                onClick={onClose}
                type={"button"}
                disabled={loading}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}