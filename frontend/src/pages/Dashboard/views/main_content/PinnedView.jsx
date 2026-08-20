import {useNotes} from "../../../../context/NotesContext.jsx";
import NoteCard from "../../components/NoteCard.jsx";
import NoteMenu from "../../components/note_components/NoteMenu.jsx";
import {useSidebar} from "../../../../context/SidebarContext.jsx";
function PinnedView(){
    const {collapsed}=useSidebar();
<<<<<<< HEAD:frontend/src/pages/Dashboard/views/main_content/PinnedView.jsx
    const {notes, handlePin, moveToTrash, exportNote} = useNotes();
const pinnedNotes=notes.filter(note=>note.isPinned && !note.isDeleted);
=======
    const {notes, handleFavourite, moveToTrash} = useNotes();
const favouriteNotes=notes.filter(note=>note.isFavorite && !note.isDeleted);
>>>>>>> e5e06b1 (Implement note management):frontend/src/pages/Dashboard/views/main_content/FavouriteView.jsx
    return (
     <section className={`grid grid-cols-1 gap-4 md:grid-cols-2  ${collapsed ? "md:gap-4" : "md:gap-6"} px-5 md:px-8`}>
            {pinnedNotes.length === 0 ? (
                <p className="text-text-muted">No pinned notes yet.</p>
            ) : (
                      pinnedNotes.map(note => (
            <NoteCard
                key={note.id}
                note={note}
                showDate={false}
                previewLines={1}
                showPin={true}
                MenuComponent={NoteMenu}
                compact={true}
                onPin={() => handlePin(note.id)}
                 onDelete={() => moveToTrash(note.id)}
                 onExport={()=>exportNote(note)}
            />
        ))
        
            )}
        </section>
    );
}

export default PinnedView