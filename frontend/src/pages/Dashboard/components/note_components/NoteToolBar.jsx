import Button from "./../../../../components/Button.jsx";
function NoteToolBar() {
  return (
    <div className="flex justify-between items-center border-b border-text/20 py-2 px-4 md:px-6">
      <p className="text-sm text-text-muted">All changes saved</p>
      <div className="flex gap-2">
        <Button
          className="bg-surface border border-text-disabled text-text-muted font-semibold"
        >Cancel</Button>
        <Button className="bg-primary text-surface">
          <span className="md:hidden">Save</span>
          <span className="hidden md:inline">Save note</span>
        </Button>
      </div>
    </div>
  );
}

export default NoteToolBar;
