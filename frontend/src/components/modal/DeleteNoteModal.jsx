import Modal from "./Modal.jsx";
import Button from "../Button.jsx";

function DeleteNoteModal({
  isOpen,
  onClose,
  note,
  onConfirm,
}) {
  if (!note) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-text">
        Delete note permanently?
      </h2>

      <p className="mt-3 text-sm text-text-muted">
        Are you sure you want to permanently delete{" "}
        <span className="font-medium text-text">
          "{note.title}"
        </span>
        ? This action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          onClick={onClose}
          className="border border-border bg-surface text-text"
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={onConfirm}
          className="bg-delete-primary text-surface"
        >
          Delete Forever
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteNoteModal;