import SidebarLayout from "../../../layouts/SidebarLayout";
import { useSidebar } from "../../../context/SidebarContext";
import { Menu, Camera } from "../../../icons/icons.jsx";
import Button from "../../../components/Button";
function EditProfile() {
  const { setDrawerOpen } = useSidebar();
 const {collapsed} =useSidebar();
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <SidebarLayout />
      {/* header */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20  ">
          <div className="relative bg-background md:pt-4 pt-3 pb-3 px-8 flex justify-between items-center backdrop-blur-md w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="outline-none hover:bg-primary-light p-3 transition-all duration-150 rounded-full block md:hidden"
              >
                <Menu size={22} />
              </button>

              <h1 className="text-text text-2xl font-semibold">Edit Profile</h1>
            </div>
          </div>

          <div className="h-8 w-full bg-gradient-to-b from-background to-transparent pointer-events-none" />
        </header>

        <article className="px-5 rounded-3xl py-6 md:py-8 border-text-muted/30 border bg-surface mx-4 mb-4">
          <div>
            <h2 className="text-text text-lg font-semibold">Edit Profile</h2>
            <p className="text-text-muted text-sm">
              Upload your profile information and prefenreces.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-9">
            <div className=" border rounded-xl border-text-muted/30 flex flex-col items-center justify-start py-4 px-4">
              <h3>Profile Picture</h3>
              <div className="border relative bg-primary w-20 h-20 my-5 rounded-full flex items-center justify-center">
                <p className="text-surface text-3xl">H</p>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-text-muted/30 absolute bottom-0 -right-3">
                  {" "}
                  <Camera
                    size={18}
                    strokeWidth={1.5}
                    className="text-text-muted"
                  />
                </button>
              </div>
              <p className="text-xs text-text-muted">JPG or PNG. Max size 2MB</p>
              <Button className="bg-primary-lighter mt-3 hover:bg-primary hover:text-surface transition-all duration-150">Change photo</Button>
            </div>


            <div >
             <div className=" border rounded-xl border-text-muted/30 py-4 px-4">
                   <form className="w-full">
                          <div className="mb-2">
          <label htmlFor="userName" className="text-text text-xs">
            User Name
          </label>
          <input
            id="userName"
            type="text"
          
            placeholder="hiba"
            className="w-full border border-text-muted/40 rounded-lg px-3 py-2 bg-surface placeholder:text-text-muted"
          />
       
        </div>
                      <div className="mb-2">
          <label htmlFor="name" className="text-text text-xs">
            Full Name
          </label>
          <input
            id="name"
            type="text"
          
            placeholder="Hiba"
            className="w-full border rounded-lg px-3 py-2 border-text-muted/40 bg-surface placeholder:text-text-muted"
          />
       
        </div>
              <div className="mb-6">
          <label htmlFor="email" className="text-text text-xs">
            Email
          </label>
          <input
            id="email"
            type="email"
          
            placeholder="you@example.com"
            className="w-full border rounded-lg px-3 py-2 border-text-muted/40 bg-surface placeholder:text-text-muted"
          />
       
        </div>
     <div className="flex gap-2">
 <Button type="submit" className=" w-full bg-primary-light text-text-muted">Cancel</Button>
    <Button type="submit" className="w-full bg-primary text-surface">Save</Button>
     
        </div>
        </form>

             </div>
                  
            </div>
            
          </div>
        </article>
      </main>
    </div>
  );
}

export default EditProfile;
