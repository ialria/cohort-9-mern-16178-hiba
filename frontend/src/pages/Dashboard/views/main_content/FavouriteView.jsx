import {useNotes} from "../../../../context/NotesContext.jsx";
import NoteCard from "../../components/NoteCard.jsx";
import NoteMenu from "../../components/note_components/NoteMenu.jsx";
import {useSidebar} from "../../../../context/SidebarContext.jsx";
function FavouriteView(){
    const {collapsed}=useSidebar();
    const {notes, handleFavourite} = useNotes();
const favouriteNotes=notes.filter(note=>note.favorite && !note.deleted);
    return (
     <section className={`grid grid-cols-1 gap-4 md:grid-cols-2  ${collapsed ? "md:gap-4" : "md:gap-6"} px-5 md:px-8`}>
            {favouriteNotes.length === 0 ? (
                <p>No favourite notes yet.</p>
            ) : (
                      favouriteNotes.map(note => (
            <NoteCard
                key={note.id}
                note={note}
                showDate={false}
                previewLines={1}
                showFavorite={true}
                MenuComponent={NoteMenu}
                compact={true}
                onFavourite={() => handleFavourite(note.id)}
            />
        ))
        
            )}
        </section>
    );
}

export default FavouriteView