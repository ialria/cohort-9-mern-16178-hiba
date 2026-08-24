import {
  FileText,
  Pin,
  Trash2,
  Settings,
  Clock,
  User
} from "lucide-react";
export const sidebarItems=[
{id:"notes",
    path:"/dashboard",
    title: "All Notes",
    icon: FileText
},{
    id:"pin",
     path:"/dashboard/pin",
    title: "Pin",
    icon: Pin
},
{
    id:"recent",
      path:"/dashboard/recent",
    title: "Recent",
    icon: Clock
},
{
    id:"profile",
      path:"/profile",
    title: "Profile",
    icon: User
},
{
    id:"trash",
path:"/dashboard/trash",
    title: "Trash",
    icon: Trash2
},
// {
//     id: "settings",
//     title: "Settings",
//     icon: Settings
// },

];
