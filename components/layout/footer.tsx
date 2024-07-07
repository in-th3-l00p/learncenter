export default function Footer() {
  return (
    <footer className={"bg-background py-4"}>
      <p className={"text-center text-sm"}>
        &copy; {new Date().getFullYear()} LearnCenter. All rights reserved.
      </p>
    </footer>
  );
}