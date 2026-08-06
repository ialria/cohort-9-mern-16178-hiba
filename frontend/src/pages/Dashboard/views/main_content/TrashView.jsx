import Button from "../../../../components/Button.jsx";
import {useNotes} from "../../../../context/NotesContext.jsx";
import {useSidebar} from "../../../../context/SidebarContext.jsx";
function TrashView(){
    const {collapsed}=useSidebar();
        const {notes, restoreNote,deleteForever} = useNotes();
    const trashNotes=notes.filter(note=>note.deleted);
    return (
          <section className={`grid grid-cols-1 ${collapsed? "md:gap-3 md:px-4": "md:gap-6 md:px-8"} md:grid-cols-2 px-5 gap-4`}>
        {
         trashNotes.length === 0 ? (
                <p>No favourite notes yet.</p>
            ) : (
                      trashNotes.map(note => (
          <article className={`group flex w-full flex-col border border-text-muted/30 px-4 rounded-3xl ${collapsed ? "md:px-4" : "md:px-6"} py-4 md:py-8 bg-background hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150`}>
      <div className="flex flex-col gap-2">
 <h2 className="text-text-muted text-md md:text-lg font-medium line-through">{note.title}</h2>
  <p className="text-text-disabled text-xs line-clamp-1">Deleted 3 weeks ago</p>
      </div>
   
   <div className="mt-2 md:mt-4 flex justify-end items-center  gap-2">
    <Button onClick={()=>restoreNote(note.id)} className="bg-primary-light text-text-muted font-semibold hover:bg-primary hover:text-surface text-xs">Restore</Button>
    <Button className="font-semibold bg-delete-bgLight text-delete-muted hover:bg-delete-primary hover:text-surface text-xs" onClick={()=>deleteForever(note.id)}>Delete Forever</Button>


   </div>

    </article> 
        ))
        
            )}
            </section>
         
    );
}

export default TrashView