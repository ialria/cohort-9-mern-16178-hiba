import Button from "./../../../../components/Button.jsx";

function NoteToolBar({ onSave, saveStatus }) {
  return (
    <div className="flex justify-between items-center border-b border-text/20 py-2 px-4 md:px-6">
      <p className="text-sm text-text-muted">
        {saveStatus === "saving"
          ? "Saving..."
          : saveStatus === "saved"
            ? "All changes saved"
            : saveStatus === "unsaved"
              ? "Unsaved changes"
              : saveStatus === "error"
          ? "Save failed"
          : ""}
      </p>

      <div className="flex gap-2">
        <Button
          onClick={onSave}
          disabled={saveStatus !== "unsaved" && saveStatus !== "error"}
          className="bg-primary text-surface"
        >
          {saveStatus === "saved"
            ? "Saved note"
            : saveStatus === "error"
              ? "Retry"
              : "Save note"}
        </Button>
      </div>
    </div>
  );
}

export default NoteToolBar;
