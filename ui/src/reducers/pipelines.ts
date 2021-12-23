import { pipelineConstants } from '../constants';


const stateInit = {
    title: "",
    category: "",
    mode_edit: false,
    code: `keep_logs_running: 10

step:
- name : Extract data from source scraper api
  strict_error: true
  type : ssh
  env  : server-bla2
  commands:
    - /home/xxx/anaconda3/envs/rantools/bin/python -u test_run.py

schedule: 
- 0 2 * * * `,
    active: true,
    create_new: false,
    notes: "",
    id: null,
    loading: false,
    has_error: false,
    message_error: "",
    message_success: "",
    has_success: false,
}

export function pipeline(state = stateInit, action: any) {
    switch (action.type) {
        case pipelineConstants.CREATE_FLASH:
            return {
                ...state,
                id: null,
                title: action.title,
                category: action.category,
                mode_edit: true,
                create_new: true,
                has_error: false,
                message_error: "",
                message_success: "",
                has_success: false,
                notes: "",
                code: stateInit.code
            };
        case pipelineConstants.PIPELINE_CHANGE_TITLE:
            return {...state, title:action.title};
        case pipelineConstants.PIPELINE_CHANGE_CATEGORY:
            return {...state, category:action.category};
        case pipelineConstants.PIPELINE_CHANGE_CODE:
            return {...state, code: action.code}
        case pipelineConstants.PIPELINE_CHANGE_ACTIVE:
            return {...state, active: action.active}
        case pipelineConstants.PIPELINE_CHANGE_NOTES:
            return {...state, notes: action.notes}
        case pipelineConstants.PIPELINE_SET_LOADING:
            return {...state, loading: true}
        case pipelineConstants.PIPELINE_HAS_ERROR:
            return {...state, has_error: true, has_success:false, message_error: action.error}
        case pipelineConstants.PIPELINE_SAVE_SUCCESS:
            return {...state, has_error: false, has_success:true,create_new:false, mode_edit:false, message_success: action.success}
        case pipelineConstants.PIPELINE_DETAIL_DATA_TO_STATE:
            if (action.active != 1){
                action.active = 0
            }
            return {...state, ...action, create_new:false, mode_edit: false, message_error: "", has_success:false, has_error:false, message_success: ""}
        case pipelineConstants.PIPELINE_CLEAR_STATE:
            return {...state, create_new:false, mode_edit: false, message_error: "", has_success:false, has_error:false, message_success: ""}
        case pipelineConstants.PIPELINE_EDIT_MODE:
            return {...state, ...action, create_new:false, mode_edit: action.edit, message_error: "", has_success:false, has_error:false, message_success: ""}
        default:
            return state
    }
}