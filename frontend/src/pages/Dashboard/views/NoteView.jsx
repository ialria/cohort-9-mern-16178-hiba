import { useParams } from "react-router-dom";
import NoteToolBar from "../components/note_components/NoteToolBar";
import TextArea from "../../../components/TextArea.jsx";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { useState, useEffect, useRef } from "react";
import { useNotes } from "../../../context/NotesContext.jsx";
import Button from "../../../components/Button";


function NoteView() {
  const { noteId } = useParams();
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
  }
}, [note]);

const handleSave = async () => {
  const plainTextContent = content.replace(/<[^>]*>/g, "").trim();
  if (!plainTextContent) {
    return;
  }
  try {
    setSaveStatus("saving");
    //  console.log("TITLE BEFORE SAVE:", title);
    // console.log("CONTENT BEFORE SAVE:", content);
let savedNote;
if(note){
  savedNote=await updateNote(note.id, title, content);
}else{
  savedNote=await createNote(title, content);
}
    
    // console.log("Note created:", note);
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
{/* <EditorToolButton /> */}
 <section className="px-10 md:px-22">
  <div ref={editorRef}>           <ReactQuill  theme="snow" value={content} modules={modules} onChange={handleContentChange} placeholder="Start typing ..." className="mt-6 text-base
    text-text
    placeholder:text-text-muted" /> 
    </div>

</section>
    {/* category chips */}
      </section>

  {/* <section className="border-t px-8 md:px-12 border-text/20 sticky py-2 flex gap-2">
    <h2 className="text-text-muted hidden md:block font-semibold my-1">Category</h2>

    <Button className="bg-surface border border-text/20 hover:bg-primary transition-all duration-200 hover:text-surface text-text text-xs">Ideas</Button>
    <Button className="bg-surface border border-text/20 hover:bg-primary transition-all duration-200 hover:text-surface text-text text-xs">Work</Button>
    <Button className="bg-surface border border-text/20 hover:bg-primary transition-all duration-200 hover:text-surface text-text text-xs">Personal</Button>

  </section> */}


    
    </main>
  );
}

export default NoteView;
