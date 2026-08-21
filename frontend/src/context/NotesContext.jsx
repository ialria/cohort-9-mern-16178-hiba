import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../config/api";

const NotesContext = createContext();

export function NotesProvider({ children }) {
useEffect(() => {
  getAllNotes().catch((error) => {
    console.error("Failed to fetch notes:", error);
  });
}, []);
  async function createNote(title, noteContent) {
    try{
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
    setNotes((prev) => [...prev, data.note]);
    setNotesError(null);

    return data.note;
  }
  catch(error){
      setNotesError(error.message || "Failed to create note");
    throw error;
  }
  }

async function updateNote(id, title, noteContent, updatedAt) {
  try {
    const response = await apiFetch(`/api/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        noteContent,
        updatedAt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error! Failed to update note");
    }

    setNotes((prev) =>
      prev.map((note) => (note.id === id ? data.note : note))
    );

    setNotesError(null);

    return data.note;
  } catch (error) {
    setNotesError(error.message || "Oops! Failed to update note");
    throw error;
  }
}

async function getAllNotes() {
  try {
    const response = await apiFetch("/api/notes");

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error! Failed to fetch notes");
    }

    setNotes(data.allNotes);
    setNotesError(null);
  } catch (error) {
    setNotesError(error.message || "Error! Failed to load notes.");
    throw error;
  }
}
 async function restoreNote(id) {
   try {
    const response = await apiFetch(`/api/notes/${id}/restore`, {
      method: "PATCH",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to restore note");
    }
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? data.note : note)),
    );
  } catch (error) {
    console.error("Failed to restore note:", error);
  }
  }

 async function deleteForever(id) {
   try {
    const response = await apiFetch(`/api/notes/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to permanently delete note");
    }
    setNotes((prev) => prev.filter((note) => note.id !== id));
  } catch (error) {
    console.error("Failed to permanently delete note:", error);
  }}
  async function moveToTrash(id) {
    try {
      const response = await apiFetch(`/api/notes/${id}/trash`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error! Failed to move Note to trash");
      }
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? data.note : note)),
      );
    } catch (error) {
      console.error("Failed to move note to trash:", error);
    }
  }
  async function handleFavourite(id) {
    try {
      const response = await apiFetch(`/api/notes/${id}/favourite`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Error! Failed to update note to favourite",
        );
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? data.note : note)),
      );
    } catch (error) {
      console.error("Failed to update favourite:", error);
    }
  }
  const [notes, setNotes] = useState([]);
  const [notesError, setNotesError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        searchTerm,
        setSearchTerm,
        moveToTrash,
        handleFavourite,
        deleteForever,
        restoreNote,
        createNote,
        getAllNotes,
        updateNote,
        notesError
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}
