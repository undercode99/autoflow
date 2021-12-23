import * as React from "react";
import BxPlusIcon from "components/atoms/icons/BxPlusIcon"

interface IPropsBtnCreate {
    text?: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function BtnCreate(props: IPropsBtnCreate): JSX.Element {
    return (
        <button onClick={props.onClick} className="text-white bg-red-500 px-3 mx-1 py-1.5 font-medium text-base rounded-md border border-red-200  items-center  focus:outline-none focus:shadow-outline-white active:bg-red-500 transition duration-150 ease-in-out inline-flex">
            <BxPlusIcon className="text-white mx-1" /> { props.text || "Let's Create"}
        </button>
    );
}

export default BtnCreate;