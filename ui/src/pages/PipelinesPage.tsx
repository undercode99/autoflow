import PageTitle from "../components/organism/PageTitle"
import Content from "../components/organism/Content"
import BtnExport from "../components/atoms/buttons/BtnExport"
import BtnCreate from "../components/atoms/buttons/BtnCreate"

import TableStatusIndicator from "../components/molecule/pipeline/TableStatusIndicator"
import TableRunningStatus from "../components/molecule/pipeline/TableRunningStatus"
import TableLabelPipeline from "../components/molecule/pipeline/TableLabelPipeline"
import FilterStatusIndicator from "../components/molecule/pipeline/FilterStatusIndicator"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// action
import { pipelineAction } from "../actions"

import { pipelineServices } from "../services"

import { useEffect, useState } from "react"
import {
    NavLink
} from "react-router-dom";




interface Props {
    children: React.ReactNode;
    open: boolean;
}
interface InputFlash {
    title: string,
    category: string
}

function Dialog(props: Props) {
    const { open } = props;
    if (!open) {
        return <></>;
    }
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light ">
            <div className="relative p-6 bg-white w-full max-w-md mx-auto mt-14 flex-col border shadow-lg flex rounded-lg">
                <div>{props.children}</div>
            </div>
        </div>
    );
}



function PipelinesPage(): JSX.Element {

    const [pipelines, setPipelines] = useState([])

    const [paginate, setPaginate] = useState<any>({})

    const [active_pipeline, setActivePipeline] = useState(-1)

    const [status_pipeline, setStatusPipeline] = useState("all")

    const [search, setSearch] = useState("")

    const [open, setOpen] = useState(false)

    const [sortBy,] = useState("updated_at desc")

    const handleClick = () => setOpen(true)

    const showIndicatorPipeline = (key_pipeline: number) => {
        if (key_pipeline == 8) {
            setStatusPipeline("error")
            fetchPipeline(1, search, "error")
        } else if (key_pipeline == 1) {
            setStatusPipeline("success")
            fetchPipeline(1, search, "success")
        } else {
            fetchPipeline(1, search)
        }
        setActivePipeline(key_pipeline)
    }


    const dispatch = useDispatch()

    const history = useHistory()

    const [input, setInputs] = useState<InputFlash>({
        title: "",
        category: ""
    })

    const { title, category } = input

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const saveFlash = (e: any) => {
        e.preventDefault();
        dispatch(pipelineAction.create_flash(title, category))
        history.push("/pipelines/detail")
    }

    const fetchPipeline = (num_page: number = 1, xsearch: string = search, status_pipeline: string = "all") => {
        pipelineServices.fetchAllJob(num_page, 8, sortBy, xsearch, status_pipeline,).then(success => {
            setPipelines(success.jobs)
            setPaginate(success.paginate)
        })
    }

    const onSearch = (value: any) => {
        setSearch(value);
        fetchPipeline(1, value)
    }

    const DetailCount = () => {
        let to = paginate.page * paginate.limit
        let to_show = to > paginate.count ? paginate.count : to
        let from = to_show == 0 ? 0 : (paginate.offset + 1)
        return <>
            Showing {from} to {to_show} of {paginate.count} results
        </>
    }

    useEffect(() => {
        fetchPipeline()
    }, [])

    function dateParse(dt: any) {
        return new Date(dt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
    }

    return (
        <>
            <Dialog open={open} >
                <form onSubmit={saveFlash}>
                    <div className="text-lg mb-2">
                        Create new job
                    </div>
                    <div className="mb-4">
                        <input value={title} name="title" onChange={handleChange} required className="focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Name" />
                    </div>
                    <div className="mb-4">
                        <input value={category} name="category" onChange={handleChange} required className="focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Category" />
                    </div>
                    <div className="mt-4" >
                        <button type="submit" className="bg-red-500 text-white px-3 py-1.5 font-medium text-base rounded-md border border-gray-200 items-center  focus:outline-none focus:shadow-outline-white active:bg-red-600 transition duration-150 ease-in-out inline-flex">Create</button>
                        <button onClick={() => setOpen(false)} className="px-4 py-1.5 font-medium  border border-gray-400  mx-1 rounded-md text-base bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">Close</button>
                    </div>
                </form>
            </Dialog>
            <Content className={open ? "opacity-20" : "opacity-1"}>
                <div className="flex justify-between flex-wrap items-center">
                    <PageTitle title="List Pipelines" subtitle="Scheduler and automation job pipelines" />
                    <div className="flex flex-wrap">
                        <BtnCreate onClick={handleClick} />
                    </div>
                </div>
                <div className="mb-4 mt-6 flex flex-wrap items-center">
                    <div className="w-1/5">
                        <input value={search} onInput={(e: any) => onSearch(e.target.value)} className="focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Search" />
                    </div>
                    <FilterStatusIndicator activate_pipeline={active_pipeline} setActive={showIndicatorPipeline} />
                </div>
                <div className="w-full mb-4">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="w-1/2 opacity-40 font-semibold">Name</div>
                        <div className="w-1/5 opacity-40 font-semibold">Last Running</div>
                        {/* <div className="w-1/6 opacity-40 font-semibold">User's Access</div> */}
                        <div className="w-1/6 opacity-40 font-semibold">Status</div>
                    </div>
                    <div className=" rounded-lg mt-4 border">
                        {
                            pipelines.map((el: any, key) => {
                                return (
                                    <NavLink to={`/pipelines/detail/${el.ID}`} key={key} className="flex  justify-between flex-wrap items-center border-b flex-between   p-3">
                                        <div className="w-1/2 flex flex-wrap items-center">
                                            <TableLabelPipeline title={el.Name} category={el.Category} status_pipeline={el.StatusLastRunning} />
                                        </div>
                                        <div className="w-1/5">
                                            <TableRunningStatus status_code={el.StatusLastRunning} />
                                            {el.StatusLastRunning != 3 && <span className="text-gray-500 text-sm px-1 "> {dateParse(el.LastRunning.Time)}</span>}

                                        </div>
                                        <div className="w-1/6">
                                            <TableStatusIndicator key_indicator={el.StatusRunning} />
                                        </div>
                                    </NavLink>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-row justify-between mb-12 items-center">
                    <div className="text-gray-700">
                        <DetailCount />
                    </div>
                    <div>
                        {paginate.has_prev && <button className="border focus:outline-none mr-2 border-gray-300 px-4 py-1.5 rounded-lg" onClick={() => { fetchPipeline(paginate.prev_page) }}>Previous</button>}
                        {paginate.has_next && <button className="border  focus:outline-none border-gray-300 px-4 py-1.5 rounded-lg" onClick={() => { fetchPipeline(paginate.next_page) }}>Next</button>}
                    </div>
                </div>
            </Content >
        </>
    );
}

export default PipelinesPage;