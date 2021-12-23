import Content from "../components/organism/Content"
import CardContent from "../components/organism/CardContent"
// import UsersAltIcon from "../components/atoms/icons/UsersAltIcon"
import BxTrashIcon from "../components/atoms/icons/BxTrashIcon"
import BxUserPlusIcon from "../components/atoms/icons/BxUserPlusIcon"
import BxArrowBackIcon from "../components/atoms/icons/BxArrowBackIcon"
import BxSearchIcon from "../components/atoms/icons/BxSearchIcon"
import {
    NavLink
} from "react-router-dom";


function PipelineUsersManage(): JSX.Element {
    return (
        <Content>
            <div className="mb-4 flex justify-between">
                <div>
                    <h1 className="text-2xl font-medium text-gray-700 focus:outline-none focus:shadow-outline-white">
                        Update Daily Revenue Daily Kabupaten
                    </h1>
                    <div className="flex items-center mt-1">
                        <div className="text-gray-400 font-thin text-base flex">
                            <div className="flex">
                                <span className="mr-2 font-medium focus:outline-none focus:shadow-outline-white">NRA Weekly report </span>
                            </div> - <span className="ml-2">Created at 2020 June 29 22:21 by Zerocoder  </span>
                        </div>
                        <label className="ml-2 text-white rounded-md bg-green-500 px-4 text-sm">Active</label>
                    </div>
                </div>
                <div>
                    <NavLink to="/pipelines/detail" className="px-4 py-1.5 font-medium  mx-1 rounded-md text-base bg-white text-blue-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">
                        <BxArrowBackIcon className="mr-2" />  Back
                    </NavLink>
                </div>
            </div>
            <CardContent>
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center font-medium text-gray-500"> <BxUserPlusIcon className="text-2xl mr-1" /> Add User's Access</div>
                    </div>

                    <input className="focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-1.5 px-3" type="text" placeholder="Search user to add" />
                </div>
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
                                <span className="text-md font-medium text-gray-500">Jhon X Doe</span>
                                <label className="text-sm block rounded text-gray-400 leading-none">jhonshine@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <div>
                                <select className="rounded px-3 text-sm text-gray-600 font-medium py-1 border bg-white focus:outline-none">
                                    <option>Owner</option>
                                    <option>Maintainer</option>
                                    <option selected>Read Only</option>
                                </select>
                            </div>
                            <button className="focus:outline-none mr-4 ml-4 bg-red-500 px-2 py-1  rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center border-t py-2">
                        <div className="flex items-center">
                            <img src="https://source.unsplash.com/random/68x68?japan" width="32" height="32" alt="https://source.unsplash.com/random/68x68?people,nature" className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy" title="Lorem" />
                            <div className="ml-4">
                                <span className="text-md font-medium text-gray-500">Wired Coder</span>
                                <label className="text-sm block rounded text-gray-400 leading-none">noncoder@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <div>
                                <select className="rounded px-3 text-sm text-gray-600 font-medium py-1 border bg-white focus:outline-none">
                                    <option>Owner</option>
                                    <option>Maintainer</option>
                                    <option selected>Read Only</option>
                                </select>
                            </div>
                            <button className="focus:outline-none mr-4 ml-4 bg-red-500 px-2 py-1  rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center border-t py-2">
                        <div className="flex items-center">
                            <img src="https://source.unsplash.com/random/68x68?jakarta" width="32" height="32" alt="https://source.unsplash.com/random/68x68?people,nature" className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy" title="Lorem" />
                            <div className="ml-4">
                                <span className="text-md font-medium text-gray-500">Life is simple</span>
                                <label className="text-sm block rounded text-gray-400 leading-none">simpleds@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <div>
                                <select className="rounded px-3 text-sm text-gray-600 font-medium py-1 border bg-white focus:outline-none">
                                    <option>Owner</option>
                                    <option selected>Maintainer</option>
                                    <option>Read Only</option>
                                </select>
                            </div>
                            <button className="focus:outline-none mr-4 ml-4 bg-red-500 px-2 py-1 rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center border-t py-2">
                        <div className="flex items-center">
                            <img src="https://source.unsplash.com/random/68x68?bogor" width="32" height="32" alt="https://source.unsplash.com/random/68x68?people,nature" className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy" title="Lorem" />
                            <div className="ml-4">
                                <span className="text-md font-medium text-gray-500">Niman</span>
                                <label className="text-sm block rounded text-gray-400 leading-none">nim4n136@gmail.com</label>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <div>
                                <select disabled className="rounded px-3 text-sm text-gray-600 font-medium py-1 border bg-white focus:outline-none">
                                    <option selected>Owner</option>
                                    <option>Maintainer</option>
                                    <option>Read Only</option>
                                </select>
                            </div>
                            <button className="focus:outline-none mr-4 ml-4 bg-red-500 px-2 py-1  rounded-md">
                                <BxTrashIcon className="text-xl text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Content>
    );
}

export default PipelineUsersManage;
