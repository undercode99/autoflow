import Content from "../components/organism/Content"
import PageTitle from "../components/organism/PageTitle"
import BtnCreate from "../components/atoms/buttons/BtnCreate"
import TerminalFillIcon from "../components/atoms/icons/TerminalFillIcon"
import ExternalLinkIcon from "../components/atoms/icons/ExternalLinkIcon"
import BxCogIcon from "../components/atoms/icons/BxCogIcon"
import PostgresqlIcon from "../components/atoms/icons/PostgresqlIcon"
import BxlTelegramIcon from "../components/atoms/icons/BxlTelegramIcon"
import { useEffect, useState } from "react"
import { pipelineServices } from "services"
import {
    NavLink
} from "react-router-dom";


function EnvironmentsPage(): JSX.Element {

    const [list_envs, setListEnvs] = useState([])

    useEffect(() => {
        pipelineServices.fetchEnvs().then(success => {
            setListEnvs(success.data)
        })
    }, [])

    return (
        <Content>
            <div className="flex justify-between flex-wrap items-center">
                <PageTitle title="Environments" subtitle="List environments for pipelines" />

                <NavLink to={'environments/create'} onClick={() => console.log("Hellow")}>
                    <BtnCreate onClick={() => {}}/>
                </NavLink>
            </div>
            <div className="my-6">
                <div className="flex flex-row flex-wrap">

                    {list_envs.map((env: any) => {
                        let envs: JSX.Element = <div className="md:w-1/2 lg:w-1/3 w-full flex ">
                            <div className="w-full">
                                <div className="px-4 py-3 flex items-center border rounded-md mr-4 my-2 flex-row">
                                    <div className="lg:w-1/6 md:w-1/4 sm:w-1/3 w-1/3">
                                        <div className="p-4 py-4 flex justify-center mr-2 rounded-full bg-gray-100">
                                            <TerminalFillIcon className="text-4xl" />
                                        </div>
                                    </div>
                                    <div className="w-full pl-4">
                                        <div className="flex w-full justify-between items-center">
                                            <div className="items-center text-lg font-medium text-gray-700 flex">
                                                {env.Name}
                                            </div>
                                            <NavLink to={`/environments/edit/${env.ID}`}>
                                                <BxCogIcon className="text-xl text-gray-400 hover:text-gray-800" />
                                            </NavLink>
                                        </div>
                                        <span className="text-sm text-gray-400 flex items-center">Type {env.Type}</span>
                                        {/* <button className="px-3 flex items-center border border-gray-300 text-gray-600 rounded-lg mt-3 py-1 text-sm hover:bg-gray-50">
                                            Open Shell  <ExternalLinkIcon className="ml-2" />
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        if (env.Type == "POSTGRES") {
                            envs = <div className="md:w-1/2 lg:w-1/3 w-full flex ">
                                <div className="w-full">
                                    <div className="px-4 py-3 flex items-center border rounded-md mr-4 my-2 flex-row">
                                        <div className="lg:w-1/6 md:w-1/4 sm:w-1/3 w-1/3">
                                            <div className="p-4 py-4 flex justify-center mr-2 rounded-full bg-gray-100">
                                                <PostgresqlIcon className="text-4xl" />
                                            </div>
                                        </div>
                                        <div className="w-full pl-4">
                                            <div className="flex w-full justify-between items-center">
                                                <div className="items-center text-lg font-medium text-gray-700 flex">
                                                    {env.name}
                                                </div>
                                                <NavLink to={`/environments/edit/${env.ID}`}>
                                                    <BxCogIcon className="text-xl text-gray-400 hover:text-gray-800" />
                                                </NavLink>
                                            </div>
                                            <span className="text-sm text-gray-400 flex items-center">Type {env.type}</span>
                                            <button className="px-3 flex items-center border border-gray-300 text-gray-600 rounded-lg mt-3 py-1 text-sm hover:bg-gray-50">
                                                Test Connection
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } else if (env.Type == "notification/telegram") {
                            envs = <div className="md:w-1/2 lg:w-1/3 w-full flex ">
                                <div className="w-full">
                                    <div className="px-4 py-3 flex items-center border rounded-md mr-4 my-2 flex-row">
                                        <div className="lg:w-1/6 md:w-1/4 sm:w-1/3 w-1/3">
                                            <div className="p-4 py-4 flex justify-center mr-2 rounded-full bg-gray-100">
                                                <BxlTelegramIcon className="text-4xl" />
                                            </div>
                                        </div>
                                        <div className="w-full pl-4">
                                            <div className="flex w-full justify-between items-center">
                                                <div className="items-center text-lg font-medium text-gray-700 flex">
                                                    {env.Name}
                                                </div>
                                                <NavLink to={`/environments/edit/${env.ID}`}>
                                                    <BxCogIcon className="text-xl text-gray-400 hover:text-gray-800" />
                                                </NavLink>
                                            </div>
                                            <span className="text-sm text-gray-400 flex items-center">Type {env.Type}</span>
                                            {/* <button className="px-3 flex items-center border border-gray-300 text-gray-600 rounded-lg mt-3 py-1 text-sm hover:bg-gray-50">
                                                Test Send Message
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        return <>{envs}</>

                    })
                    }
                </div>
            </div>
        </Content>
    );
}

export default EnvironmentsPage;

