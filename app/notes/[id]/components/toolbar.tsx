"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import clsx from "clsx";
import { Editor } from "@tiptap/core";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon, ImageIcon,
  LinkIcon,
  StrikethroughIcon
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { HexColorPicker } from "react-colorful";

function ContentType({ editor }: { editor: Editor }) {
  const TYPES: {
    [key: string]: {
      title: string;
      value: string;
      isActive: () => boolean;
      setActive: () => void;
    };
  } = {
    "p": {
      title: "Paragraph",
      value: "p",
      isActive: () => editor.isActive("paragraph"),
      setActive: () => editor.chain().focus().setParagraph().run()
    },
    "h1": {
      title: "Heading 1",
      value: "h1",
      isActive: () => editor.isActive("heading", { level: 1 }),
      setActive: () => editor.chain().focus().setHeading({ level: 1 }).run()
    },
    "h2": {
      title: "Heading 2",
      value: "h2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      setActive: () => editor.chain().focus().setHeading({ level: 2 }).run()
    },
    "h3": {
      title: "Heading 3",
      value: "h3",
      isActive: () => editor.isActive("heading", { level: 3 }),
      setActive: () => editor.chain().focus().setHeading({ level: 3 }).run()
    },
    "h4": {
      title: "Heading 4",
      value: "h4",
      isActive: () => editor.isActive("heading", { level: 4 }),
      setActive: () => editor.chain().focus().setHeading({ level: 4 }).run()
    },
    "h5": {
      title: "Heading 5",
      value: "h5",
      isActive: () => editor.isActive("heading", { level: 5 }),
      setActive: () => editor.chain().focus().setHeading({ level: 5 }).run()
    },
    "h6": {
      title: "Heading 6",
      value: "h6",
      isActive: () => editor.isActive("heading", { level: 6 }),
      setActive: () => editor.chain().focus().setHeading({ level: 6 }).run()
    },
    "blockquote": {
      title: "Blockquote",
      value: "blockquote",
      isActive: () => editor.isActive("blockquote"),
      setActive: () => editor.chain().focus().setBlockquote().run()
    },
    "code_block": {
      title: "Code Block",
      value: "code_block",
      isActive: () => editor.isActive("codeBlock"),
      setActive: () => editor.chain().focus().setCodeBlock().run()
    }
  };

  const getActiveType = () => {
    for (const key in TYPES) {
      const type = TYPES[key];
      if (type.isActive()) {
        return type;
      }
    }
    return TYPES["p"];
  }

  return (
    <Select
      defaultSelectedKeys={["p"]}
      selectedKeys={[getActiveType().value]}
      className={"max-w-40"}
      size={"sm"}
      onChange={(e) => {
        const type = TYPES[e.target.value];
        if (type) {
          type.setActive();
        }
      }}
    >
      {Object.keys(TYPES).map((key) => {
        const type = TYPES[key];
        return (
          <SelectItem
            key={key}
            value={type.value}
          >
            {type.title}
          </SelectItem>
        )
      })}
    </Select>
  );
}

function TextColorButton({ editor }: { editor: Editor }) {
  return (
    <>
      <Popover
        placement={"bottom"}
      >
        <PopoverTrigger>
          <Button
            title={"Text color"}
            isIconOnly
            size={"sm"}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: editor.getAttributes("textStyle").color }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <HexColorPicker onChange={(color) => {
            editor.chain().setColor(color).run();
          }} />
        </PopoverContent>
      </Popover>
    </>
  );
}

function StyleButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <Button
        title={"Bold"}
        isIconOnly
        className={clsx("font-bold")}
        size={"sm"}
        variant={editor?.isActive("bold") ? "flat" : "solid"}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        B
      </Button>
      <Button
        title={"Italic"}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        variant={editor?.isActive("italic") ? "flat" : "solid"}
        isIconOnly
        className={"font-italic"}
        size={"sm"}
      >
        I
      </Button>
      <Button
        title={"Underline"}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        variant={editor?.isActive("underline") ? "flat" : "solid"}
        isIconOnly
        className={"underline"}
        size={"sm"}
      >
        U
      </Button>
      <Button
        title={"Strike"}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        variant={editor?.isActive("strike") ? "flat" : "solid"}
        isIconOnly
        className={"text-strike"}
        size={"sm"}
      >
        <StrikethroughIcon size={15} />
      </Button>
      <Button
        title={"Inline code"}
        onClick={() => editor?.chain().focus().toggleCode().run()}
        variant={editor?.isActive("code") ? "flat" : "solid"}
        isIconOnly
        className={"font-mono"}
        size={"sm"}
      >
        {"</>"}
      </Button>
      <TextColorButton editor={editor} />
    </>
  );
}

function AlignmentButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <Button
        title={"Align Left"}
        isIconOnly
        className={"text-left"}
        size={"sm"}
        variant={editor?.isActive({ textAlign: "left" }) ? "flat" : "solid"}
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeftIcon size={20} />
      </Button>
      <Button
        title={"Align Center"}
        isIconOnly
        className={"text-center"}
        size={"sm"}
        variant={editor?.isActive({ textAlign: "center" }) ? "flat" : "solid"}
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenterIcon size={20} />
      </Button>
      <Button
        title={"Align Right"}
        isIconOnly
        className={"text-right"}
        size={"sm"}
        variant={editor?.isActive({ textAlign: "right" }) ? "flat" : "solid"}
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
      >
        <AlignRightIcon size={20} />
      </Button>
      <Button
        title={"Align Justify"}
        isIconOnly
        className={"text-justify"}
        size={"sm"}
        variant={editor?.isActive({ textAlign: "justify" }) ? "flat" : "solid"}
        onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustifyIcon size={20} />
      </Button>
    </>
  );
}

function LinkButton({ editor }: { editor: Editor }) {
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!isLinkPopoverOpen) {
      setLink("");
      return;
    }

    const link = editor?.isActive("link");
    if (link)
      setLink(editor.getAttributes("link").href);
  }, [isLinkPopoverOpen]);

  return (
    <Popover
      placement={"bottom"}
      isOpen={isLinkPopoverOpen}
      onOpenChange={(open) => setIsLinkPopoverOpen(open)}
    >
      <PopoverTrigger>
        <Button
          title={"Link"}
          isIconOnly
          className={"text-link"}
          size={"sm"}
          variant={editor?.isActive("link") ? "flat" : "solid"}
        >
          <LinkIcon size={15} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"py-2"}>
        <Input
          placeholder={"Enter link"}
          size={"sm"}
          className={"w-40 mb-2"}
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!link) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().toggleLink({ href: link }).run();
            setIsLinkPopoverOpen(false);
          }}
          className={"w-full"}
        >
          <Button
            title={"Save"}
            type={"submit"}
            size={"sm"}
          >
            Save
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function ImageButton({ editor }: { editor: Editor }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // todo: implement (too lazy now)
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Upload an image</ModalHeader>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        title={"Image"}
        type={"button"}
        isIconOnly
        size={"sm"}
        onClick={() => onOpen()}
      >
        <ImageIcon size={15} />
      </Button>
    </>
  );
}

function ContentButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <LinkButton editor={editor} />
      <ImageButton editor={editor} />
    </>
  );
}

export default function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div
      className={"flex flex-wrap items-center gap-2 bg-content1 border-content1 rounded-lg mb-8 py-1 px-2"}
    >
      <ContentType editor={editor} />
      <Divider orientation={"vertical"} />
      <StyleButtons editor={editor} />
      <Divider orientation={"vertical"} />
      <AlignmentButtons editor={editor} />
      <Divider orientation={"vertical"} />
      <ContentButtons editor={editor} />
    </div>
  )
}