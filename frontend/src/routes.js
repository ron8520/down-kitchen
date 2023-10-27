import {Navigate, useRoutes} from 'react-router-dom';
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Recipe from "./pages/Recipe";
import Register from "./pages/Register";
import MainLayout from "./layout/MainLayout";
import React from "react";
import Profile from "./pages/Profile";
import Gallery from "./pages/Gallery";
import Subscription from "./pages/Subscription"
import Setting from "./pages/Setting";
import CreateRecipe from "./pages/CreateRecipe";
import Uploader from "./components/Uploader"
import {useSelector} from "react-redux";
import Search from "./components/mainpage/Search";
import Moment from './pages/Moment';

export default function Router() {
    const user = useSelector((state) => (state.user))

    return useRoutes([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {path: '/', element: <MainPage /> },
                {path: '/profile/:userId', element: <Profile />},
                {path: '/gallery', element: <Gallery /> },
                {path: '/subscription', element: <Subscription/> },
                {path: '/recipe/:recipeId', element: <Recipe/> },
                {path: '/setting', element: localStorage.getItem('isLogin') === "true" ?
                        <Setting/> : <Navigate to={"/login"}/>},
                {path: '/createrecipe', element: localStorage.getItem('isLogin') === "true" ?
                        <CreateRecipe/> : <Navigate to={"/login"}/>},
                {path: '/uploader', element: <Uploader/>},
                {path: '/search/:keyword', element: <Search/>},
                {path: '/gallery/detail', element: <Moment/>}
            ]
        },
        {
            path: '/',
            children: [
                {path: 'login', element: <Login /> },
                {path: 'register', element: <Register/> }
            ]
        },
    ]);
}