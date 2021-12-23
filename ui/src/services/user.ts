import { authHeader, BASE_URL_API } from '../helpers';

export const userService = {
    login,
    logout,
    getAll,
    getById,
    getPath,
    handleResponse,
};

function login(username: string, password:string) {
    const requestOptions : any = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${BASE_URL_API}/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // console.log(user.token)
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', user.token);
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
}

function getAll() {
    const requestOptions: any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()}
    };

    return fetch(`/users`, requestOptions).then(handleResponse);
}

function getPath(path: string){
    const requestOptions: any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()}
    };

    return fetch(`${BASE_URL_API}${path}`, requestOptions).then(handleResponse);
}

function getById(id:number) {
    const requestOptions: any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()}
    };

    return fetch(`/users/${id}`, requestOptions).then(handleResponse);
}


function handleResponse(response: Response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}