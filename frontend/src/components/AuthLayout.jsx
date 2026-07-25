import BrandPanel from './brandPanel';
function AuthLayout({ children}) {
 return <div className="min-h-screen w-full flex justify-center">
      <BrandPanel />
    {children}
    </div>

}

export default AuthLayout;