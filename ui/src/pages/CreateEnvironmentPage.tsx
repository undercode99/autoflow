import Content from "../components/organism/Content"
import PageTitle from "../components/organism/PageTitle"
import { useHistory } from 'react-router-dom';
import { useState } from "react"
import { pipelineServices } from "services"
import {
    NavLink
} from "react-router-dom";


function CreateEnvironmentsPage(): JSX.Element {


    const history = useHistory()

    const [inputs, setInputs] = useState<any>({
        name: "",
        label: "",
        type: "",
        options: "",
    })

    const ssh_template = `{
        "host" : "localhost",
        "username": "xxx",
        "password": "7ady8as9e2",
        "port": "22"
}`
    const notify_template = `{
        "token": "xxxxxx",
        "telegram_ids": [1578510992]
}`

    const onCreateHandler = (e: any) => {
        e.preventDefault();
        pipelineServices.createNewEnvs(
            inputs.name,
            inputs.type,
            inputs.label,
            inputs.options
        ).then(success => {
            alert("Environments created successful !!")
            history.push("/environments")
        }, error => {
            console.log(error)
            alert(error)
        });
    }


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setInputs((inputs: any) => ({ ...inputs, [name]: value }));
    }

    const handleChangeType = (e: any) => {
        const { value } = e.target;
        if (value === "ssh") {
            setInputs((inputs: any) => ({ ...inputs, options: ssh_template }));
        } else if (value === "notification/telegram") {
            setInputs((inputs: any) => ({ ...inputs, options: notify_template }));
        }
        handleChange(e)
    }
    return (
        <Content>
            <div className="flex justify-between flex-wrap items-center">
                <PageTitle title="New Environment" subtitle="Create New Environments for job pipelines" />
            </div>
            <div className="my-6">
                <form onSubmit={onCreateHandler}>
                    <div className="flex flex-row flex-wrap w-2/3">

                        <div className="my-2 w-full">
                            <span className="font-medium text-gray-600 mb-2">Label </span>
                            <input onChange={handleChange} value={inputs.label} name="label" className="focus:border-blue-400 focus:ring-2 my-1 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Label" />
                        </div>
                        <div className="my-2 w-1/2">
                            <div className="mr-4">
                                <span className="font-medium text-gray-600 mb-2">Name (unique) </span><span className=" text-red-500">*</span>
                                <input onChange={handleChange} value={inputs.name} name="name" required className="focus:border-blue-400 focus:ring-2 my-1 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Name Environment" />
                            </div>
                        </div>

                        <div className="my-2 w-1/2">
                            <span className="font-medium text-gray-600 mb-2">Type </span><span className=" text-red-500">*</span>
                            <select onChange={handleChangeType} value={inputs.type} required name="type" className="focus:border-blue-400 bg-white focus:ring-2 my-1 focus:ring-blue-200 focus:outline-none w-full text-base border rounded-md py-1.5 px-3" placeholder="Name Environment">
                                <option value="" disabled>- Select type -</option>
                                <option value="ssh">SSH</option>
                                <option value="notification/telegram">Telegram</option>
                            </select>
                        </div>
                        <div className="w-full my-4" >
                            <span className="font-medium text-gray-600 mb-2">Configuration (json) </span><span className=" text-red-500">*</span>
                            <textarea value={inputs.options} onChange={handleChange} name="options" style={{ height: "300px" }} required className="focus:border-blue-400 focus:ring-2 my-1 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" ></textarea>
                        </div>
                    </div>
                    <div className="w-full mt-4 flex">
                        <button type="submit" className="text-white mr-4 bg-red-500 px-3 mx-1 py-1.5 font-medium text-base rounded-md  items-center  focus:outline-none focus:shadow-outline-white active:bg-red-500 border-red-500 border transition duration-150 ease-in-out inline-flex">Save</button>
                        <NavLink to="/environments" className="px-4 py-1.5 font-medium  border border-gray-400  mx-1 rounded-md text-base bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">Cancel</NavLink>
                    </div>
                </form>
            </div>
        </Content>
    );
}

export default CreateEnvironmentsPage;

