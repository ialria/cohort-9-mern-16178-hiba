import {Trash2,Pin,Download} from "../../../../icons/icons.jsx";
import MenuButton from "../../../../components/MenuButton.jsx";
function NoteMenu({onPin, onDelete, isPinned, onExport}) {
  return (
    <div className="absolute right-12 top-5 py-4 px-4 mt-1 w-52 bg-surface border rounded-xl border-border/70 z-50 backdrop-blur-xl ring-1 ring-black/5 shadow-lg">
    <MenuButton onClick={(e=>{
      e.preventDefault();
      e.stopPropagation();
      onPin();
    })}>   
          <Pin size={16} strokeWidth={2} />
        <span className="text-xs">  {isPinned ? "Unpin Note" : "Pin Note"}</span>  
        
    </MenuButton>
   <MenuButton
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onExport();
        }}
      >
        <Download size={16} strokeWidth={2} />
        <span className="text-xs">Export</span>
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
