import Button from "../../../../components/Button.jsx";
import {useNotes} from "../../../../context/NotesContext.jsx";
import { useState } from "react";
import {useSidebar} from "../../../../context/SidebarContext.jsx";
import formatDate from "../../../../utils/formateDate.js";
import DeleteNoteModal from "../../../../components/modal/DeleteNoteModal.jsx";
function TrashView(){
    const {collapsed}=useSidebar();
const [noteToDelete, setNoteToDelete] = useState(null);
        const {notes, restoreNote,deleteForever} = useNotes();
    const trashNotes=notes.filter(note=>note.isDeleted);

function openDeleteModal(note) { setNoteToDelete(note); }
function closeDeleteModal() { setNoteToDelete(null); }
async function handleDeleteForever() { if (!noteToDelete) { return; } await deleteForever(noteToDelete.id); closeDeleteModal(); }
    return (
        <>
          <section className={`grid grid-cols-1 ${collapsed? "md:gap-3 md:px-4": "md:gap-6 md:px-8"} md:grid-cols-2 px-5 gap-4`}>
 {notesError && (
      <p className="col-span-full text-sm text-delete-primary">
        {notesError}
      </p>
    )}

        {
         trashNotes.length === 0 ? (
                <p className="text-text-muted">No notes in trash yet.</p>
            ) : (
                      trashNotes.map(note => (
          <article key={note.id} className={`group flex w-full flex-col border border-text-muted/30 px-4 rounded-3xl ${collapsed ? "md:px-4" : "md:px-6"} py-4 md:py-8 bg-background hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150`}>
      <div className="flex flex-col gap-2">
 <h2 className="text-text-muted text-md md:text-lg font-medium line-through">{note.title}</h2>
  <p className="text-text-disabled text-xs line-clamp-1">Deleted {formatDate(note.deletedAt)}</p>
      </div>
   
   <div className="mt-2 md:mt-4 flex justify-end items-center  gap-2">
    <Button onClick={()=>restoreNote(note.id)} className="bg-primary-light text-text-muted font-semibold hover:bg-primary hover:text-surface text-xs">Restore</Button>
    <Button className="font-semibold bg-delete-bgLight text-delete-muted hover:bg-delete-primary hover:text-surface text-xs" onClick={()=>openDeleteModal(note)}>Delete Forever</Button>


   </div>

    </article> 
        ))
        
            )}

            
            </section>

            <DeleteNoteModal isOpen={Boolean(noteToDelete)} onClose={closeDeleteModal} note={noteToDelete} onConfirm={handleDeleteForever} />
            </>
         
    );
}

export default TrashView