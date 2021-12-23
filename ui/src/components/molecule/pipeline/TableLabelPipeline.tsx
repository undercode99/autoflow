import BxShareAltIcon from "components/atoms/icons/BxShareAltIcon"

interface iLabelPipeline {
    category: string,
    title: string,
    status_pipeline: number
}

export default function LabelPipeline(props: iLabelPipeline): JSX.Element {
    console.log(props.status_pipeline)
    const pipeline_code_status = [
        {
            key: 8,
            label: "ERROR",
            style_class: "bg-red-200 text-red-600"
        },

        {
            key: 1,
            label: "SUCCESS",
            style_class: "bg-green-200 text-green-600"
        },
        {
            key: 3,
            label: "Not Yet",
            style_class: "bg-gray-200 text-gray-600"
        }
    ]
    let status_active = pipeline_code_status.find(item => item.key === props.status_pipeline);

    return (<>
        <span className={`opacity-80 rounded-full p-3 ${status_active?.style_class}`}>
            <BxShareAltIcon className="text-3xl" />
        </span>
        <div className="px-4 w-9/12">
            <p className="font-medium text-xl overflow-hidden overflow-ellipsis whitespace-nowrap">{props.title} </p>
            <span className="text-sm font-normal text-gray-500">{props.category}</span>
        </div></>)
}