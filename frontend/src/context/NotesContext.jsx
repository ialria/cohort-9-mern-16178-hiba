import {createContext, useContext, useState} from "react";
import {dummyNotes} from "../pages/Dashboard/data/dummyNotes";

const NotesContext=createContext();

export function NotesProvider({children}){
    function restoreNote(id) {
  setNotes(prev =>
    prev.map(note =>
      note.id === id
        ? { ...note, deleted: false }
        : note
    )
  );
}
function deleteForever(id) {
  setNotes(prev =>
    prev.filter(note => note.id !== id)
  );
}
    function moveToTrash(id) {
  setNotes(prev =>
    prev.map(note =>
      note.id === id
        ? {
            ...note,
            deleted: true,
          }
        : note
    )
  );
}
function handleFavourite(id) {
  setNotes(prev =>
    prev.map(note =>
      note.id === id
        ? {
            ...note,
            favorite: !note.favorite,
          }
        : note
    )
  );
}
    const [notes, setNotes] = useState(dummyNotes);
    return (
   <NotesContext.Provider value={{ notes, setNotes, moveToTrash, handleFavourite ,deleteForever,restoreNote}}>
      {children}
    </NotesContext.Provider>
    );
}

export function useNotes(){
    return useContext(NotesContext);
}