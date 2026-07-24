import { useEffect } from "react";

interface KeyboardProps {
  onNext: () => void;
  onPrev: () => void;
  onApprove: () => void;
  onReject: () => void;
  isEditing: boolean;
  onFocusEditor: () => void;
  onCloseSettings: () => void;
  onToggleCmdK: () => void;
}

export function useKeyboard({
  onNext,
  onPrev,
  onApprove,
  onReject,
  isEditing,
  onFocusEditor,
  onCloseSettings,
  onToggleCmdK
}: KeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global Cmd+K or Ctrl+K intercept
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggleCmdK();
        return;
      }

      // Focus tracking override
      if (isEditing) {
        if (e.key === "Escape") {
          e.preventDefault();
          // Blur focus from active element (which triggers isEditing transition)
          (document.activeElement as HTMLElement)?.blur();
        }
        return;
      }

      // Ignore shortcut key handlers if any browser form element is focused by chance
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "j":
        case "arrowdown":
          e.preventDefault();
          onNext();
          break;
        case "k":
        case "arrowup":
          e.preventDefault();
          onPrev();
          break;
        case "a":
          e.preventDefault();
          onApprove();
          break;
        case "r":
          e.preventDefault();
          onReject();
          break;
        case "e":
          e.preventDefault();
          onFocusEditor();
          break;
        case "escape":
          e.preventDefault();
          onCloseSettings();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrev, onApprove, onReject, isEditing, onFocusEditor, onCloseSettings, onToggleCmdK]);
}
