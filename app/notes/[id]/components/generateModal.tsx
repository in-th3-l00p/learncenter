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
import { ZodError } from "zod";
import { useToast } from "@/components/ui/use-toast";

function FlashcardQuizGenerator({ loading, setLoading }: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const { toast } = useToast();
  const { note } = useContext(NoteContext);
  const router = useRouter();
  const [flashcardAdditionalInfo, setFlashcardAdditionalInfo] = useState("");
  const [selfLoading, setSelfLoading] = useState(false);

  return (
    <div>
      <p>Generate a flashcards quiz</p>
      <Input
        value={flashcardAdditionalInfo}
        onChange={(e) => setFlashcardAdditionalInfo(e.target.value)}
        placeholder={`Additional information (e.g. "each flashcard should have maximum 2 sentences")`}
        readOnly={loading}
        className={"mb-2"}
      />

      <div>
        <Button
          disabled={loading}
          className={"flex justify-center items-center gap-2"}
          onClick={() => {
            setLoading(true);
            setSelfLoading(true);
            fetch("/api/flashcard-quizzes/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                noteId: note._id,
                additionalQuery: flashcardAdditionalInfo
              })
            })
              .then((res) => {
                if (!res.ok) throw res.json();
                return res.json();
              })
              .then((data) => {
                localStorage.setItem("selected-flashcard-index", "0");
                localStorage.setItem("new-flashcard-quiz", JSON.stringify({
                  ...data,
                  visibility: "public"
                }));
                router.push(`/flashcard-quizzes/new`);
              })
              .catch(async (err: ZodError) => {
                setLoading(false);
                setSelfLoading(false);
                toast({
                  title: "Error",
                  description: (await err).issues[0].message,
                });
              });
          }}
        >
          {selfLoading && (
            <Spinner color={"success"} size={"sm"} />
          )}
          Generate
        </Button>
      </div>
    </div>
  );
}

function QuizGenerator({ loading, setLoading }: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const { toast } = useToast();
  const { note } = useContext(NoteContext);
  const router = useRouter();
  const [quizAdditionalInfo, setQuizAdditionalInfo] = useState("");
  const [selfLoading, setSelfLoading] = useState(false);

  return (
    <div>
      <p>Generate a quiz</p>
      <Input
        value={quizAdditionalInfo}
        onChange={(e) => setQuizAdditionalInfo(e.target.value)}
        placeholder={`Additional information (e.g. "each quiz should have maximum 2 questions")`}
        readOnly={loading}
        className={"mb-2"}
      />

      <div>
        <Button
          disabled={loading}
          className={"flex justify-center items-center gap-2"}
          onClick={() => {
            setLoading(true);
            setSelfLoading(true);
            fetch("/api/quizzes/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                noteId: note._id,
                additionalQuery: quizAdditionalInfo
              })
            })
              .then((res) => {
                if (!res.ok) throw res.json();
                return res.json();
              })
              .then((data) => {
                localStorage.setItem("selected-question-index", "0");
                localStorage.setItem("selected-option-index", "0");
                localStorage.setItem("new-quiz", JSON.stringify({
                  ...data,
                  visibility: "public"
                }));
                router.push(`/quizzes/new`);
              })
              .catch(async (err: Promise<ZodError>) => {
                setLoading(false);
                setSelfLoading(false);
                toast({
                  title: "Error",
                  description: (await err).issues[0].message,
                });
              });
          }}
        >
          {selfLoading && (
            <Spinner color={"success"} size={"sm"} />
          )}
          Generate
        </Button>
      </div>
    </div>
  );
}

export default function GenerateModal({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
              <QuizGenerator
                loading={loading}
                setLoading={setLoading}
              />
              <Divider />
              <FlashcardQuizGenerator
                loading={loading}
                setLoading={setLoading}
              />
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