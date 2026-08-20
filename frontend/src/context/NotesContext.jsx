import {createContext, useContext, useState, useEffect} from "react";
import { apiFetch } from "../config/api";

const NotesContext=createContext();

export function NotesProvider({children}){
useEffect(() => {
  getAllNotes();
}, []);

async function createNote(title, noteContent) {
  const response = await apiFetch("/api/notes", {
    method: "POST",
    body: JSON.stringify({
      title,
      noteContent,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create note");
  }
    setNotes(prev => [...prev, data.note]);

  return data.note;
}

async function updateNote(id, title, noteContent) {
  const response=await apiFetch(`/api/notes/${id}`,{
    method:"PATCH",
    body:JSON.stringify({title, noteContent})
  });
  const data=await response.json();

    if (!response.ok) {
    throw new Error(data.message || "Error! Failed to update note");
  }
setNotes(prev =>
    prev.map(note =>
      note.id === id ? data.note : note
    )
  );
return data.note;
}

async function getAllNotes() {
  const response = await apiFetch("/api/notes");

  const data = await response.json();
 console.log("GET NOTES RESPONSE:", data);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notes");
  }

  setNotes(data.allNotes);
}



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
   async function moveToTrash(id) {
try{
  const response=await apiFetch(`/api/notes/${id}/trash`,{
    method:"PATCH"
  });
  const data=await response.json();
  if(!response.ok){
     throw new Error(data.message || "Error! Failed to move Note to trash");
  }
    console.log("MOVE TO TRASH RESPONSE:", data);
  setNotes(prev =>
      prev.map(note =>
        note.id === id ? {...note, isDeleted:true} : note
      )
    );
}
catch (error){
 console.error("Failed to move note to trash:", error);
}
}
async function handleFavourite(id) {

  try{
const response=await apiFetch(`/api/notes/${id}/favourite`,{
  method:"PATCH"
});
const data=await response.json();
if(!response.ok){
  throw new Error(data.message || "Error! Failed to update note to favourite");
}

setNotes(
  prev=>prev.map(note=>note.id===id ? data.note : note)
);
  }catch (error){
console.error("Failed to update favourite:", error);
  }
}
    const [notes, setNotes] = useState([]);
    return (
   <NotesContext.Provider value={{ notes, setNotes, moveToTrash, handleFavourite ,deleteForever,restoreNote, createNote, getAllNotes, updateNote}}>
      {children}
    </NotesContext.Provider>
    );
}

export function useNotes(){
    return useContext(NotesContext);
}