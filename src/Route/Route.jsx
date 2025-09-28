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
            { path: "addpost", Component: AddPost },
            { path: "myposts", element: <UserRoute><MyPosts></MyPosts></UserRoute> },
            { path: "manageusers", Component: ManageUsers },
            { path: "posts/:id", Component: PostComments },
            { path: "addannouncement", Component: AddAnnouncement },
            { path: "reportedcomments", Component: ReportedComments },
            // Add more dashboard nested routes here
        ],
    },
]);
