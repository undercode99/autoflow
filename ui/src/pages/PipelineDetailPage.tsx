import Content from "../components/organism/Content"
import BtnSave from "../components/atoms/buttons/BtnSave"
import HistoryLogsRunning from "../components/molecule/HistoryLogsRunning"
import BxXIcon from "components/atoms/icons/BxXIcon"
import BxTrashIcon from "components/atoms/icons/BxTrashIcon"
import BtnEdit from "../components/atoms/buttons/BtnEdit"
import EditIcon from "../components/atoms/icons/EditIcon"
import PlusIcon from "../components/atoms/icons/PlusIcon"
import AutosizeInput from 'react-input-autosize';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
// action
import { pipelineAction } from "../actions"
import { pipelineServices } from "../services"
import YamlEditor from "../components/molecule/YamlEditor"
import {
    NavLink
} from "react-router-dom";

import React, { useEffect, useRef, useState } from "react"


interface IPropsPipelineEditor {
    text?: string;
    onClose: React.EffectCallback
}

function PipelineEditor({ onClose }: IPropsPipelineEditor): JSX.Element {

    const dispatch = useDispatch()
    const location = useHistory()


    const handleOnInputTitle = (e: any) => {
        dispatch(pipelineAction.change_title(e.target.value))
    }


    const handleOnInputCategory = (e: any) => {
        dispatch(pipelineAction.change_category(e.target.value))
    }

    const handleClickClose = () => {
        if (pipeline.create_new) {
            location.push("/pipelines")
            return
        }
        dispatch(pipelineAction.change_edit(false))
    }

    const handleClickSave = () => {
        if (pipeline.id) {
            dispatch(pipelineAction.updateJob(pipeline.id, pipeline))
            return
        }
        dispatch(pipelineAction.saveNewJob(pipeline))
    }

    const pipeline: any = useSelector<any>(state => state.pipeline)

    return <>
        <div className="flex justify-between flex-wrap items-center">
            <div>
                <div className="flex">
                    <AutosizeInput onChange={handleOnInputTitle}
                        value={pipeline.title}
                        maxLength={70}
                        inputClassName="text-2xl capitalize pb-1 rounded w-full  overflow-hidden font-medium text-gray-700 focus:outline-none focus:shadow-outline-white"
                    /><EditIcon className="inline ml-2 text-gray-300 " />
                </div>
                <div className="flex items-center mt-1">
                    <div className="text-gray-400 font-thin text-base flex">
                        <div className="flex">
                            <AutosizeInput maxLength={30} inputClassName="mr-2 capitalize font-medium focus:outline-none focus:shadow-outline-white" value={pipeline.category} onChange={handleOnInputCategory} />
                            <EditIcon className="inline mr-2 text-gray-300 " />
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex flex-wrap items-center">
                <div className="flex items-center justify-center mr-4">
                    <label className="flex items-center cursor-pointer">
                        <div className="mr-3 text-gray-400 font-medium">
                            Status active
                        </div>
                        <div className="relative">
                            <input type="checkbox" defaultChecked={pipeline.active} onChange={() => dispatch(pipelineAction.change_active(!pipeline.active))} className="sr-only" />
                            <div className="block dot-block bg-gray-200 border w-14 h-8 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                        </div>
                    </label>
                </div>
                <BtnSave onClick={handleClickSave} text="Save" />

                <button onClick={handleClickClose} className="ml-2 hover:text-gray-700 text-gray-400 focus:outline-none focus:shadow-outline-white"><BxXIcon className="text-4xl" /></button>

            </div>
        </div>
        <div className="my-4 mb-4">
            <div className="flex flex-col">
                <div className="w-full">
                    <YamlEditor code={pipeline.code} readOnly={false} onChange={(value: any) => dispatch(pipelineAction.change_code(value))} />
                </div>
                <div className="w-full mt-3">
                    <label className="block text-gray-600 font-medium mb-1.5 text-lg">Notes: </label>
                    <textarea onChange={(e) => dispatch(pipelineAction.change_notes(e.target.value))} rows={6} className="focus:ring-2 focus:ring-blue-500 ring-1 ring-gray-400 focus:outline-none w-full text-base placeholder-gray-400 border rounded py-1.5 px-3" placeholder="Enter some long form content." value={pipeline.notes}></textarea>
                </div>
            </div>
        </div>
        {pipeline.has_error &&
            <div className="p-4 text-white bg-red-500 rounded-lg">
                {pipeline.message_error}
            </div>
        }
        {
            pipeline.has_success &&
            <div className="p-4 text-white bg-green-500 rounded-lg">
                {pipeline.message_success}
            </div>
        }
    </>
}


function Dialog(props: any) {
    const { open } = props;
    if (!open) {
        return <></>;
    }
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light ">
            <div className="relative p-6 bg-white w-full max-w-md mx-auto mt-14 flex-col border shadow-lg flex rounded-lg opacity-1">
                <div>{props.children}</div>
            </div>
        </div>
    );
}


function PipelineDetailPage(): JSX.Element {

    let [show_confirm, set_show_confirm] = useState(0)

    const dispatch = useDispatch()
    const handleEditDone = () => { dispatch(pipelineAction.change_edit(false)) }
    const handleEditClick = () => { dispatch(pipelineAction.change_edit(true)) }

    const { id } = useParams<any>();

    const handleDelete = () => {
        dispatch(pipelineAction.deletePipeline(id))
    }

    const location = useHistory()
    const pipeline: any = useSelector<any>(state => state.pipeline)

    useEffect(() => {
        if (!id && pipeline.create_new == false) {
            location.push("/pipelines")
        }
        if (id) {
            dispatch(pipelineAction.detailPipeline(id))
        }
    }, [])

    return (
        <>
            <Dialog open={show_confirm}  >
                <div className="text-lg mb-2">
                    Delete job pipeline, Are you sure?
                </div>
                <div className="mt-4" >
                    <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1.5 font-medium text-base rounded-md border border-gray-200 flex items-center  focus:outline-none focus:shadow-outline-white active:bg-red-900 transition duration-150 ease-in-out inline-flex">Delete</button>
                    <button onClick={() => set_show_confirm(0)} className="px-4 py-1.5 font-medium  border border-gray-400  mx-1 rounded-md text-base bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">Close</button>
                </div>
            </Dialog>
            <Content className={show_confirm ? "opacity-20" : "opacity-1"}>

                {
                    pipeline.mode_edit ? <PipelineEditor onClose={handleEditDone} />
                        :
                        <>
                            <div className="flex justify-between flex-wrap items-center">
                                <div>
                                    <h1 className="text-2xl font-medium text-gray-700 focus:outline-none focus:shadow-outline-white">
                                        {pipeline.title}
                                    </h1>
                                    <div className="flex items-center mt-1">
                                        <div className="text-gray-400 font-thin text-base flex">
                                            <div className="flex">
                                                <span className="mr-2 font-medium focus:outline-none focus:shadow-outline-white">{pipeline.category} </span>
                                            </div> - <span className="ml-2">Created at {new Date(pipeline.created_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}  </span>
                                        </div>
                                        {pipeline.active ?
                                            <label className="ml-2 text-white rounded-md bg-green-500 px-4 text-sm">Active</label>
                                            :
                                            <label className="ml-2 text-white rounded-md bg-yellow-500 px-4 text-sm">Inactive</label>
                                        }

                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center">
                                    <button onClick={() => {
                                        if (pipeline.active) {
                                            alert("Edit and set inactive this job pipeline for delete action")
                                            return
                                        }
                                        set_show_confirm(1)
                                    }} className="text-2xl mx-4 text-red-400 focus:outline-none hover:text-red-500"><BxTrashIcon /></button>
                                    <BtnEdit onClick={handleEditClick} />
                                </div>
                            </div>
                            <div className="my-4">
                                <div className="flex flex-col">
                                    {pipeline.notes != "" &&
                                        <div className="mt-4 mb-4 rounded px-4 py-3 bg-yellow-100 border-l-4 text-gray-700 border-yellow-400">
                                            <b>Notes: </b>
                                            <p>
                                                {pipeline.notes}
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <HistoryLogsRunning id={id} />
                        </>
                }
            </Content>
        </>
    );
}

export default PipelineDetailPage;
