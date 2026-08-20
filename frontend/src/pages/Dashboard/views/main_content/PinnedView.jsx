import {useNotes} from "../../../../context/NotesContext.jsx";
import NoteCard from "../../components/NoteCard.jsx";
import NoteMenu from "../../components/note_components/NoteMenu.jsx";
import {useSidebar} from "../../../../context/SidebarContext.jsx";
function PinnedView(){
    const {collapsed}=useSidebar();
    const {notes, handlePin, moveToTrash, exportNote} = useNotes();
const pinnedNotes=notes.filter(note=>note.isPinned && !note.isDeleted);
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