import { IPropsNode, NodeElements } from 'components/atoms/nodes/types'
import BxPlusIcon from "components/atoms/icons/BxPlusIcon"
import { Position } from 'react-flow-renderer';

function NodeStart(props: IPropsNode): JSX.Element {
    return (
        <><BxPlusIcon /> Start</>
    );
}
let node_start: NodeElements = {
    id: '1',
    data: { label: <NodeStart /> },
    sourcePosition: Position.Right,
    position: { x: 50, y: 300 },
    type: "input",
    typeNode: "start"
}



export default node_start;