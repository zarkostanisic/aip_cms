/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import Maps from "views/Map.js";
import UserPage from "views/User.js";
import UpgradeToPro from "views/Upgrade.js";

// Categories
import Categories from "views/Categories/Categories.js";
import NewCategory from "views/Categories/NewCategory.js";
import EditCategory from "views/Categories/EditCategory.js";

// Users
import Users from "views/Users/Users.js";
import NewUser from "views/Users/NewUser.js";
import EditUser from "views/Users/EditUser.js";

// Blog
import Posts from "views/Posts/Posts.js";
import EditPost from "views/Posts/EditPost.js";
import NewPost from "views/Posts/NewPost.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/categories/new",
    name: "Nova kategorija",
    icon: "nc-icon nc-bank",
    component: NewCategory,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/categories/edit/:id",
    name: "Izmena kategorije",
    icon: "nc-icon nc-bank",
    component: EditCategory,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/categories",
    name: "Kategorije",
    icon: "nc-icon nc-layout-11",
    component: Categories,
    layout: "/admin",
  },
  {
    path: "/users/new",
    name: "Nov korisnik",
    icon: "nc-icon nc-bank",
    component: NewUser,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/users/edit/:id",
    name: "Izmena korisnika",
    icon: "nc-icon nc-bank",
    component: EditUser,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/users",
    name: "Korisnici",
    icon: "nc-icon nc-single-02",
    component: Users,
    layout: "/admin",
  },
  {
    path: "/posts/edit/:id",
    name: "Izmena objave",
    icon: "nc-icon nc-bank",
    component: EditPost,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/posts/new",
    name: "Izmena objave",
    icon: "nc-icon nc-bank",
    component: NewPost,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/posts",
    name: "Blog",
    icon: "nc-icon nc-camera-compact",
    component: Posts,
    layout: "/admin",
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-diamond",
  //   component: Icons,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: Maps,
  //   layout: "/admin",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-page",
  //   name: "User Profile",
  //   icon: "nc-icon nc-single-02",
  //   component: UserPage,
  //   layout: "/admin",
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   icon: "nc-icon nc-tile-56",
  //   component: TableList,
  //   layout: "/admin",
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-caps-small",
  //   component: Typography,
  //   layout: "/admin",
  // }
];
export default routes;
