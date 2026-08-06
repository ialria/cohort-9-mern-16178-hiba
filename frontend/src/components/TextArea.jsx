function TextArea({
    placeholder,className="",rows=1,
})
{

    return (
<textarea
            placeholder={placeholder}
            rows={rows}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className={`
                   w-full
    resize-none
    overflow-hidden
    bg-transparent
    focus-visible:ring-2
focus-visible:ring-primary
focus-visible:outline-none
    align-tight
  ${className}
                `}
 
          />
    );
}

export default TextArea