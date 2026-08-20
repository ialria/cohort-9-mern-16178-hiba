import NoteCard from "../../components/NoteCard.jsx";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../../../context/SidebarContext.jsx";
import { useNotes } from "../../../../context/NotesContext.jsx";
import { Plus } from "../../../../icons/icons.jsx";
import { useMemo, useState } from "react";
import NoteActionBar from "../../components/note_components/NoteActionBar.jsx";
import NoteMenu from "../../components/note_components/NoteMenu.jsx";
<<<<<<< HEAD
function AllNotesView() {
  const { notes, handlePin, moveToTrash, importNotes, exportNote } = useNotes();
  const navigate = useNavigate();
  const { collapsed } = useSidebar();
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("descending");

  // using this memo -avoid filtering unless we achange the notes list 
  const allNotes = useMemo(
    () => (notes || []).filter((note) => !note.isDeleted),
    [notes],
  );

  // actual sorting handler
  function handleSort(newSortBy, newSortOrder) {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }

  const sortedNotes = useMemo(() => {
    const notesCopy = [...allNotes];//copy -to avoid changing original notes

    notesCopy.sort((firstNote, secondNote) => {
      if(sortBy !=="pinned"){
      const pinDifference =
        Number(secondNote.isPinned) - Number(firstNote.isPinned);

      if (pinDifference !== 0) {
        return pinDifference;
      }
    }
      let comparison = 0;

      // depending on edited and created at fields
      if (sortBy === "date") {
        comparison =
          new Date(firstNote.editedAt || firstNote.createdAt) -
          new Date(secondNote.editedAt || secondNote.createdAt);
      }
      if (sortBy === "title") {
        comparison = (firstNote.title || "").localeCompare(
          secondNote.title || "",
        );
      }
      if (sortBy === "pinned") {
        comparison = Number(firstNote.isPinned) - Number(secondNote.isPinned);
      }

      // old ones at top and then recent ones at bottom
      if (sortOrder === "descending") {
        comparison = -comparison;
      }
      return comparison;
    });

    return notesCopy;
  }, [allNotes, sortBy, sortOrder]);

  return (
    <>
      <NoteActionBar
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onImport={importNotes}
      />
  
        <section
    className={`grid grid-cols-1 lg:grid-cols-3 ${
      collapsed ? "gap-4" : "gap-6"
    } md:grid-cols-2 px-5 md:px-8`}
  >

    {allNotes.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold text-text">
          No notes yet
        </h2>

            <p className="mt-2 text-sm text-text-muted">
              Create your first note to get started.
            </p>

            <button
              type="button"
              onClick={() => navigate("/notes/new")}
              className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-surface"
            >
              Create note
            </button>
          </div>
        ) : (
          <>
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                MenuComponent={NoteMenu}
                onPin={() => handlePin(note.id)}
                onDelete={() => moveToTrash(note.id)}
                onExport={() => exportNote(note)}
              />
            ))}

            <button
              type="button"
              onClick={() => navigate("/notes/new")}
              className="absolute bottom-5 right-8 p-4 bg-primary rounded-full cursor-pointer"
            >
              <Plus size={20} strokeWidth={2} className="text-surface" />
            </button>
          </>
        )}
  </section>
  </>
=======
import { useEffect } from "react";
function AllNotesView(){
    const {notes, handleFavourite,moveToTrash, getAllNotes}=useNotes();
    const navigate=useNavigate();
    const {collapsed}=useSidebar();

const allNotes=(notes || []).filter(note=>!note.isDeleted);
    return (
  <section
    className={`grid grid-cols-1 lg:grid-cols-3 ${
      collapsed ? "gap-4" : "gap-6"
    } md:grid-cols-2 px-5 md:px-8`}
  >
    {allNotes.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold text-text">
          No notes yet
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Create your first note to get started.
        </p>

        <button
          type="button"
          onClick={() => navigate("/notes/new")}
          className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-surface"
        >
          Create note
        </button>
      </div>
    ) : (
      <>
        {allNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            MenuComponent={NoteMenu}
            onFavourite={() => handleFavourite(note.id)}
            onDelete={() => moveToTrash(note.id)}
          />
        ))}

        {/* Only shown when notes exist */}
        <button
          type="button"
          onClick={() => navigate("/notes/new")}
          className="absolute bottom-5 right-8 p-4 bg-primary rounded-full cursor-pointer"
        >
          <Plus size={20} strokeWidth={2} className="text-surface" />
        </button>
      </>
    )}
  </section>
>>>>>>> e5e06b1 (Implement note management)
);
}

export default AllNotesView;
