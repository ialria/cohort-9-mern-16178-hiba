import { useRef, useState } from "react";
import {
  Download,
  Upload,
  ArrowDownUp,
  Check,
} from "../../../../icons/icons";

function NoteActionBar({sortBy, sortOrder, onSort, onImport }) {
  const fileInput = useRef(null);

  const [showSortMenu, setShowSortMenu] = useState(false);
function handleSortBy(newSortBy) {
  onSort(newSortBy, sortOrder);
}

// sort on two things note-properties / order (asc or desc)
function handleSortOrder(newSortOrder) {
  onSort(sortBy, newSortOrder);
   setShowSortMenu(false);
}

// can import json (to reserve the format) adn then txt files can also improt multiple ones
 function handleImport(event) {
  const files = Array.from(event.target.files);

  if (files.length === 0) {
    return;
  }

  const importedNotes = [];
  let filesRead = 0;

   const processComplete = () => {
    filesRead++;

    if (filesRead === files.length) {
           if (importedNotes.length === 0) {
        return;
     }
      onImport(importedNotes).catch((error) => {
        console.error("Failed to import notes:", error);
        alert("Failed to import notes. Please try again.");
      });
    }
  };
  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload =() => {
      try {
        const fileContent = reader.result;

        if (file.name.endsWith(".json")) {
          const notesFromFile = JSON.parse(fileContent);

          if (
            !Array.isArray(notesFromFile) ||
            !notesFromFile.every(
              (note) =>
                typeof note === "object" && note!==null &&
                typeof note.title === "string" &&
                typeof note.content === "string"
            )
          ) {
            alert(`Invalid notes file: ${file.name}`);
              processComplete();
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
            processComplete();
          return;
        }
          processComplete();
    }catch (error) {
        alert(`Could not read ${file.name}.`);
        processComplete();
      }
    };

 reader.onerror = () => {
      alert(`Could not read ${file.name}.`);
      processComplete();
    };

    reader.readAsText(file);
  });

  event.target.value = "";
}
     

  return (
    <div role="menu" className="flex items-center justify-end gap-2 px-5 md:px-8 mb-5">

      <div className="relative">
        <button
          type="button"   aria-haspopup="menu"
  aria-expanded={showSortMenu} onClick={() => setShowSortMenu((prev) => !prev)}
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
               role="menuitem"
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
               role="menuitem"
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
               role="menuitem"
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
               role="menuitem"
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
               role="menuitem"
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

      <button
        type="button"  role="menuitem"
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