"use client";

import { subtitle } from "@/components/primitives";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { spacing } from "@/components/NewForm/primitives";
import { AddNote } from "@/components/NewForm/generation/AddNote";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useEffect, useState } from "react";
import { NoteType } from "@/models/Note";
import Loading from "@/app/loading";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/button";

export default function GenerationAccordion({ entityName, actions }: {
  entityName: string;
  actions: {
    name: string;
    handler: (
      note: NoteType,
      selection: string
    ) => void;
  }[]
}) {
  const { toast } = useToast();
  const [notesIds, setNotesIds] = useLocalStorageState<string[]>(`${entityName}-generation-notes`, []);
  const [notes, setNotes] = useState<NoteType[] | null>(null);

  useEffect(() => {
    if (notesIds.length === 0) {
      setNotes([]);
      return;
    }

    setNotes(null);
    fetch(`/api/notes?ids=${notesIds.join(",")}`, {
      "cache": "no-cache"
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
          description: "Failed to fetch selected notes for generation purposes"
        })
      });
  }, [notesIds]);

  return (
    <div className={spacing()}>
      <div className={"flex items-center justify-between gap-8 mb-4"}>
        <h2 className={subtitle()}>Generate from note</h2>
        <AddNote
          selectedNotes={notesIds}
          setSelectedNotes={setNotesIds}
        />
      </div>

      {notesIds.length === 0 && (
        <p className="text-center">No selected notes.</p>
      )}

      {(notesIds.length > 0 && notes === null) && (
        <Loading />
      )}

      {notes !== null && (
        <Accordion>
          {notes.map((note) => (
            <AccordionItem
              key={note._id}
              aria-label={note.title}
              title={note.title}
            >
              <div
                id={`${note._id}-content`}
                className={"max-h-[300px] overflow-y-scroll pe-8 mb-4"}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />

              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    const divElement = document.getElementById(`${note._id}-content`);
                    if (!divElement)
                      return;

                    const selection = window.getSelection();
                    if (!selection || selection.isCollapsed)
                      return;

                    const node: Node = (selection as any).baseNode;
                    if (!node || !divElement.contains(node.parentElement))
                      return;

                    action.handler(note, selection.toString());
                  }}
                >
                  {action.name}
                </Button>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
