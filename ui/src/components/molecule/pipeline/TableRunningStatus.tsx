import BxXIcon from "components/atoms/icons/BxXIcon"
import BxCheckIcon from "components/atoms/icons/BxCheckIcon"

interface iProps {
    status_code: number
}

export default function RunningStatus(props: iProps): JSX.Element {
    const SUCCESS_CODE = 1
    const ERROR_CODE = 8
    switch (props.status_code) {
        case SUCCESS_CODE:
            return (<div className="text-green-600 flex flex-wrap items-center"><BxCheckIcon className="text-xl mr-1" /> <span>Success</span> </div>);
        case ERROR_CODE:
            return (<div className="text-red-500 flex flex-wrap items-center"><BxXIcon className="text-xl mr-1" /> <span>Error</span> </div>);
        default:
            return <div className=" flex flex-wrap items-center">-</div>
    }

}
