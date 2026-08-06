function MenuButton({children,className="",...props}){
   
    return (
     <button type="button" className={`text-text-muted text-sm  hover:bg-primary-light p-2 rounded-xl w-full text-start hover:text-text flex items-center gap-3 ${className}`} {...props}>
  {children}
        </button>
         
    );
}

export default MenuButton