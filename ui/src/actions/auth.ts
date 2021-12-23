import { userConstants } from '../constants';
import { userService } from '../services';
import { history } from '../helpers';
import { IUserState, LocationState } from "../types"

import { Dispatch } from 'react';
import { Console } from 'console';

export const userActions = {
    login,
    request,
    checkLogin,
    success,
    failure,
};



function login(username: string, password: string, from: LocationState): Dispatch<any> {
    return dispatch => {
        dispatch(request());

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user.user));
                    history.push("/pipelines");
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

}

function request() { return { type: userConstants.LOGIN_REQUEST } }
function success(user: IUserState) { return { type: userConstants.LOGIN_SUCCESS, user } }
function failure(error: string) { return { type: userConstants.LOGIN_FAILURE, error } }


function checkLogin(): Dispatch<any> {
    return dispatch => {
        userService.getPath("/userinfo")
            .then(user => {
                dispatch(success(user.user));
            },
                error => {
                    dispatch(failure(error.toString()));
                    console.log(error);
                    userService.logout();
                    history.push("/login");
                })
    }
    function success(user: IUserState) { return { type: userConstants.LOGIN_SUCCESS, user } }
}