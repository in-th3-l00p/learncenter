"use client";

import React, { useContext, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import clsx from "clsx";

import { subtitle, title } from "@/components/primitives";
import NoteContext from "@/app/notes/[id]/context/NoteContext";
import { INote } from "@/models/Note";
import { IUser } from "@/models/User";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import Editor from "@/app/notes/[id]/components/editor";
import { Button } from "@nextui-org/button";
import { IoSettings } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import ZodErrorParagraph from "@/components/ZodErrorParagraph";
import { Input } from "@nextui-org/input";
import { ZodError } from "zod";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";

function OwnerName() {
  const { note } = useContext(NoteContext);
  const [user, setUser] = useState<IUser | null>(null);

  function getNoteOwner(note: INote) {
    return note.users[0].userId;
  }

  useEffect(() => {
    fetch("/api/users/" + getNoteOwner(note))
      .then((resp) => resp.json())
      .then(setUser);
  }, [note]);

  if (user === null) return <Skeleton className={"w-32 h-6 rounded-md"} />;

  return <span>{user.name}</span>;
}

function NoteButtons() {
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onOpenChange: onSettingsOpenChange
  }  = useDisclosure();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { note, setNote } = useContext(NoteContext);
  const [title, setTitle] = useState<string>(note.title);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ZodError | null>(null);

  return (
    <div className={"flex flex-col gap-4"}>
      <Modal
        isOpen={isSettingsOpen}
        scrollBehavior={"inside"}
        onOpenChange={onSettingsOpenChange}
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
                            method: "DELETE",
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
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ ...note, title }),
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

export default function NoteEditor() {
  const { note } = useContext(NoteContext);

  return (
    <section>
      <div className={"mb-8 pb-4 border-b"}>
        <PageBreadcrumbs
          back={"/dashboard#notes"}
          path={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Notes", href: "/dashboard#notes" },
            { title: `Note "${note.title}"` },
          ]}
        />

        <div className="flex w-full justify-between gap-4">
          <div>
            <h1 className={title()}>Note: {note.title}</h1>
            <h2 className={subtitle()}>
              Created at: {new Date(note.createdAt).toLocaleDateString()}
            </h2>
            <h2 className={clsx(subtitle(), "flex items-center gap-2")}>
              Created by:
              <OwnerName />
            </h2>
          </div>

          <NoteButtons />
        </div>
      </div>

      <Editor />
    </section>
  );
}
