import * as React from "react";

interface Props {
    children: React.ReactNode,
    className?: string
}

function Content({ children, className }: Props): JSX.Element {
    return (
        <div className={`max-w-screen-2xl w-full mt-6 px-4 mx-auto ${className}`}>
            {children}
        </div>
    );
}

export default Content;
