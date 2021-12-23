interface Props {
    title: String,
    subtitle?: String
}

function PageTitle({ title, subtitle }: Props): JSX.Element {
    return (
        <div>
            <h1 className="text-2xl font-medium text-gray-700">{title}</h1>
            <span className="text-gray-400 font-thin text-sm">{subtitle}  </span>
        </div>
    );
}

export default PageTitle;
