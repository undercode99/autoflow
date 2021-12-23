import { userConstants } from '../constants';
import { IUserAction } from "../types"

export function users(state={}, action:IUserAction) {
    switch (action.type) {
        case userConstants.GET_REQUEST:
            return {
                loading: true
            };
        case userConstants.GET_SUCCESS:
            return {
                items: action.user
            }
        case userConstants.GET_FAILURE:
            return{
                error: action.error
            }
        default:
            return state
    }
}