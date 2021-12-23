import * as React from "react";
import BxSaveIcon from "components/atoms/icons/BxSaveIcon"

interface IPropsBtnCreate {
    text?: string;
    disabled?: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function BtnCreate(props: IPropsBtnCreate): JSX.Element {
    return (
        <button {...props} className="bg-red-500 text-white px-3 mx-1 py-1.5 font-medium text-base rounded-md border border-red-400 items-center  focus:outline-none focus:shadow-outline-white active:bg-red-600 transition duration-150 ease-in-out inline-flex">
            <BxSaveIcon className="text-white mx-1" /> { props.text || "Save"}
        </button>
    );
}

export default BtnCreate;