import BrandPanel from '../components/BrandPanel';
function AuthLayout({ children}) {
 return <div className="min-h-screen w-full flex flex-col md:flex-row">
      <BrandPanel />
    {children}
    </div>

}

export default AuthLayout;