import { useParams, useNavigate } from "react-router-dom";
import NoteToolBar from "../components/note_components/NoteToolBar";
import TextArea from "../../../components/TextArea.jsx";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { useState, useEffect, useRef } from "react";
import { useNotes } from "../../../context/NotesContext.jsx";

function NoteView() {
  const { noteId } = useParams();
   const navigate = useNavigate();
  const editorRef = useRef(null);
  const editRevisionRef = useRef(0);
  useEffect(() => {
  const editor = editorRef.current?.querySelector(".ql-editor");

  if (editor) {
    editor.setAttribute("aria-label", "Note content editor");
  }
}, []);
  const {notes,createNote, updateNote, getNoteById}=useNotes();
  const note = notes.find((note) => String(note.id) === noteId);
 const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const modules = {
    toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ header: [1, 2, 3, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
    ],
};
useEffect(() => {
  if (note) {
    setTitle(note.title || "");
    setContent(note.content || "");
    setSaveStatus("saved");
    setErrorMessage("");
    editRevisionRef.current = 0;
  } else {
    setTitle("");
    setContent("");
    setSaveStatus("idle");
    setErrorMessage("");
    editRevisionRef.current = 0;
  }
}, [noteId]);

const handleSave = async () => {
   if (saveStatus !== "unsaved" && saveStatus !== "error") {
    return;
  }

  const plainTextContent = content.replace(/<[^>]*>/g, "").trim();
  if (!plainTextContent) {
      setErrorMessage("Note content cannot be empty.");
      setSaveStatus("error");
    return;
  }
  const saveRevision = editRevisionRef.current;
  try {
    setErrorMessage("");
    setSaveStatus("saving");

let savedNote;
if(note){
  savedNote=await updateNote(note.id, title, content,note.updatedAt);
}else{
  savedNote=await createNote(title, content);
   navigate(`/notes/${savedNote.id}`);
}
    if (editRevisionRef.current === saveRevision) {
  setSaveStatus("saved");
}
  } catch (error) {
  console.error("Failed to save note:", error);

  if (note && error.status === 409) {
    try {
      await getNoteById(note.id);
      setErrorMessage("The note was updated elsewhere. Please click Retry to save your changes.");
    } catch (refreshError) {
      setErrorMessage(
        refreshError.message || "Failed to refresh the latest note."
      );
    }
  } else {
    setErrorMessage(error.message || "Failed to save note.");
  }

  setSaveStatus("error");
}
};

const handleTitleChange = (e) => {
 const noteTitle = e.target.value;
  setTitle(noteTitle);
editRevisionRef.current += 1;
  if (noteTitle.trim() || content.replace(/<[^>]*>/g, "").trim()) {
    setSaveStatus("unsaved");
  }
};

const handleContentChange = (value) => {
  setContent(value);
   editRevisionRef.current += 1;
  const noteContent = value.replace(/<[^>]*>/g, "").trim();
  if (noteContent || title.trim()) {
    setSaveStatus("unsaved");
  }
};
  return (
    <main className="h-screen bg-background flex flex-col">
      <NoteToolBar onSave={handleSave} saveStatus={saveStatus}/>
      {errorMessage && (
  <p className="px-6 py-2 text-sm text-error">
    {errorMessage}
  </p>
)}
      <section className="flex-1 overflow-y-auto">
      <article className=" py-8 px-6 md:px-16">
        <header>
          <TextArea rows={1} placeholder="Untitled note" value={title}   onChange={handleTitleChange} className=" text-2xl md:text-3xl
    font-semibold
    text-text
    placeholder:text-text-muted" />


        </header>
      </article>
 <section className="px-10 md:px-22">
  <div ref={editorRef}>           <ReactQuill  theme="snow" value={content} modules={modules} onChange={handleContentChange} placeholder="Start typing ..." className="mt-6 text-base
    text-text
    placeholder:text-text-muted" /> 
    </div>

</section>
      </section>
    </main>
  );
}

export default NoteView;
