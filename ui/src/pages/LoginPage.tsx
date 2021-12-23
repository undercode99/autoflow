import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import BxUserIcon from "../components/atoms/icons/BxUserIcon"
import CardContent from "../components/organism/CardContent"
import { useHistory, useLocation } from 'react-router-dom';
import { userActions } from "../actions"
import { LocationState, InputStateLogin, StoreState } from "../types"
import { userConstants } from "../constants"

import { userService } from '../services';

interface StatusState {
    is_error: boolean,
    message: string,
    show_status: boolean,
}

function LoginPage(): JSX.Element {

    const [inputs, setInputs] = useState<InputStateLogin>({
        username: "",
        password: "",
    })

    const location = useLocation<LocationState>()

    let status = useSelector<StoreState.All, StoreState.Auth>(state => state.auth);
    const dispatch = useDispatch();
    const history = useHistory()

    const { username, password } = inputs


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        if (username && password) {
            dispatch(userActions.login(username, password, location.state || { state: { pathname: "/" } }))
            userService.getPath("/test_jwt_works")
        }
    }
    useEffect(() => {
        if (status.loggedIn == true) {
            history.push("/pipelines")
        }
    }, [])

    return (
        <div className="flex w-full h-full " >
            <div className="mt-36 mx-auto lg:w-1/4 sm:w-1/2">
                <CardContent className="w-full p-10 rounded-lg">
                    <div className="mb-2">
                        <h1 className="text-4xl text-gray-600 text-center font-medium ">Kyaa Flow</h1>
                        <h2 className="text-center text-lg mt-2 text-gray-400 font-thin">Login </h2>
                    </div>
                    {
                        status.loggedIn && <div className={`px-3 font-medium py-1  rounded text-white bg-green-500 mb-4`}>Login success</div>
                    }
                    {status.error && <div className={`px-3 font-medium py-1  rounded text-white bg-red-500 mb-4`}> {status.error} </div>
                    }
                    <form onSubmit={handleSubmit} name="submit">
                        <div className="mb-4">
                            <input required onChange={handleChange} value={username} name="username" className="focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-2 px-4" type="text" placeholder="Username" />
                        </div>
                        <div>
                            <input required onChange={handleChange} value={password} name="password" className="focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-base placeholder-gray-400 border border-gray-300 rounded-md py-2 px-4" type="password" placeholder="Password" />
                        </div>
                        <div className="mt-4">
                            {
                                status.requestLoggedIn ?
                                    <button type="submit" disabled className="bg-blue-600 opacity-70 cursor-not-allowed text-white px-4 py-1.5 font-medium text-base rounded-md border border-gray-200 items-center  focus:outline-none focus:shadow-outline-white active:bg-blue-900 transition duration-150 ease-in-out inline-flex">
                                        Loading ...
                                    </button>
                                    :
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 font-medium text-base rounded-md border border-gray-200 items-center  focus:outline-none focus:shadow-outline-white active:bg-blue-900 transition duration-150 ease-in-out inline-flex">
                                        <BxUserIcon className="mr-1" /> Login
                                    </button>
                            }
                        </div>
                    </form>
                </CardContent>
            </div>
        </div>
    );
}

export default LoginPage;
