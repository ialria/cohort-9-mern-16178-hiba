import Button from "./../../../../components/Button.jsx";
function NoteToolBar({onSave, saveStatus}) {
   const statusMessage = {
    idle: "",
    unsaved:"Unsaved changes",
    saving: "Saving...",
    saved: "All changes saved",
    error: "Failed to save changes",
  };



  return (
    <div className="flex justify-between items-center border-b border-text/20 py-2 px-4 md:px-6">
      <p className="text-sm text-text-muted">{statusMessage[saveStatus]}</p>
      <div className="flex gap-2">
        <Button
          className="bg-surface border border-text-disabled text-text-muted font-semibold"
        >Cancel</Button>
        <Button onClick={onSave} className="bg-primary text-surface">
          <span className="md:hidden"> {saveStatus === "saved" ? "Saved" : "Save"}</span>
          <span className="hidden md:inline"> {saveStatus === "saved" ? "Saved ✓" : "Save note"}</span>
        </Button>
      </div>
    </div>
  );
}

export default NoteToolBar;
