function Button({children,onClick,type="button", className="",...props})
{

return (
    <button   {...props} 
    type={type} className={`rounded-full px-6 py-2.5 cursor-pointer transition-all duration-200 text-sm ${className}`} onClick={onClick}> 
    {children}
</button>
);

}

export default Button