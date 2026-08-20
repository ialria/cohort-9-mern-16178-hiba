import { useNavigate } from "react-router-dom";
import { useNotes } from "../../../context/NotesContext.jsx";
import formatDate from "../../../utils/formateDate.js";


function removeHtml(content) {
  if (!content) return "";
  const element = document.createElement("div");
  element.innerHTML = content;

  //to separate line/para 
  element.querySelectorAll("br, p, div").forEach((item) => {
    item.replaceWith(" " + item.textContent + " ");
  });

  return element.textContent || "";
}
function createPreview(title, content, searchText) {
  const titleText = title || "";
  const contentText = removeHtml(content)
    .replace(/\s+/g, " ")
    .trim();
  const searchLower = searchText.toLowerCase();
  if (titleText.toLowerCase().includes(searchLower)) {
    return contentText.length > 100
      ? contentText.slice(0, 100) + "..."
      : contentText;
  }

  const contentLower = contentText.toLowerCase();
  const matchPosition = contentLower.indexOf(searchLower);

  if (matchPosition === -1) {
    return contentText.length > 100
      ? contentText.slice(0, 100) + "..."
      : contentText;
  }

  // show some content before and after matched word below that search bar then
  const start = Math.max(0, matchPosition - 40);
  const end = Math.min(
    contentText.length,
    matchPosition + searchText.length + 60
  );
  let preview = contentText.slice(start, end);
  if (start > 0) {
    preview = "..." + preview;
  }
  if (end < contentText.length) {
    preview = preview + "...";
  }
  return preview;
}
function highlightSearchText(text, searchText) {
  if (!searchText.trim()) {
    return text;
  }

  // avoiding regex here 
  const escapedSearch = searchText.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const parts = text.split(
    new RegExp(`(${escapedSearch})`, "gi")
  );
   return parts.map((part, index) => {
    if (part.toLowerCase() === searchText.toLowerCase()) {
      return (
        <mark
          key={index}
          className="bg-primary-light text-primary rounded px-1"
        >
          {part}
        </mark>
      );
    }

    return part;
  });
}

function NotesSearchResults() {
  const navigate = useNavigate();

  const {
    notes,
    searchTerm,
    setSearchTerm,
  } = useNotes();
  const searchText = searchTerm.trim();
   if (!searchText) {
    return null;
  }

  const searchLower = searchText.toLowerCase();
  const matchingNotes = notes.filter((note) => {
    if (note.isDeleted) {
      return false;
    }

    const title = note.title?.toLowerCase() || "";
    const content = removeHtml(note.content).toLowerCase();

    return (
      title.includes(searchLower) ||
      content.includes(searchLower)
    );
  });

function openNote(noteId) {
    setSearchTerm("");
    navigate(`/notes/${noteId}`);
  }

  return (
    <div className="absolute top-full left-0 right-0 md:w-96 mt-2 bg-surface border border-border rounded-2xl shadow-lg overflow-hidden z-50">

      <div className="px-6 py-4 border-b border-border">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wide">
          {matchingNotes.length}{" "}
          {matchingNotes.length === 1
            ? "Result"
            : "Results"}
        </p>
      </div>
       {matchingNotes.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-text font-medium">
            No results found
          </p>

          <p className="text-sm text-text-muted mt-1">
            No notes match "{searchText}".
          </p>
        </div>
      ) : (

         <div className="max-h-96 overflow-y-auto">
          {matchingNotes.map((note) => {
            const preview = createPreview(
                note.title,
              note.content,
              searchText
            );

            return (
              <button
                key={note.id}
                type="button"
                onClick={() => openNote(note.id)}
                className="w-full text-left px-6 py-4 border-b border-border last:border-b-0 hover:bg-background transition-colors"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">
                    <h3 className="text-text font-medium text-base truncate">
                      {highlightSearchText(
                        note.title || "Untitled Note",
                        searchText
                      )}
                    </h3>

                    <p className="text-sm text-text-muted mt-1 line-clamp-2">
                      {highlightSearchText(
                        preview,
                        searchText
                      )}
                    </p>
                  </div>

                  <span className="text-xs text-text-muted whitespace-nowrap pt-1">
                   {formatDate(note.updatedAt)}
                  </span>

                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotesSearchResults;