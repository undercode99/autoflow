import Content from "../components/organism/Content"
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { userService } from "services"
import { userActions } from "actions"
import {
    NavLink
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


function AutoLoginPages(): JSX.Element {

    const { accessToken } = useParams<any>()
    const history = useHistory()
    const dispatch = useDispatch()
    const user_data = useSelector((s: any) => s.auth)
    useEffect(() => {
        localStorage.setItem("token", accessToken)
        userService.getPath("/userinfo")
            .then(user => {
                dispatch(userActions.success(user.user));
                history.push("/pipelines")
            },
                error => {
                    dispatch(userActions.failure(error.toString()));
                    console.log(error);
                    userService.logout();
                })
    }, [])
    return (
        <Content>
            {user_data.error != "" ? <div className="w-full bg-red-500 px-3 py-2 text-lg rounded  text-white">
                <strong>Auto login failed</strong> : {user_data.error}
            </div> : "Loading ..."}
        </Content>
    );
}

export default AutoLoginPages;

