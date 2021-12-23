import { pipelineConstants } from '../constants';
import { Dispatch } from 'react';
import { pipelineServices } from "../services"
import { history } from '../helpers';

export const pipelineAction = {
    create_flash,
    change_title,
    change_code,
    change_category,
    change_active,
    change_notes,
    clear_state,
    saveNewJob,
    change_edit,
    updateJob,
    detailPipeline,
    deletePipeline
};

function create_flash(title:string, category:string ) {
    return { type: pipelineConstants.CREATE_FLASH, title, category };
}

function change_title(title:string){
    return { type: pipelineConstants.PIPELINE_CHANGE_TITLE, title};
}

function change_category(category:string){
    return { type: pipelineConstants.PIPELINE_CHANGE_CATEGORY, category};
}

function change_code(code:string){
    return { type: pipelineConstants.PIPELINE_CHANGE_CODE, code};
}

function change_active(active:boolean){
    return { type: pipelineConstants.PIPELINE_CHANGE_ACTIVE, active};
}

function change_edit(edit:boolean = true){
    return {
        type: pipelineConstants.PIPELINE_EDIT_MODE,
        edit
    }
}


function change_notes(notes:string){
    return { type: pipelineConstants.PIPELINE_CHANGE_NOTES, notes};
}

function set_loading(loading:boolean){
    return { type: pipelineConstants.PIPELINE_SET_LOADING, loading:loading}
}


function set_success(success:string){
    return { type: pipelineConstants.PIPELINE_SAVE_SUCCESS, success}
}

function set_error(error:any){
    return { type: pipelineConstants.PIPELINE_HAS_ERROR, error}
}

function clear_state(){
    return {type:pipelineConstants.PIPELINE_CLEAR_STATE}
}

function saveNewJob(pipeline:any): Dispatch<any>  {
    return dispatch => {
        dispatch(set_loading(true))
        pipelineServices.createNewPipeline(pipeline.title, pipeline.category, pipeline.notes, pipeline.active, pipeline.code)
        .then(created => {
            console.log("Has created",created)
            dispatch(set_success("Success created new pipeline"))
            setTimeout(() => history.push("/pipelines"), 500)
        }, error => {
            console.log("Has error",error)
            dispatch(set_error(error))
        })
    }
}


function updateJob(id:any, pipeline:any): Dispatch<any>  {
    return dispatch => {
        dispatch(set_loading(true))
        pipelineServices.updatePipeline(id, pipeline.title, pipeline.category, pipeline.notes, pipeline.active, pipeline.code)
        .then(created => {
            dispatch(set_loading(false))
            dispatch(set_success("Success update pipeline"))
        }, error => {
            dispatch(set_error(error))
        })
    }
}


function deletePipeline(id:any):Dispatch<any>{
    return dispatch => {
        dispatch(set_loading(true))
        pipelineServices.deletePipeline(id)
        .then(created => {
            dispatch(set_loading(false))
            dispatch(set_success("Success delete pipeline"))
            setTimeout(() => history.push("/pipelines"), 500)
        }, error => {
            dispatch(set_error(error))
        })
    }
}


function detailPipeline(id:any): Dispatch<any> {
    return dispatch => {
        dispatch(set_loading(true))
        pipelineServices.firstJob(id).then(success => {
            let { job } = success
            dispatch(set_loading(false))
            dispatch(updateDataDetail(id, job.Name, job.Category, job.Description, job.CreatedAt, job.Active, job.TmpConfigYaml))
        },
        error => {
            console.log(error)
            history.push("/pipelines")
        })
    }
    
}

function updateDataDetail(id:any, title:any, category:any, notes:any, created_at:any,  active:any, code:any){
    return {
        type: pipelineConstants.PIPELINE_DETAIL_DATA_TO_STATE,
        id, title, category, notes, created_at, active, code
    }
}
