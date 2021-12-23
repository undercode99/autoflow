import { userConstants } from '../constants';
import { IAuthAction } from "../types"

let token = localStorage.getItem('token') || ""


const initialState = token != "" ? { loggedIn: true, token: token, user: {}} : {loggedIn: false, user: {}, error: "", token: ""};

export function authentication(state = initialState, action: IAuthAction) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                requestLoggedIn: true
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE:
            return {
                error: action.error
            };
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}