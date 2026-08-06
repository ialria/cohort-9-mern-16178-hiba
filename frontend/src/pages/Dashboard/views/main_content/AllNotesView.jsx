import NoteCard from "../../components/NoteCard.jsx";
import { useNavigate } from "react-router-dom";
import {useSidebar} from "../../../../context/SidebarContext.jsx";
import {useNotes} from "../../../../context/NotesContext.jsx";
import {Plus} from "../../../../icons/icons.jsx";
import NoteMenu from "../../components/note_components/NoteMenu.jsx";

function AllNotesView(){
    const {notes, handleFavourite,moveToTrash}=useNotes();
    const navigate=useNavigate();
    const {collapsed}=useSidebar();

//     function toggleFavourite(id) {
//   setNotes((prevNotes) =>
//     prevNotes.map((note) =>
//       note.id === id
//         ? { ...note, favorite: !note.favorite }
//         : note
// console.log("Pressed favourite button")
//     )
//   );
// }
// function moveToTrash(id) {
//   setNotes(prevNotes =>
//     prevNotes.map(note =>
//       note.id === id
//         ? { ...note, deleted: true }
//         : note
// console.log("Pressed Delete button")
//     )
//   );
// }

    return(
<section className={`grid grid-cols-1 lg:grid-cols-3 ${collapsed ? "gap-4" : "gap-6"} md:grid-cols-2 px-5 md:px-8`}>
    {notes.filter(note=>!note.deleted).map((note)=>(
        <NoteCard  key={note.id} note={note}
  MenuComponent={NoteMenu} onFavourite={() => handleFavourite(note.id)}
    onDelete={() => moveToTrash(note.id)}/>
    ))}
    <button type="button"   onClick={() => navigate("/notes/new")} className="absolute bottom-5 right-8 p-4 bg-primary rounded-full cursor-pointer"><Plus size={20} strokeWidth={2} className="text-surface"/>
    </button>
</section>
    );
}


export default AllNotesView