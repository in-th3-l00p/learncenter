import { useEffect } from "react";

const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
  let confirmationMessage =
    "You have unsaved progress." +
    "If you leave before saving, your changes will be lost.";

  e.returnValue = confirmationMessage; //Gecko + IE

  return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
};

export function useBeforeUnloadHandler(unsavedChanges: boolean) {
  useEffect(() => {
    if (!unsavedChanges) {
      window.removeEventListener("beforeunload", beforeUnloadHandler);

      return;
    }

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [unsavedChanges]);
}

export default beforeUnloadHandler;