export * from './history';
export * from './store';
export * from './auth-header';
const { REACT_APP_MODE } = process.env;

console.log(REACT_APP_MODE)
let url_api = "http://localhost:8080/api"
if (REACT_APP_MODE == "release") {
    url_api = "http://10.54.68.131:8882/api"
}

export const BASE_URL_API: string = url_api

