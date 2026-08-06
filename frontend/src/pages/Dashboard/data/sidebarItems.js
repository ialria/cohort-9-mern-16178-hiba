import {
  FileText,
  Star,
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
    id:"favourites",
     path:"/dashboard/favorites",
    title: "Favourites",
    icon: Star
},{
    id:"trash",
path:"/dashboard/trash",
    title: "Trash",
    icon: Trash2
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
// {
//     id: "settings",
//     title: "Settings",
//     icon: Settings
// },

];
