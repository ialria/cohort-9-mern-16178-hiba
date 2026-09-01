import Button from "./../../../../components/Button.jsx";

function NoteToolBar({ onSave, saveStatus, onCancel }) {
  let statusMessage = "";

  if (saveStatus === "saving") {
    statusMessage = "Saving...";
  } else if (saveStatus === "saved") {
    statusMessage = "All changes saved";
  } else if (saveStatus === "unsaved") {
    statusMessage = "Unsaved changes";
  } else if (saveStatus === "validation-error") {
    statusMessage = "Note content cannot be empty";
  }

  let saveButtonText = "Save note";

  if (saveStatus === "saved") {
    saveButtonText = "Saved note";
  } else if (saveStatus === "error") {
    saveButtonText = "Retry";
  }

  return (
    <div className="flex justify-between items-center border-b border-text/20 py-2 px-4 md:px-6">
      <p className="text-sm text-text-muted">
        {statusMessage}
      </p>

      <div className="flex gap-2">
        <Button
          onClick={onCancel}
          className="bg-surface border border-text/20 text-text hover:bg-text/5"
        >
          Cancel
        </Button>

        <Button
          onClick={onSave}
          disabled={
            saveStatus !== "unsaved" &&
            saveStatus !== "error" &&
            saveStatus !== "validation-error"
          }
          className="bg-primary text-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveButtonText}
        </Button>
      </div>
    </div>
  );
}

export default NoteToolBar;