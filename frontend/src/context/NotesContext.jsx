import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../config/api";
import JSZip from "jszip";
const NotesContext = createContext();

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);
  const [notesError, setNotesError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportStatus, setExportStatus] = useState("idle");
const [exportProgress, setExportProgress] = useState(0);

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
  const error = new Error(data.message || "Error! Failed to update note");
  error.status = response.status;
  throw error;
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

async function getNoteById(id) {
  try {
    const response = await apiFetch(`/api/notes/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch note");
    }

    setNotes((prev) =>
      prev.map((note) => (note.id === id ? data.note : note))
    );

    setNotesError(null);

    return data.note;
  } catch (error) {
    setNotesError(error.message || "Failed to fetch note");
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
       setNotesError(error.message || "Failed to restore note");
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
       setNotesError(error.message || "Failed to delete note");
  }}
  async function moveToTrash(id) {
    try {
      setNotesError(null);
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
         setNotesError(error.message || "Failed to move note to trash");
    }
  }
  async function handlePin(id) {
    try {
      const response = await apiFetch(`/api/notes/${id}/pin`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Error! Failed to update note pin",
        );
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? data.note : note)),
      );
    } catch (error) {
      console.error("Failed to update pin:", error);
         setNotesError(error.message || "Failed to update note to pin");
    }
  }
  async function importNotes(importedNotes) {
  try {
    const newNotes = [];

    for (const note of importedNotes) {
      const newNote = await createNote(note.title, note.content);
      newNotes.push(newNote);
    }

    return newNotes;
  } catch (error) {
    console.error("Failed to import notes:", error);
       
    throw error;
  }
}
function exportNote(note) {
  try {
    const title = note.title || "Untitled";
    const content = note.content || "";

    const plainTextContent = content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<p[^>]*>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .trim();

    const fileContent = `${title}\n\n${plainTextContent}`;

    const file = new Blob([fileContent], {
      type: "text/plain",
    });

    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${title}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileUrl);
  } catch (error) {
    console.error("Failed to export note:", error);
  }
}

async function exportAllNotes() {
  const activeNotes = notes.filter((note) => !note.isDeleted);

  if (activeNotes.length === 0) {
    return;
  }

  try {
    setExportStatus("exporting");
    setExportProgress(0);

    const zip = new JSZip();
    // can imoport files even if they have same title (different content)
const usedNames = new Set();
    for (let i = 0; i < activeNotes.length; i++) {
      const note = activeNotes[i];

      const title = note.title || "Untitled";
      const content = note.content || "";

      const plainTextContent = content
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .trim();

     const safeTitle = title
  .replace(/[\\/:*?"<>|]/g, "_")
  .slice(0, 100);

let fileName = `${safeTitle}.txt`;
let suffix = 1;

while (usedNames.has(fileName)) {
  fileName = `${safeTitle} (${suffix}).txt`;
  suffix++;
}

usedNames.add(fileName);

zip.file(fileName, fileContent);

      setExportProgress(i + 1);
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    const zipUrl = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = "my-notes.zip";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(zipUrl);

    setExportStatus("completed");

    setTimeout(() => {
      setExportStatus("idle");
      setExportProgress(0);
    }, 3000);
  } catch (error) {
    console.error("Failed to export all notes:", error);

    setExportStatus("error");

    setTimeout(() => {
      setExportStatus("idle");
      setExportProgress(0);
    }, 3000);
  }
}

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        searchTerm,
        setSearchTerm,
        moveToTrash,
        handlePin,
        deleteForever,
        restoreNote,
        createNote,
        getAllNotes,
        updateNote,
        notesError,
        getNoteById
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}
