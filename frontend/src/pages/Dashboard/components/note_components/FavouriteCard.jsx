function FavouriteCard(){
    return (
        <article onMouseLeave={()=>setShowMenu(false)} className="group flex h-44 md:h-54 w-full flex-col border border-border rounded-3xl px-6 py-4 md:py-8 bg-surface hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150">
      <div className="flex justify-between items-center relative">
 <h2 className="text-text text-md md:text-lg font-medium">{note.title}</h2>
 <button type="button" onClick={(e)=>{
  e.preventDefault();
  e.stopPropagation();
  setShowMenu((prev)=>!prev)}} className="p-1 hidden group-hover:block transition-opacity duration-150 bg-primary-lighter rounded-lg hover:bg-text-muted/14"><Ellipsis className="text-text-muted " size={18} strokeWidth={2}/></button>
 {showMenu && <NoteMenu onFavourite={handleFavourite} onDelete={handleDelete}/>}
      </div>
   
    <p className="mt-4 text-text-muted text-sm line-clamp-1">{note.preview}</p>
    <div className="mt-auto flex justify-between text-text-disabled">
  <p className="text-xs ">{note.updatedAt}</p>
   
    {isFavourite && (<button type="button"> <Star size={20} strokeWidth={1.5} className="text-yellow-400 fill-yellow-400 cursor-pointer"/></button>)}
    </div>
   
    </article> 
    );
}

export default FavouriteCard