"use client";

import {
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Modal
} from "@nextui-org/modal";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useContext, useState } from "react";
import NoteContext from "@/app/notes/[id]/context/NoteContext";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";

export default function GenerateModal({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { note } = useContext(NoteContext);
  const [flashcardAdditionalInfo, setFlashcardAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={"inside"}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Generate</ModalHeader>
            <Divider />
            <ModalBody className={"py-4"}>
              <p>Generate a flashcards quiz</p>
              <Input
                value={flashcardAdditionalInfo}
                onChange={(e) => setFlashcardAdditionalInfo(e.target.value)}
                placeholder={`Additional information (e.g. "each flashcard should have maximum 2 sentences")`}
                readOnly={loading}
              />

              <div>
                <Button
                  disabled={loading}
                  className={"flex justify-center items-center gap-2"}
                  onClick={() => {
                    setLoading(true);
                    fetch("/api/flashcard-quizzes/generate", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        noteId: note._id,
                      }),
                    })
                      .then((res) => {
                        if (!res.ok) throw res.json();
                        return res.json();
                      })
                      .then((data) => {
                        localStorage.setItem("new-flashcard-quiz", JSON.stringify({
                          ...data,
                          visibility: "public"
                        }));
                        router.push(`/flashcard-quizzes/new`);
                      })
                      .catch(async (err) => {
                        // todo better error handling
                        setLoading(false);
                      })
                  }}
                >
                  {loading && (
                    <Spinner color={"success"} size={"sm"} />
                  )}
                  Generate
                </Button>
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button
                onClick={onClose}
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