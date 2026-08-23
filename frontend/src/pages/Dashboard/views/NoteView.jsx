import { useParams, useNavigate } from "react-router-dom";
import NoteToolBar from "../components/note_components/NoteToolBar";
import TextArea from "../../../components/TextArea.jsx";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { useState, useEffect, useRef } from "react";
import { useNotes } from "../../../context/NotesContext.jsx";
import Button from "../../../components/Button";

function NoteView() {
  const { noteId } = useParams();
   const navigate = useNavigate();
  const editorRef = useRef(null);
  useEffect(() => {
  const editor = editorRef.current?.querySelector(".ql-editor");

  if (editor) {
    editor.setAttribute("aria-label", "Note content editor");
  }
}, []);
  const {notes,createNote, updateNote}=useNotes();
  const note = notes.find((note) => String(note.id) === noteId);
 const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
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
  } else {
    setTitle("");
    setContent("");
    setSaveStatus("idle");
  }
}, [note]);

const handleSave = async () => {
   if (saveStatus !== "unsaved" && saveStatus !== "error") {
    return;
  }
  const plainTextContent = content.replace(/<[^>]*>/g, "").trim();
  if (!plainTextContent) {
    return;
  }
  try {
    setSaveStatus("saving");

let savedNote;
if(note){
  savedNote=await updateNote(note.id, title, content,note.updatedAt);
}else{
  savedNote=await createNote(title, content);
   navigate(`/notes/${savedNote.id}`);
}
     setSaveStatus("saved");
  } catch (error) {
    console.error("Failed to create note:", error);
      setSaveStatus("error");
  }
};

const handleTitleChange = (e) => {
 const noteTitle = e.target.value;
  setTitle(noteTitle);

  if (noteTitle.trim() || content.replace(/<[^>]*>/g, "").trim()) {
    setSaveStatus("unsaved");
  }
};

const handleContentChange = (value) => {
  setContent(value);
  const noteContent = value.replace(/<[^>]*>/g, "").trim();
  if (noteContent || title.trim()) {
    setSaveStatus("unsaved");
  }
};
  return (
    <main className="h-screen bg-background flex flex-col">
      <NoteToolBar onSave={handleSave} saveStatus={saveStatus}/>
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
