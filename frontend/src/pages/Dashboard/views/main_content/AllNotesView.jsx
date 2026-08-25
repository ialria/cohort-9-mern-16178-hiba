import NoteCard from "../../components/NoteCard.jsx";
import { useNavigate } from "react-router-dom";
import {useSidebar} from "../../../../context/SidebarContext.jsx";
import {useNotes} from "../../../../context/NotesContext.jsx";
import {Plus} from "../../../../icons/icons.jsx";
import NoteMenu from "../../components/note_components/NoteMenu.jsx";
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
);
}


export default AllNotesView