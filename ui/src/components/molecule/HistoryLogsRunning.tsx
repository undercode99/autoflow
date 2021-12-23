import BxHistoryIcon from "../atoms/icons/BxHistoryIcon"
import Time4Icon from "../atoms/icons/Time4Icon"
import BxXIcon from "../atoms/icons/BxXIcon"
import BxCheckIcon from "../atoms/icons/BxCheckIcon"
import CloseCircleIcon from '../atoms/icons/CloseCircleIcon'

import {
    NavLink
} from "react-router-dom";
import { useEffect, useState } from "react"
import { pipelineServices } from "services"

interface Props {
    id?: number
}

function HistoryLogsRunning({ id }: Props): JSX.Element {

    let [logs, setLogs] = useState([])

    let [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const intervalId = setInterval(() => {
            pipelineServices.fetchRunningLogs(id).then(success => {
                setLogs(sortByKey(success.logs_running, "Sort"))
                setLoading(false)
            })
        }, 500)
        return () => clearInterval(intervalId); //This is important
    }, [])

    function sortByKey(array: any, key: any) {
        return array.sort(function (a: any, b: any) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    const icons = (status: any) => {
        if (status == 8) {
            return <CloseCircleIcon className="mr-3 text-5xl text-red-600" />
        } else if (status == 1) {
            return <BxCheckIcon className="mr-3 text-5xl text-green-600" />
        } else if (status == 2) {
            return <Time4Icon className="mr-3 text-5xl text-gray-600" />
        }
    }

    if (loading) return <>Loading</>
    return (
        <div className="mb-20">
            <h1 className="text-md font-normal text-gray-500 flex items-center">
                <BxHistoryIcon className="text-2xl mr-2 " /> Logs History Job Running
            </h1>
            {logs.length == 0 && <h1 className="text-xl my-8 text-center font-bold text-gray-400">Data History Logs Empty </h1> }
            <div className="mt-4">
                {logs.map((e: any) => {
                    return <NavLink to={`/pipelines/detail/logs/${id}/raw/${e.running_id}`} className="py-3 my-4 px-4 flex border rounded-md  items-center justify-between">
                        <div>
                            <div className="text-lg font-medium text-gray-800 flex items-center">
                                {icons(e.status)}
                                <div>
                                    <div>
                                        <span className="text-xs text-gray-400 p-0">Running at</span>
                                        {/* <span className="text-xs rounded bg-green-500 px-2 mx-2 text-white">Running</span> */}
                                    </div>
                                    <span className="text-lg">{e.running_at}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs block text-right text-gray-400 p-0">Elapsed time</span>
                            <p className="text-lg text-right">{e.elapsed_time}</p>
                        </div>
                    </NavLink>
                })}
            </div>
        </div>
    );
}

export default HistoryLogsRunning;
