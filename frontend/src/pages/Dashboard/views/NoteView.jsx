import { useParams } from "react-router-dom";
import NoteToolBar from "../components/note_components/NoteToolBar";
import EditorToolButton from "../../Dashboard/components/note_components/EditorToolButton.jsx";
import TextArea from "../../../components/TextArea.jsx";

import Button from "../../../components/Button";
function NoteView() {
  const { noteId } = useParams();
  return (
    <main className="h-screen bg-background flex flex-col">
      <NoteToolBar />
      <section className="flex-1 overflow-y-auto">
      <article className=" py-8 px-6 md:px-16">
        <header>
          <TextArea rows={1} placeholder="Untitled note" className=" text-2xl md:text-3xl
    font-semibold
    text-text
    placeholder:text-text-muted" />


        </header>
      </article>
<EditorToolButton />
 <section className="px-10 md:px-22">
           <TextArea rows={8} placeholder="Start typing ..." className="mt-6 text-base
    text-text
    placeholder:text-text-muted" /> 
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
