import {Trash2,Star} from "../../../../icons/icons.jsx";
import MenuButton from "../../../../components/MenuButton.jsx";
function NoteMenu({onFavourite, onDelete, isFavourite}) {
  return (
    <div className="absolute right-0 top-full py-4 px-4 mt-1 w-52 bg-surface border rounded-xl border-border/70 z-50 backdrop-blur-xl ring-1 ring-black/5 shadow-lg">
    <MenuButton onClick={(e=>{
      e.preventDefault();
      e.stopPropagation();
      onFavourite();
    })}>   
          <Star size={16} strokeWidth={2} />
        <span className="text-xs">  {isFavourite ? "Remove from Favourite" : "Add to Favourite"}</span>  
        
    </MenuButton>
 
     
      <MenuButton onClick={(e=>{
      e.preventDefault();
      e.stopPropagation();
      onDelete();
    })}>
     
          <Trash2 className="text-error" size={16} strokeWidth={2} />
          <span className="text-error text-xs" >Move to Trash</span>
    
      </MenuButton>
  
    </div>
  );
}

export default NoteMenu;
