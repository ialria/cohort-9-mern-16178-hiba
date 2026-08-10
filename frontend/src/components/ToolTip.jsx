import { cloneElement, useId } from "react";

function Tooltip({ text, children }) {
    const tooltipId = useId();

  const child = cloneElement(children, {
  "aria-describedby": [
    children.props["aria-describedby"],
    tooltipId,
  ]
    .filter(Boolean)
    .join(" "),
})


  return (
    <div className="group relative inline-block">
      {child}

      <span
      id={tooltipId}
      role="tooltip"
        className="
          absolute
          left-1/2
          top-full
          mt-1
          -translate-x-1/2
          whitespace-nowrap
          rounded-xl
          bg-surface
          border border-text/20
          px-2
          py-1
          text-[10px]
          text-text-muted
          transition-opacity
          opacity-0
          duration-200
          group-hover:opacity-100
          group-focus-within:opacity-100
          pointer-events-none
          z-50
        "
      >
        {text}
      </span>
    </div>
  );
}

export default Tooltip;