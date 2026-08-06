import { useSidebar } from "../../../../context/SidebarContext";
import {FileText} from "../../../../icons/icons.jsx"
import { Link } from "react-router-dom";
function RecentView(){
    const {collapsed}=useSidebar();
    return (

         <section className={`px-6 gap-6 md:px-8 grid grid-cols-1 ${collapsed ? "md:grid-cols-1" : "md:grid-cols-2"} transition-all duration-200
        `}>
             <Link to={`/notes/new`} >
<article   className="flex border-b hover:rounded-xl border-text-muted/30 py-4 px-2 justify-between items-end w-full hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150 "> 
<div className="flex items-center gap-2">
<div className=" p-1.5 rounded-lg bg-notes-bg">
    <FileText size={20} strokeWidth={1.5} className="text-notes"/>

</div>
     <h2 className="text-text font-semibold text-lg md:text-xl">Retro Notes</h2>
</div>

    <p className="text-text-muted font-semibold text-sm md:text-md">Yesterday</p>
    </article>
</Link>

             <Link to={`/notes/new`} >
    <article className="flex  hover:rounded-xl border-b border-text-muted/30 py-4 px-2 justify-between items-end w-full hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150">
     <div className="flex items-center gap-2">
<div className=" p-1.5 rounded-lg bg-notes-bg">
    <FileText size={20} strokeWidth={1.5} className="text-notes"/>

</div>
     <h2 className="text-text font-semibold text-lg md:text-xl">Retro Notes</h2>
</div>
    <p className="text-text-muted font-semibold text-sm md:text-md">Yesterday</p>
</article>
</Link>
            </section>
    );
}

export default RecentView