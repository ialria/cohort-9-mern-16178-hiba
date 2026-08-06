import { Link } from "react-router-dom";
import {Star,Ellipsis, FileText} from "../../../icons/icons.jsx"
import NoteView from "../views/NoteView.jsx";
import {useState} from "react";



function NoteCard({ note, previewLines = 3,
  showDate = true,
  MenuComponent,
  onFavourite,
  showFavorite=false,
  compact=false,
  onDelete}) {
  const [showMenu, setShowMenu]=useState(false);
//   const [isFavourite,setIsFavourite]=useState(false);
//   const[isDelete,setIsDelete]=useState(false);
// function handleFavourite(){
//   setIsFavourite((prev)=>!prev);
// }
// function handleDelete(){
//   setIsDelete((prev)=>!prev);
//     //  console.log("Delete clicked");
// }

  return (
    <Link to={`/notes/${note.id}`} className="block">
    <article onMouseLeave={()=>setShowMenu(false)} className={`group flex w-full flex-col border ${compact ? "": "h-40 md:h-52"} border-border rounded-3xl px-6 py-4 md:py-8 bg-surface hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150`}>
      <div className="flex justify-between items-center relative">
<div className="flex gap-2 items-center">
  <div className="p-2 rounded-lg bg-notes-bg">
  <FileText size={20} strokeWidth={1} className="text-notes"/>
</div>
 <h2 className="text-text text-md md:text-lg font-medium">{note.title}</h2>

</div>


 <button type="button" onClick={(e)=>{
  e.preventDefault();
  e.stopPropagation();
  setShowMenu((prev)=>!prev)}} className="p-1 hidden group-hover:block transition-opacity duration-150 bg-primary-lighter rounded-lg hover:bg-text-muted/14"><Ellipsis className="text-text-muted " size={18} strokeWidth={2}/></button>
 {showMenu && <MenuComponent onFavourite={onFavourite} onDelete={onDelete} isFavourite={note.favorite}/>}
      </div>
   
   <div className="mt-1 md:mt-4 flex justify-between items-center  gap-3 md:gap-8">
     <p className={` text-text-muted text-sm ${previewLines===1? "line-clamp-1": "line-clamp-3"}`}>{note.preview}</p>
{showFavorite && note.favorite && ( <Star size={18} strokeWidth={2} className="shrink-0 text-yellow-400 fill-yellow-400 cursor-pointer"/>)}
   </div>
  {!showFavorite && 
    <div className="mt-auto flex justify-between text-text-disabled">
      {showDate && (
  <p className="text-xs ">{note.updatedAt}</p>

      )}
   
   {note.favorite && (<button type="button"> <Star size={18} strokeWidth={1.5} className=" text-yellow-400 fill-yellow-400 cursor-pointer"/></button>)}
    </div>
    }
    </article> 
    </Link>
     
  );
}

export default NoteCard;