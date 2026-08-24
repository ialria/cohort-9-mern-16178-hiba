import { useRef, useState } from "react";
import {
  Download,
  Upload,
  ArrowDownUp,
  Check,
} from "../../../../icons/icons";

function NoteActionBar({ notes, onSort, onImport }) {
  const fileInput = useRef(null);

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("descending");

  function handleSortBy(newSortBy) {
    setSortBy(newSortBy);
    onSort(newSortBy, sortOrder);
  }

  function handleSortOrder(newSortOrder) {
    setSortOrder(newSortOrder);
    onSort(sortBy, newSortOrder);
  }

  function handleExport() {
    const notesToExport = notes.map((note) => ({
      title: note.title,
      content: note.content,
    }));

    const fileData = JSON.stringify(notesToExport, null, 2);

    const file = new Blob([fileData], {
      type: "application/json",
    });

    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "my-notes.json";
    link.click();

    URL.revokeObjectURL(fileUrl);
  }

 function handleImport(event) {
  const files = Array.from(event.target.files);

  if (files.length === 0) {
    return;
  }

  const importedNotes = [];
  let filesRead = 0;

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const fileContent = reader.result;

        if (file.name.endsWith(".json")) {
          const notesFromFile = JSON.parse(fileContent);

          if (
            !Array.isArray(notesFromFile) ||
            !notesFromFile.every(
              (note) =>
                typeof note === "object" &&
                typeof note.title === "string" &&
                typeof note.content === "string"
            )
          ) {
            alert(`Invalid notes file: ${file.name}`);
            return;
          }

          importedNotes.push(...notesFromFile);
        } else if (file.name.endsWith(".txt")) {
          importedNotes.push({
            title: file.name.replace(/\.txt$/i, ""),
            content: fileContent,
          });
        } else {
          alert(`Unsupported file: ${file.name}`);
          return;
        }

        filesRead++;

        if (filesRead === files.length) {
          onImport(importedNotes);
        }
      } catch (error) {
        alert(`Could not read ${file.name}.`);
      }
    };

    reader.readAsText(file);
  });

  event.target.value = "";
}

  return (
    <div className="flex items-center justify-end gap-2 px-5 md:px-8 mb-5">

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowSortMenu((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text transition hover:bg-primary-light"
        >
          <ArrowDownUp size={17} strokeWidth={1.8} />
          Sort
        </button>

        {showSortMenu && (
          <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-surface p-3 shadow-lg">

            <p className="mb-2 px-2 text-xs font-medium text-text-muted">
              Sort by
            </p>

            <button
              type="button"
              onClick={() => handleSortBy("date")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-text hover:bg-primary-light"
            >
              Date

              {sortBy === "date" && (
                <Check size={15} className="text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSortBy("title")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-text hover:bg-primary-light"
            >
              Title

              {sortBy === "title" && (
                <Check size={15} className="text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSortBy("pinned")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-text hover:bg-primary-light"
            >
              Pinned

              {sortBy === "pinned" && (
                <Check size={15} className="text-primary" />
              )}
            </button>

            <div className="my-2 border-t border-border" />

            <p className="mb-2 px-2 text-xs font-medium text-text-muted">
              Order
            </p>

            <button
              type="button"
              onClick={() => handleSortOrder("ascending")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-text hover:bg-primary-light"
            >
              Ascending

              {sortOrder === "ascending" && (
                <Check size={15} className="text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSortOrder("descending")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-text hover:bg-primary-light"
            >
              Descending

              {sortOrder === "descending" && (
                <Check size={15} className="text-primary" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text transition hover:bg-primary-light"
      >
        <Download size={17} strokeWidth={1.8} />
        Export
      </button> */}

      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-surface transition hover:opacity-90"
      >
        <Upload size={17} strokeWidth={1.8} />
        Import
      </button>

      <input
        ref={fileInput}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        multiple
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}

export default NoteActionBar;