import { authHeader, BASE_URL_API } from '../helpers';
export const pipelineServices = {
    createNewPipeline,
    fetchAllJob,
    firstJob,
    updatePipeline,
    deletePipeline,
    fetchRunningLogs,
    fetchRunningRawLogs,
    fetchEnvs,
    createNewEnvs,
    fetchEnvById,
    updateEnvs,
    deleteEnvById,
};



function createNewPipeline(name: string, category: string, description:string, active_bool:boolean, code:string) {

    let active = 8
    if (active_bool == true){
        active = 1
    }

    const requestOptions : any = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
        body: JSON.stringify({ name, category, description, active, code })
    };

    return fetch(`${BASE_URL_API}/create-job`, requestOptions)
        .then(handleResponse);
}

function deletePipeline(id:any){
    const requestOptions : any = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };
    return fetch(`${BASE_URL_API}/job/${id}`, requestOptions)
        .then(handleResponse);
}


function updatePipeline(id:any, name: string, category: string, description:string, active_bool:boolean, code:string) {

    let active = 8
    if (active_bool == true){
        active = 1
    }

    const requestOptions : any = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
        body: JSON.stringify({ name, category, description, active, code })
    };

    return fetch(`${BASE_URL_API}/job/${id}`, requestOptions)
        .then(handleResponse);
}



function fetchAllJob(page:number = 1, limit:number=8, sort="id desc", query="", status_running="all"){
    const requestOptions : any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };

    return fetch(`${BASE_URL_API}/jobs?page=${page}&limit=${limit}&sort=${sort}&query=${query}&status_running=${status_running}`, requestOptions)
        .then(handleResponse);
}

function firstJob(jobid:any){
    const requestOptions : any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };

    return fetch(`${BASE_URL_API}/job/${jobid}`, requestOptions)
        .then(handleResponse);
}


function fetchRunningLogs(jobid:any){
    const requestOptions : any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };
    return fetch(`${BASE_URL_API}/job/${jobid}/logs`, requestOptions)
        .then(handleResponse);
}


function fetchRunningRawLogs(running_id:any){
    const requestOptions : any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };
    return fetch(`${BASE_URL_API}/job/${running_id}/raw-logs`, requestOptions)
        .then(handleResponse);
}




function handleResponse(response: Response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}



function fetchEnvs(){
    const requestOptions : any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };

    return fetch(`${BASE_URL_API}/env`, requestOptions)
        .then(handleResponse);
}


function createNewEnvs(name:string, type:string, label:string, options:string){
    const requestOptions : any = {
        method: 'POST',
        body: JSON.stringify({ name, type, label, options}),
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };

    return fetch(`${BASE_URL_API}/env`, requestOptions)
        .then(handleResponse);
}


function updateEnvs(id:number,label:string, options:string){
    const requestOptions : any = {
        method: 'PUT',
        body: JSON.stringify({ label, options}),
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };

    return fetch(`${BASE_URL_API}/env/${id}`, requestOptions)
        .then(handleResponse);
}


function fetchEnvById(id:number){
    const requestOptions : any = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };

    return fetch(`${BASE_URL_API}/env/${id}`, requestOptions)
        .then(handleResponse);
}


function deleteEnvById(id:number){
    const requestOptions : any = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...authHeader()},
    };

    return fetch(`${BASE_URL_API}/env/${id}`, requestOptions)
        .then(handleResponse);
}
