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
import Membership from "../Components/Membership";
import UserHome from "../Dashboard/UserHome";
import RoleBasedRedirect from "../Dashboard/RoleBasedRedirect";
import AdminHome from "../Dashboard/AdminHome";
import PrivateRoute from "../Components/PrivateRoute";
import ErrorPage from "../Components/ErrorPage";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            { index: true, Component: Home },
            { path: "register", Component: Register },
            { path: "login", Component: Login },
            { path: "postdetails/:id", element: <PrivateRoute><PostDetails></PostDetails></PrivateRoute> },
            { path: "membership", element: <UserRoute><Membership></Membership></UserRoute> },
            { path: "forbidden", Component: Forbidden }

        ],
    },
    {
        path: "/dashboard",
        Component: DashboardLayout,
        children: [
            // default redirect based on role
            { index: true, element: <RoleBasedRedirect /> },

            // User routes
            { path: "userhome", element: <UserRoute><UserHome /></UserRoute> },
            { path: "profile", element: <UserRoute><DashboardProfile /></UserRoute> },
            { path: "addpost", element: <UserRoute><AddPost /></UserRoute> },
            { path: "myposts", element: <UserRoute><MyPosts /></UserRoute> },
            { path: "posts/:id", element: <UserRoute><PostComments></PostComments></UserRoute> },

            // Admin routes
            { path: "adminhome", element: <AdminRoute><AdminHome></AdminHome></AdminRoute> },
            { path: "adminprofile", element: <AdminRoute><AdminProfile /></AdminRoute> },
            { path: "manageusers", element: <AdminRoute><ManageUsers /></AdminRoute> },
            { path: "addannouncement", element: <AdminRoute><AddAnnouncement /></AdminRoute> },
            { path: "reportedcomments", element: <AdminRoute><ReportedComments /></AdminRoute> },
        ]
    },
    {
        path: "*",
        element: <ErrorPage />,
    },

]);
