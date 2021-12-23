import * as React from "react";

interface ICardContentProps {
    children: React.ReactNode,
    className?: string
}

function CardContent({ children, className}: ICardContentProps): JSX.Element {
    return (
        <div className={`bg-white border p-4 my-4 rounded-md ${className}`}>
            {children}
        </div>
    );
}

export default CardContent;