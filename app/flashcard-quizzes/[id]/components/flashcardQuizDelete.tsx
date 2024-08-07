"use client";

import { Button } from "@nextui-org/button";
import clsx from "clsx";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useContext, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";

import { subtitle } from "@/components/primitives";
import FlashcardQuizContext from "@/app/flashcard-quizzes/[id]/components/FlashcardQuizContext";

export default function FlashcardQuizDelete() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { flashcardQuiz } = useContext(FlashcardQuizContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div
      className={clsx(
        "pt-8 pb-16 border-t border-content1",
        "flex flex-wrap justify-between",
      )}
    >
      <div>
        <h2 className={subtitle()}>Delete flashcard quiz</h2>
        <p>Are you sure you want to delete this flashcard quiz?</p>
      </div>

      <div>
        <Button color={"danger"} type={"button"} onClick={onOpen}>
          Delete
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete flashcard quiz</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this flashcard quiz?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className={"flex justify-center items-center gap-4"}
                  color={"danger"}
                  disabled={loading}
                  type={"button"}
                  onClick={() => {
                    setLoading(true);
                    fetch(`/api/flashcard-quizzes/${flashcardQuiz._id}`, {
                      method: "DELETE",
                    })
                      .then((res) => {
                        if (!res.ok) throw res;

                        return res.json();
                      })
                      .then(() => {
                        router.push("/dashboard?flashcardQuizDeleted");
                      });
                  }}
                >
                  {loading && <Spinner color={"default"} size={"sm"} />}
                  Delete
                </Button>
                <Button disabled={loading} type={"button"} onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
