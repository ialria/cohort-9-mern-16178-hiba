import {Check}from "../icons/icons.jsx";
// /**
//  * @param {{ message: string }} props
//  */
function Toast({ message }) {
  return (
   <output className="fixed top-5 right-5 z-50 bg-surface border border-primary-light rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
      <div aria-hidden="true" className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Check size={24} strokeWidth={1} className="text-surface text-sm font-bold"/>
      </div>

      <p className="text-text text-sm">{message}</p>
    </output>
  );
}

export default Toast