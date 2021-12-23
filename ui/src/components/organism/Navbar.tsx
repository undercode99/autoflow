import React from "react";
import {
  NavLink
} from "react-router-dom";

import BxLayerIcon from "components/atoms/icons/BxLayerIcon";
import BxShareAltIcon from "components/atoms/icons/BxShareAltIcon";
import BxCogIcon from "components/atoms/icons/BxCogIcon";
import BxHomeAltIcon from "components/atoms/icons/BxHomeAltIcon";
import UsersAltIcon from "components/atoms/icons/UsersAltIcon";


function Navbar(): JSX.Element {
  return (
    <div className="w-16">
      <div className="nav flex fixed py-6 px- shadow flex-col h-full justify-between w-16" style={{ background: "#e5131d" }}>
        <div className="flex flex-auto items-center flex-col ">
          <span className="text-xl text-white px-2 pb-8 font-extrabold cursor-pointer">Log</span>
          <ul className="flex items-center flex-col">
            <li>
              <a href="http://10.54.68.188:8008/rantools" title="Create New" className="opacity-80 text-white hover:bg-red-500 rounded-lg p-2 cursor-pointer block mb-3" >
                <BxHomeAltIcon className="text-2xl" />
              </a>
            </li>
            <li>
              <NavLink to="/pipelines" title="Pipelines" className="opacity-80 text-white hover:bg-red-400 rounded-lg p-2 cursor-pointer block mb-3" activeClassName="opacity-1 text-white bg-red-400  shadow-sm">
                <BxShareAltIcon className="text-2xl" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/environments" title="Environments" className="opacity-80 text-gray-100 hover:bg-red-400 rounded-lg p-2 cursor-pointer block mb-3" activeClassName="opacity-1 text-white bg-red-400  shadow-sm">
                <BxLayerIcon className="text-2xl" />
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <div className="my-2 cursor-pointer">
            {/* <img src="https://source.unsplash.com/random/68x68?bogor" className="rounded-full w-8 h-8" alt="" /> */}
          </div>
          <ul>
            <li className="text-white hover:bg-red-400 p-2 cursor-pointer rounded-full">
              <a href="http://10.54.68.188:8008/rantools/users" ><BxCogIcon className="text-xl" /></a>  
            </li>
          </ul>
        </div>
      </div >
    </div>
  );
}

export default Navbar;
