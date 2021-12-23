
interface PropsInterface {
    activate_pipeline: number,
    setActive: Function
}

export default function FilterStatusIndicator(props: PropsInterface): JSX.Element {
    const status_indicator = [
        {
            key: -1,
            label: "ALL",
            style_class: "border-gray-200 focus:border-gray-400 focus:shadow-outline-gray  ",
            style_active_class: "border-gray-600 border-gray-400  opacity-100",
            style_class_bullet: ""
        },
        {
            key: 8,
            label: "ERROR",
            style_class: "text-red-500 bg-red-100 focus:border-red-400 focus:shadow-outline-gray  ",
            style_active_class: "border-red-600 opacity-100",
            style_class_bullet: "bg-red-500"
        },
        {
            key: 1,
            label: "SUCCESS",
            style_class: "text-green-500 bg-green-100 focus:border-green-400 ",
            style_active_class: "border-green-500 opacity-100",
            style_class_bullet: "bg-green-500"
        }
    ]
    return <div className="flex flex-wrap items-center">
    {status_indicator.map((el, key) => {
        const class_active = el.key === props.activate_pipeline ? el.style_active_class : ""
        return <button key={key} onClick={() => props.setActive(el.key)} className={`px-4 opacity-50 border hover:opacity-100 ml-2 mx-1 items-center flex py-3 text-xs rounded-full font-semibold border-transparent focus:outline-none transition duration-40 ease-in-out ${el.style_class} ${class_active}`}>
            {
                el.style_class_bullet !== "" ? <span className={`w-3 h-3 inline-block rounded-full mr-1 ${el.style_class_bullet}`}></span> : ""
            }
            <span>{el.label} </span>
        </button>
    })}
</div>
}
