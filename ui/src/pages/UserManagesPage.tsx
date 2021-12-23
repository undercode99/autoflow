import Content from "../components/organism/Content"
import CardContent from "../components/organism/CardContent"
import BxTrashIcon from "../components/atoms/icons/BxTrashIcon"
import EditIcon from "../components/atoms/icons/EditIcon"
import UsersAltIcon from "../components/atoms/icons/UsersAltIcon"
import BxSearchIcon from "../components/atoms/icons/BxSearchIcon"
import BtnCreate from "../components/atoms/buttons/BtnCreate"
import { useHistory } from "react-router-dom"
import {history} from "../helpers"
// import {
//     NavLink
// } from "react-router-dom";


function UserManages(): JSX.Element {
    // let history = useHistory()
    return (
        <Content>
            <div className="mb-4 flex justify-between">
                <div>
                    <h1 className="text-2xl font-medium text-gray-700 flex items-center"><UsersAltIcon className="mr-2" /> Manage Users</h1>
                    <span className="text-gray-400 font-thin text-base">List users has registered</span>
                </div>
                <div>
                    <BtnCreate onClick={() => {history.push({pathname: "/"}) }} text="Create User" />
                </div>
            </div>
            <CardContent>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center pb-2">
                        <div className="text-center font-medium text-gray-400 flex items-center">
                            <BxSearchIcon className="text-lg -mr-6 z-30" /> <input className="focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400  border-gray-300 rounded-md py-1 px-3 pl-7" type="text" placeholder="Search users" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center border-t py-2">
                        <div className="flex items-center">
                            <img src="https://source.unsplash.com/random/68x68?people,nature" width="32" height="32" alt="https://source.unsplash.com/random/68x68?people,nature" className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy" title="Lorem" />
                            <div className="ml-4">
                                <span className="text-md font-medium text-gray-500">Jhon X Doe </span>
                                <label className="text-sm block rounded text-gray-400 ">jhonshine@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <button className="focus:outline-none mr-4 px-2 py-1  rounded-md">
                                <EditIcon className="text-xl text-gray-400" />
                            </button>
                            <button className="focus:outline-none mr-4 bg-red-500 px-2 py-1  rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center border-t py-2">
                        <div className="flex items-center">
                            <img src="https://source.unsplash.com/random/68x68?japan" width="32" height="32" alt="https://source.unsplash.com/random/68x68?people,nature" className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy" title="Lorem" />
                            <div className="ml-4">
                                <span className="text-md font-medium text-gray-500">Wired Coder</span>
                                <label className="text-sm block rounded text-gray-400  ">noncoder@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <button className="focus:outline-none mr-4 px-2 py-1  rounded-md">
                                <EditIcon className="text-xl text-gray-400" />
                            </button>
                            <button className="focus:outline-none mr-4 bg-red-500 px-2 py-1  rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center border-t py-2">
                        <div className="flex items-center">
                            <img src="https://source.unsplash.com/random/68x68?jakarta" width="32" height="32" alt="https://source.unsplash.com/random/68x68?people,nature" className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy" title="Lorem" />
                            <div className="ml-4">
                                <span className="text-md font-medium text-gray-500">Life is simple</span>
                                <label className="text-sm block rounded text-gray-400  ">simpleds@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <button className="focus:outline-none mr-4 px-2 py-1  rounded-md">
                                <EditIcon className="text-xl text-gray-400" />
                            </button>
                            <button className="focus:outline-none mr-4 bg-red-500 px-2 py-1  rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center border-t py-2">
                        <div className="flex items-center">
                            <img src="https://source.unsplash.com/random/68x68?bogor" width="32" height="32" alt="https://source.unsplash.com/random/68x68?people,nature" className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy" title="Lorem" />
                            <div className="ml-4">
                                <span className="text-md font-medium text-gray-500">Niman <label className="text-xs rounded-lg font-normal px-2 py-0.5 bg-green-500 text-white ">Super User</label></span>
                                <label className="text-sm block rounded text-gray-400  ">nim4n136@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <button className="focus:outline-none mr-4 px-2 py-1  rounded-md">
                                <EditIcon className="text-xl text-gray-400" />
                            </button>
                            <button className="focus:outline-none mr-4 bg-red-500 px-2 py-1  rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Content>
    );
}

export default UserManages;
