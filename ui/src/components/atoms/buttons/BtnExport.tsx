import BxExportIcon from "components/atoms/icons/BxExportIcon"

interface IPropsBtnCreate {
  text?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function BtnExport(props: IPropsBtnCreate): JSX.Element {
  return (
    <button onClick={props.onClick} className="px-4 py-1.5 font-medium  border border-gray-400  mx-1 rounded-md text-base bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:shadow-outline-white active:bg-white transition duration-150 ease-in-out inline-flex items-center">
      <BxExportIcon className=" mx-1" /> { props.text || "Export"}
    </button>
  );
}

export default BtnExport;