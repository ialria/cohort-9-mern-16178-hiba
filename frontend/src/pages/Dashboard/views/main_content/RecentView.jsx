import { useSidebar } from "../../../../context/SidebarContext";
import {FileText} from "../../../../icons/icons.jsx"
import { Link } from "react-router-dom";
import { useNotes } from "../../../../context/NotesContext.jsx";
import formatDate from "../../../../utils/formateDate.js";
import { useState } from "react";
function RecentView(){
    const {collapsed}=useSidebar();
    const {notes}=useNotes();
    const [visibleNoteCount, setVisibleNoteCount] = useState(8);

const recentNotes = (notes || [])
  .filter((note) => !note.isDeleted)
  .sort(
    (a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
  );

const visibleNotes = recentNotes.slice(0, visibleNoteCount);
  
    return (

       <section
      className={`px-6 gap-6 md:px-8 grid grid-cols-1 ${
        collapsed ? "md:grid-cols-1" : "md:grid-cols-2"
      } transition-all duration-200 mb-4`}
    >
      {recentNotes.length === 0 ? (
        <p className="text-text-muted col-span-full">
          No recent notes yet.
        </p>
      ) : (
        visibleNotes.map((note) => (
          <Link key={note.id} to={`/notes/${note.id}`}>
            <article className="flex border-b hover:rounded-xl border-text-muted/30 py-4 px-2 justify-between items-end w-full hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-notes-bg shrink-0">
                  <FileText
                    size={20}
                    strokeWidth={1.5}
                    className="text-notes"
                  />
                </div>

                <h2 className="text-text font-semibold text-lg md:text-xl truncate">
                  {note.title}
                </h2>
              </div>

              <p className="text-text-muted font-semibold text-sm md:text-md shrink-0">
                {formatDate(note.updatedAt)}
              </p>
            </article>
          </Link>
        ))
      )}
      {visibleNoteCount < recentNotes.length && (
  <button
    type="button"
    onClick={() => setVisibleNoteCount((prev) => prev + 5)}
    className="col-span-full text-sm font-semibold text-primary hover:underline"
  >
    View more →
  </button>
)}
            </section>
    );
}

export default RecentView