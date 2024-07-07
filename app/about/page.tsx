import { subtitle, title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <section className={"mb-32"}>
      <div className="mb-8">
        <h1 className={title()}>About</h1>
      </div>

      <p className={"mb-8"}>
        Welcome to LearnCenter, your ultimate study companion designed to make learning
        more efficient and enjoyable. Discover the powerful features that set LearnCenter
        apart and help you achieve your educational goals.
      </p>

      <h2 className={subtitle()}>Note Taking</h2>
      <p className="mb-8">
        With LearnCenter, you can store all your notes and study resources in one
        convenient place. Our intuitive tools make it easy to organize your
        materials, ensuring you always have what you need at your fingertips.
        Say goodbye to scattered notes and hello to a streamlined study experience.
      </p>

      <h2 className={subtitle()}>Flashcards</h2>
      <p className="mb-8">
        Flashcards are a proven study tool that can help you memorize key concepts
        and terms. LearnCenter offers a flashcard feature that allows you to create
        custom flashcards for any subject. Test yourself, track your progress, and
        master the material in no time.
      </p>

      <h2 className={subtitle()}>AI Generation</h2>
      <p className="mb-16">
        Harness the power of artificial intelligence with LearnCenter's AI generation
        feature. Our AI can automatically create quizzes based on your study resources,
        tailoring questions to suit your learning needs. This smart tool saves you
        time and effort, allowing you to focus on mastering the material.
      </p>

      <div className="mb-8">
        <h2 className={title()}>Project's status</h2>
      </div>
      <p className={"mb-4"}>
        LearnCenter is still in development, and I'm working hard to make it the best learning platform for you. As a solo entrepreneur, I'm dedicated to improving each feature and making everything work smoothly. Thank you for your patience and support as I continue to build and enhance LearnCenter.
      </p>
      <p className={"mb-4"}>Stay tuned for updates!</p>
    </section>
  );
}
