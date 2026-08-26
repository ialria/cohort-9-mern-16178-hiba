import { useParams, useNavigate } from "react-router-dom";
import NoteToolBar from "../components/note_components/NoteToolBar";
import TextArea from "../../../components/TextArea.jsx";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { useState, useEffect, useRef } from "react";
import { useNotes } from "../../../context/NotesContext.jsx";
import ErrorPage from "../../ErrorPage.jsx";

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
  const isNewNote = noteId === "new";  
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
// if the note already exists - show its data then
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
}, [note?.id, isNewNote]);

// save the note when changes are made only
const handleSave = async () => {
   if (saveStatus !== "unsaved" && saveStatus !== "error" && saveStatus !== "validation-error") {
    return;
  }

  const plainTextContent = content.replace(/<[^>]*>/g, "").trim();
  if (!plainTextContent) {
      setSaveStatus("validation-error");
    return;
  }
  const saveRevision = editRevisionRef.current;
  try {
    setErrorMessage("");
    setSaveStatus("saving");

let savedNote;

if(note){
  savedNote=await updateNote(note.id, title, content,note.updatedAt); //
}else if (isNewNote) {
  savedNote = await createNote(title, content);
  // saved chnges -then open that note - shows note id on url then
  navigate(`/notes/${savedNote.id}`);
} else {
  return;
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

// handle title if - if none then tile is set as Untitled Note
const handleTitleChange = (e) => {
 const noteTitle = e.target.value;
  setTitle(noteTitle);
editRevisionRef.current += 1;
  if (noteTitle.trim() || content.replace(/<[^>]*>/g, "").trim()) {
    setSaveStatus("unsaved");
  }
};

// to save edited content
const handleContentChange = (value) => {
  setContent(value);
   editRevisionRef.current += 1;
  const noteContent = value.replace(/<[^>]*>/g, "").trim();
  if (noteContent || title.trim()) {
    setSaveStatus("unsaved");
  }
};
// if cancel stay on the note but changes made are discarded
function handleCancel() {
  if (saveStatus === "unsaved" || saveStatus === "error" || saveStatus === "validation-error") {
    // showing window  with this message
    const confirmed = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    if (!confirmed) {
      return;
    }
  }

  navigate(-1);
}
// trash note cannot be accessed as in trash view
if (note?.isDeleted) {
  return (
    <ErrorPage
      title="Note is in trash"
      message="This note is currently in the trash and cannot be edited."
      onRetry={() => navigate("/dashboard")}
    />
  );
}
// other user notes access- error page
if (!note && !isNewNote) {
  return (
    <ErrorPage
      title="Oops! Note not found"
      message="We couldn't find it. It may have been deleted, or it's not one of your notes."
      onRetry={() => navigate("/dashboard")}
    />
  );
}
  return (
    <main className="h-screen bg-background flex flex-col">
      <NoteToolBar onSave={handleSave} onCancel={handleCancel} saveStatus={saveStatus}/>
      <section className="flex-1 overflow-y-auto">
      <article className=" py-8 px-6 md:px-16">
        <header>
          <TextArea rows={1} placeholder="Untitled note" value={title}   onChange={handleTitleChange} className=" text-2xl md:text-3xl
    font-semibold
    text-text
    placeholder:text-text-muted" />


        </header>
      </article>
{/* <EditorToolButton /> */}
 <section className="px-10 md:px-22 mb-4">
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
