export interface IUserState {
    id: number,
    username: string,
    name: string,
    email: string,
    super_admin: boolean,
    token: string
}

export interface IAuthAction {
    type: string,
    user?: IUserState,
    token: string,
    error?: string
}

export interface IUserAction {
    type: string,
    user?: IUserState,
    error?: string
}


export interface LocationState extends Location {
}


export interface InputStateLogin {
    username: string,
    password: string
}


export namespace StoreState {
    export type User = {
        loading: boolean,
        user: IUserState,
        error: string,
    }
    
    export type Auth = {
        requestLoggedIn: boolean,
        loggedIn: boolean,
        user: IUserState,
        error: string,
    }

    export type All = {
        user: User,
        auth: Auth
    }
}