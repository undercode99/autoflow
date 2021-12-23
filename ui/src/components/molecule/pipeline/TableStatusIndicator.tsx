
interface PropsInterface {
    key_indicator: number
}

export default function StatusIndicator(props: PropsInterface): JSX.Element {
    const pipeline_code_status = [
        {
            key: 4,
            label: "IDLE",
            style_class: "bg-gray-100 text-gray-500",
            style_class_bullet: "bg-gray-500"
        },
        {
            key: 2,
            label: "RUNNING",
            style_class: "bg-green-100 text-green-500",
            style_class_bullet: "bg-green-500",
        }
    ]
    
    let status_active = pipeline_code_status.find(item => item.key === props.key_indicator);

    return <button className={`px-4  focus:outline-none focus:shadow-outline-white  disable items-center flex py-2 text-xs rounded-full font-semibold cursor-default ${status_active?.style_class}`}>
        <span className={`w-3 h-3 inline-block rounded-full mr-1 ${status_active?.style_class_bullet}`}></span>
        <span>{status_active?.label}</span>
    </button>;
}
