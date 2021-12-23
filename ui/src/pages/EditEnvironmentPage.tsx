import Content from "../components/organism/Content"
import PageTitle from "../components/organism/PageTitle"
import BxTrashIcon from "../components/atoms/icons/BxTrashIcon"

import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { pipelineServices } from "services"
import {
    NavLink
} from "react-router-dom";




function Dialog(props: any) {
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

function EditEnvironmentsPage(): JSX.Element {


    const history = useHistory()

    const [inputs, setInputs] = useState<any>({
        name: "",
        label: "",
        type: "",
        options: "",
    })
    let [show_confirm, set_show_confirm] = useState(0)

    const { id } = useParams<any>()

    const onUpdateHandler = (e: any) => {
        e.preventDefault();
        pipelineServices.updateEnvs(
            id,
            inputs.label,
            inputs.options
        ).then(success => {
            alert("Environments updated successful !!")
            history.push("/environments")
        }, error => {
            console.log(error)
            alert(error)
        });
    }



    const handleDelete = () => {
        pipelineServices.deleteEnvById(id)
            .then(success => {
                alert("Environments deleted successful !!")
                history.push("/environments")
            }, error => {
                console.log(error)
                alert("Delete environment failed,  environment has used by job pipeline ")
                set_show_confirm(0)
            })
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setInputs((inputs: any) => ({ ...inputs, [name]: value }));
    }

    useEffect(() => {
        pipelineServices.fetchEnvById(id).then(success => {
            const { data } = success
            try {
                setInputs((inputs: any) => ({ ...inputs, label: data.Label }));
                setInputs((inputs: any) => ({ ...inputs, name: data.Name }));
                setInputs((inputs: any) => ({ ...inputs, options: data.Options }));
                setInputs((inputs: any) => ({ ...inputs, type: data.Type }));
            } catch (error) {
                alert(error)
            }
        })
    }, [])

    return (
        <>
            <Dialog open={show_confirm} >
                <div className="text-lg mb-2">
                    Delete Environment, Are you sure?
                </div>
                <div className="mt-4" >
                    <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1.5 font-medium text-base rounded-md border border-gray-200 flex items-center  focus:outline-none focus:shadow-outline-white active:bg-red-900 transition duration-150 ease-in-out inline-flex">Delete</button>
                    <button onClick={() => set_show_confirm(0)} className="px-4 py-1.5 font-medium  border border-gray-400  mx-1 rounded-md text-base bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">Close</button>
                </div>
            </Dialog>
            <Content className={show_confirm ? "opacity-20" : "opacity-1"}>
                <div className="flex justify-between flex-wrap items-center">
                    <PageTitle title="Edit Environment" subtitle="Edit Environments for job pipelines" />
                    <button onClick={() => set_show_confirm(1)} className="text-2xl mx-4 text-red-400 focus:outline-none hover:text-red-500"><BxTrashIcon /></button>
                </div>
                <div className="my-6">
                    <form onSubmit={onUpdateHandler}>
                        <div className="flex flex-row flex-wrap w-full">

                            <div className="my-2 w-full">
                                <span className="font-medium text-gray-600 mb-2">Label </span>
                                <input onChange={handleChange} value={inputs.label} name="label" className="focus:border-blue-400 focus:ring-2 my-1 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Label" />
                            </div>
                            <div className="my-2 w-1/2">
                                <div className="mr-4">
                                    <span className="font-medium text-gray-600 mb-2">Name (unique) </span><span className=" text-red-500">*</span>
                                    <input disabled value={inputs.name} name="name" required className="focus:border-blue-400 focus:ring-2 my-1 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Name Environment" />
                                </div>
                            </div>

                            <div className="my-2 w-1/2">
                                <span className="font-medium text-gray-600 mb-2">Type </span><span className=" text-red-500">*</span>
                                <select disabled value={inputs.type} required name="type" className=" focus:border-blue-400 bg-gray-100 focus:ring-2 my-1 focus:ring-blue-200 focus:outline-none w-full text-base border rounded-md py-1.5 px-3" placeholder="Name Environment">
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
                            <button type="submit" className="text-white mr-4 bg-red-500 px-3 mx-1 py-1.5 font-medium text-base rounded-md  items-center  focus:outline-none focus:shadow-outline-white active:bg-red-500 border-red-500 border transition duration-150 ease-in-out inline-flex">Update</button>
                            <NavLink to="/environments" className="px-4 py-1.5 font-medium  border border-gray-400  mx-1 rounded-md text-base bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">Cancel</NavLink>
                        </div>
                    </form>
                </div>
            </Content>
        </>
    );
}

export default EditEnvironmentsPage;

