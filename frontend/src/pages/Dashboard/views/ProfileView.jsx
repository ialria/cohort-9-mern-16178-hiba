import Button from "../../../components/Button.jsx";
import {
  PenLine,
  User,
  Mail,
  Calendar,
  Activity,
  FileText,
  Star,
  Trash2,
  Clock,
  SlidersHorizontal,
  Bell,
    ChevronRight,
    LogOut,
  Moon
} from "../../../icons/icons.jsx";
import DashboardLayout from "../../../layouts/DashboardLayout.jsx";
import SidebarLayout from "../../../layouts/SidebarLayout.jsx";
import { useNotes } from "../../../context/NotesContext.jsx";
import { useSidebar } from "../../../context/SidebarContext.jsx";
import { Link } from "react-router-dom";
function Card({ children, className = "" }) {
  return (
    <div
      className={`flex border justify-between w-full items-center border-text-muted/30 rounded-3xl  px-4 md:px-6 py-4 md:py-8 bg-surface hover:border-primary-light hover:shadow-lg hover:translate-y-1 duration-150 ${className}`}
    >
      {children}
    </div>
  );
}

function InnerElement({
  icon: Icon,
  iconClassName = "",
  iconSize = 18,
  iconWrapperClass = "",
  strokeWidth = 1.5,
  children,
  className = "",
}) {
  return (
    <div className={`${className} flex gap-2 items-center w-full`}>
      <div className={`${iconWrapperClass}  rounded-xl p-2`}>
        <Icon
          size={iconSize}
          strokeWidth={strokeWidth}
          className={iconClassName}
        />
      </div>

      {children}
    </div>
  );
}

function ProfileView() {
    const {collapsed}=useSidebar();
  const { notes } = useNotes();
  const favouriteNum = notes.filter(
    (note) => note.favorite && !note.deleted,
  ).length;
  const deletedNum = notes.filter((note) => note.deleted).length;
  return (
    <DashboardLayout>
      <main className="px-5 md:px-8 flex flex-col gap-4 pb-8">
      
        <div className={`grid grid-cols-1 gap-4 w-full ${collapsed ? "md:grid-cols-1" : "md:grid-cols-2"} lg:grid-cols-3`}>
              {/* top profile card */}
        <Card className="col-span-full lg:col-span-2">
          <div className="flex items-center  gap-2 md:gap-4">
            <div className="border  w-12 h-12 md:w-26 md:h-26 flex items-center justify-center  bg-primary rounded-full">
              <p className=" text-2xl md:text-5xl font-semibold text-surface">H</p>
            </div>
            <div>
              <h2 className="text-text md:text-xl  font-semibold">Hiba</h2>
              <p className="text-text-muted  text-xs md:text-sm">hibaexp@gmail.com</p>
            </div>
          </div>
          <div>
<Link to={`/edit_profile`}>
            <Button className="flex items-center gap-3 bg-primary">
              <PenLine size={16} strokeWidth={1.5} className="text-surface" />
              <span className=" md:text-md text-surface">Edit</span><span className="hidden md:block text-surface">Profile</span>
            </Button>
            </Link>
          </div>
        </Card>
        {/* account info + activity */}

          {/* account into */}
          <Card className=" flex-col gap-4 flex-4 items-start">
            <InnerElement
              icon={User}
              iconSize={20}
              iconClassName="text-notes"
              iconWrapperClass="bg-notes-bg"
            >
              <div>
                <p className="text-sm font-semibold text-text">
                  Account Information
                </p>
              </div>
            </InnerElement>
            <InnerElement icon={Mail}>
              <div>
                <p className="text-sm text-text">Email</p>
                <p className="text-xs text-text-muted">hibaexp@gmail.com</p>
              </div>
            </InnerElement>{" "}
            <InnerElement icon={Calendar}>
              <div>
                <p className="text-sm text-text">Joined</p>
                <p className="text-xs text-text-muted">Aug 4, 2026</p>
              </div>
            </InnerElement>
          </Card>
              {/* recent activity */}
          <Card className={` flex-col  gap-4 flex-6  ${collapsed ? "lg:col-span-2" : "lg:col-span-1"}`}>
            <InnerElement
              icon={Clock}
              iconSize={20}
              iconClassName="text-notes"
              iconWrapperClass="bg-notes-bg"
            >
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-semibold text-text">
                  Recent Activity
                </p>
                <p className="text-notes text-sm font-semibold"> View all</p>
              </div>
            </InnerElement>
              <InnerElement icon={FileText}>
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-text flex flex-col items-start justify-center">Retro Notes <span className="text-xs text-text-muted">Yesterday</span></p>
              <Star size={18}className="text-fav fill-fav"/>
               
              </div>
            </InnerElement>
              <InnerElement icon={FileText}>
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-text flex flex-col items-start justify-center">Retro Notes <span className="text-xs text-text-muted">Yesterday</span></p>
              <Star size={18}className="text-fav fill-fav"/>
               
              </div>
            </InnerElement>
              <InnerElement icon={FileText}>
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-text flex flex-col items-start justify-center">Retro Notes <span className="text-xs text-text-muted">Yesterday</span></p>
              <Star size={18}className="text-fav fill-fav"/>
               
              </div>
            </InnerElement>
          </Card>
        
        
       

        {/* preferences + {demo } recent*/}
      
          {/* preferences */}
          <Card className=" flex-col  gap-4 flex-4 justify-start">
            <InnerElement
              icon={SlidersHorizontal}
              iconSize={20}
              iconClassName="text-notes"
              iconWrapperClass="bg-notes-bg"
            >
              <div>
                <p className="text-sm font-semibold text-text">
                  Preferences
                </p>
              </div>
            </InnerElement>
            <InnerElement icon={Moon}>
              <div className="flex justify-between items-end w-full">
                <p className="text-sm text-text">Appearance</p>
                <p className="text-text-muted text-xs flex gap-1"> System<ChevronRight size={18} /></p>
               
              </div>
            </InnerElement>
            <InnerElement icon={Bell}>
              <div className="flex justify-between items-end w-full">
                <p className="text-sm text-text">Notifications </p>
                <p className="text-text-muted text-xs flex gap-1"> On <ChevronRight size={18} /></p>
               
              </div>
            </InnerElement>
          </Card>
  {/* activity overview */}
          <Card className={` flex-col ${collapsed ? "lg:col-span-2" : "lg:col-span-1"} gap-4 flex-6 justify-start`}>
            <InnerElement
              icon={Activity}
              iconSize={20}
              iconClassName="text-notes"
              iconWrapperClass="bg-notes-bg"
            >
              <div>
                <p className="text-sm font-semibold text-text">
                  Activity Overview
                </p>
              </div>
            </InnerElement>
            <div className="grid grid-cols-4 w-full">
              <InnerElement
                icon={FileText}
                iconSize={20}
                iconClassName="text-notes"
                iconWrapperClass="bg-notes-bg"
                className="flex-col flex-1"
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-text">Notes</p>
                  <p className="text-sm text-text-muted">{notes.length}</p>
                </div>
              </InnerElement>

              <InnerElement
                icon={Star}
                iconSize={20}
                className="flex-1 flex-col"
                iconClassName="text-fav fill-fav"
                iconWrapperClass="bg-fav-bg"
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-text">Favorites</p>
                  <p className="text-sm text-text-muted">{favouriteNum}</p>
                </div>
              </InnerElement>
              <InnerElement
                icon={Trash2}
                className="flex-1 flex-col"
                iconSize={20}
                iconClassName="text-error"
                iconWrapperClass="bg-delete-bgLight"
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-text">Deleted</p>
                  <p className="text-sm text-text-muted">{deletedNum}</p>
                </div>
              </InnerElement>
              <InnerElement
                icon={Clock}
                className="flex-1 flex-col"
                iconSize={20}
                iconClassName="text-recent"
                iconWrapperClass="bg-recent-bg"
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-text">Recent</p>
                  <p className="text-sm text-text-muted">0</p>
                </div>
              </InnerElement>
            </div>
          </Card>
      

{/* account actions */}
          <Card className={`col-span-full flex-col  gap-4 flex-6 ${collapsed ? "lg:col-span-1" : "lg:col-span-full"} justify-start`}>
            <InnerElement
              icon={LogOut}
              iconSize={20}
              iconClassName="text-notes"
              iconWrapperClass="bg-notes-bg"
            >
        
                <p className="text-sm font-semibold text-text">
                  Account Actions
                </p>          
            </InnerElement>
               <InnerElement
              icon={LogOut}
              iconSize={20}
              iconClassName="text-error"
              iconWrapperClass="bg-delete-bgLight"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-start justify-center flex-col">
  <p className="text-sm font-semibold text-text">
                  Sign out
                </p>
                <span className="text-xs text-text-muted">Sign out from your account</span>
                </div>
              
                <ChevronRight size={18} strokeWidth={1.5} className="text-text-muted text-sm" />
              </div>
            </InnerElement>
            </Card>
             </div>
      </main>
    </DashboardLayout>
  );
}

export default ProfileView;
