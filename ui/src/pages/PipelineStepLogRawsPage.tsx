import Content from "../components/organism/Content"
import CloseCircleIcon from '../components/atoms/icons/CloseCircleIcon'
import Ansi from "ansi-to-react";
import BxArrowBackIcon from "../components/atoms/icons/BxArrowBackIcon"
import DownloadIcon from "../components/atoms/icons/DownloadIcon"
import BxCheckIcon from "../components/atoms/icons/BxCheckIcon"
import { pipelineServices } from 'services'
import { useDispatch, useSelector } from 'react-redux';
import { pipelineAction } from "actions"
import {
    NavLink, useParams
} from "react-router-dom";
import { useEffect, useState } from "react"
import { BASE_URL_API } from "helpers"

function DownloadButton({ id }: any): JSX.Element {
    const [filter, setFilter] = useState(0)
    return <>
        <select value={filter} onChange={(e: any) => setFilter(e.target.value)} className="mr-4 rounded bg-white focus:outline-none border text-gray-600 px-2">
            <option value="0">All Output</option>
            <option value="8">Error Output</option>
        </select>
        <a href={BASE_URL_API + `/job/${id}/download-raws/${filter}`} className="text-2xl" title="Download raw logs"><DownloadIcon className="text-2xl text-gray-600" /></a></>
}


function HomePage(): JSX.Element {

    const [log_raws, set_log_raws] = useState([])
    const [running_at, setRunningat] = useState(false)

    const { id, id_job } = useParams<any>()

    const dispatch = useDispatch()

    const pipeline: any = useSelector<any>(state => state.pipeline)

    useEffect(() => {
        dispatch(pipelineAction.detailPipeline(id_job))
        const intervalId = setInterval(() => {
            pipelineServices.fetchRunningRawLogs(id).then(
                success => {
                    set_log_raws(success.logs_running)
                },
                error => {

                }
            )
        }, 500)
        return () => clearInterval(intervalId); //This is important
    }, [])

    return (
        <Content>
            <div className="flex justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-medium">{pipeline.title}</h1>
                    <span className="text-base text-gray-400">Raw logs | Job Running at {running_at}</span>
                </div>
                <div>
                    <NavLink to={`/pipelines/detail/${id_job}`} className="px-4 py-1.5 font-medium  mx-1 rounded-md text-base bg-white text-blue-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">
                        <BxArrowBackIcon className="mr-2" />  Back
                    </NavLink>
                </div>
            </div>
            <div className="mt-4 mb-12">
                <div className="flex flex-col">
                    {log_raws.map((e: any) => {
                        if (running_at == false) {
                            setRunningat(e.running_at)
                        }
                        return <div className="bg-white border shadow rounded-md mb-6   w-full">
                            <div className="flex flex-row justify-between px-3 items-center py-2 ">
                                <div className="flex flex-wrap flex-row items-center">
                                    {e.status == 8 ? <CloseCircleIcon className="text-3xl mr-2 text-red-500" /> :
                                        <BxCheckIcon className="text-3xl mr-2 text-green-500" />
                                    }

                                    <span className="text-lg font-medium text-gray-700">{e.job_step_name}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-400 mr-4 font-thin text-sm"> Running at {e.running_at}</span>
                                    <div className="font-medium  mr-4 text-gray-800">{e.elapsed_time}</div>
                                    <DownloadButton id={e.id}/>
                                </div>
                            </div>
                            <div className="bg-gray-800  rounded-b-md  py-3 px-2" style={{ fontFamily: "sans-serif" }}>
                                {e.JobRawsLog.map((ex: any) => {
                                    if (ex.Status == 8) {
                                        return <pre className="text-white text-base px-2 opacity-80 bg-red-500">

                                            [{new Date(ex.Timestamps).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}] <Ansi>{ex.RawLog}</Ansi>
                                        </pre>
                                    }
                                    return <pre className="text-white opacity-80 text-base px-2">
                                        [{new Date(ex.Timestamps).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}] <Ansi>{ex.RawLog}</Ansi>
                                    </pre>
                                })}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </Content >
    );
}

export default HomePage;
