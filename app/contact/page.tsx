import { subtitle, title } from "@/components/primitives";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";
import { Socials } from "@/components/home/socialSection";
import clsx from "clsx";

export default function Contact() {
  return (
    <section>
      <div className="mb-8 pb-16 border-b">
        <h1 className={title()}>Contact Us</h1>
        <h2 className={subtitle()}>
          Follow us on social media or complete the contact form below to stay in touch!
        </h2>
      </div>

      <div className="mb-16 pb-8 border-b mx-auto">
        <Socials size={70} />
      </div>

      <form
        method={"post"}
        action={"https://formspree.io/f/movaqbdr"}
        className={"max-w-[800px] mx-auto mb-32"}
      >
        <h2 className={clsx(subtitle(), "!text-3xl text-center mb-8")}>Contact form</h2>
        <Input
          placeholder="Name"
          name="name"
          required
          className={"mb-4"}
        />

        <Input
          placeholder="Email"
          type="email"
          name="email"
          required
          className={"mb-4"}
        />

        <Textarea
          placeholder="Message"
          name="message"
          required
          className={"mb-8"}
        />

        <div className="w-full text-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </section>
  );
}