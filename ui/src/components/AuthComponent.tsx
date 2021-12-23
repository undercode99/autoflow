import React, { useEffect } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from "./organism/Navbar"
import { userActions } from "../actions"

interface IAuthComponent {
    children: JSX.Element,
}


function AuthComponent(props: IAuthComponent) {

    let history = useHistory();
    let location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("auth")
        // userActions.checkLogin()
        dispatch(userActions.checkLogin())
    }, []);

    return (
        <div className="app flex">
            <Navbar />
            {props.children}
        </div>
    )
}

export default AuthComponent