import { createBrowserRouter } from "react-router";
import RootLayout from "../Components/RootLayout";
import Home from "../Components/Home";
import Register from "../Components/Register";
import Login from "../Components/Login";
import AddPost from "../Components/AddPost";
import PostDetails from "../Components/PostDetails";
import AddAnnouncement from "../Components/AddAnnouncement";

// Dashboard imports
import DashboardLayout from "../Dashboard/DashboardLayout";
import DashboardHome from "../Dashboard/DashboardHome";
import DashboardProfile from "../Dashboard/DashboardProfile";
import MyPosts from "../Dashboard/MyPosts";
import PostComments from "../Dashboard/PostComments";
import ManageUsers from "../Dashboard/ManageUsers";
import ReportedComments from "../Dashboard/ReportedComments";
import UserRoute from "../Components/UserRoute";
import { Component } from "react";
import Forbidden from "../Components/Forbidden";
import AdminRoute from "../Components/AdminRoute";
import AdminProfile from "../Dashboard/AdminProfile";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            { path: "register", Component: Register },
            { path: "login", Component: Login },
            { path: "postdetails/:id", Component: PostDetails },
            { path: "forbidden", Component: Forbidden }

        ],
    },
    {
        path: "/dashboard",
        Component: DashboardLayout,
        children: [
            { index: true, Component: DashboardHome }, // default: /dashboard
            {
                path: "profile",
                element: <UserRoute><DashboardProfile /></UserRoute>
            }, // /dashboard/profile
            { path: "addpost", element: <UserRoute><AddPost></AddPost></UserRoute> },
            { path: "myposts", element: <UserRoute><MyPosts></MyPosts></UserRoute> },
            { path: "manageusers", element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute> },
            { path: "posts/:id", element: <UserRoute><PostComments></PostComments></UserRoute> },
            { path: "adminprofile", element: <AdminRoute><AdminProfile></AdminProfile></AdminRoute> },
            { path: "addannouncement", element: <AdminRoute><AddAnnouncement></AddAnnouncement></AdminRoute> },
            { path: "reportedcomments", element: <AdminRoute><ReportedComments></ReportedComments></AdminRoute> }

        ]
    },
    // Add more dashboard nested routes here
]);
