import ReactFlow, { BackgroundVariant, removeElements, Background, addEdge, Controls, ArrowHeadType, Edge, Connection, Elements, updateEdge, Position } from 'react-flow-renderer';
import { useState, useCallback } from 'react';
import PageTitle from "components/organism/PageTitle"
import BtnCreate from "components/atoms/buttons/BtnCreate"
import NodeStart from "components/atoms/nodes/NodeStart"

import localforage from 'localforage'

const getNodeId = () => `randomnode_${+new Date()}`;

const initialElements = [
    {
        id: '1', data: { label: "start" }, sourcePosition: Position.Right, position: { x: 50, y: 300 }, type: "input",
        typeNode: "start",
        style: { border: '1px solid #27ae60', background: "#27ae60", color: "white" }
    }
];

localforage.config({
    name: 'react-flow-docs',
    storeName: 'flows',
});

const flowKey = 'example-flow';


const availableConnections = [
    {
        env: "SSH_COMMANDS",
        label: "SSH Commands",
        options: {
            type: "default",
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        }
    },
    {
        env: "FTP_TRANSFER",
        label: "FTP Transfer",
        options: {
            type: "default",
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        }
    },
    {
        env: "PYTHON_SCRIPT",
        label: "PY SCRIPT",
        options: {
            type: "default",
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        }
    },
    {
        env: "SCHEDULER",
        label: "Scheduler",
        options: {
            type: "input",
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        }
    },
    {
        env: "ALERT_TELEGRAM",
        label: <div>Telegram Notif</div>,
        options: {
            type: "output",
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        }
    },
]

interface PropsInterface {
    elements: Elements,
}

function PipelineFlow(props: PropsInterface): JSX.Element {
    const [elements, setElements] = useState<Elements>(initialElements);
    const [rfInstance, setRfInstance] = useState<any>(null);

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localforage.setItem(flowKey, flow);
        }
    }, [rfInstance]);

    const onConnect = (params: Edge | Connection) => {
        let new_param = {
            ...params,
            type: "smoothstep",
            arrowHeadType: ArrowHeadType.ArrowClosed,
            animated: true,
        }
        setElements((els) => addEdge(new_param, els))
    };
    const onElementsRemove = (elementsToRemove: any) =>
        setElements((els) => removeElements(elementsToRemove, els));

    const onAdd = useCallback(() => {
        let item = availableConnections[Math.floor(Math.random() * availableConnections.length)];
        const newNode = {
            ...item.options,
            id: getNodeId(),
            data: { label: item.label },
            animated: true,
            style: { border: '0.5px solid #ccc', color: "#777" },
            position: {
                x: Math.random() * 250,
                y: Math.random() * 200,
            },
        };
        setElements((els) => els.concat(newNode));
    }, [setElements]);


    const onEdgeUpdate = (oldEdge: any, newConnection: any) => setElements((els) => updateEdge(oldEdge, newConnection, els));
    const onLoad = () => {
        const json_data = '[{"id":"1","data":{"label":"Start"},"sourcePosition":"right","position":{"x":260,"y":255},"type":"input","style":{"border":"1px solid #27ae60","background":"#27ae60","color":"white",width:"10px"},"isDraggable":false},{"type":"default","sourcePosition":"right","targetPosition":"left","id":"randomnode_1615640969899","data":{"label":"SSH Commands"},"animated":true,"style":{"border":"0.5px solid #ccc","color":"#777"},"position":{"x":623.5720824976516,"y":216.54819884605095}},{"source":"1","sourceHandle":null,"target":"randomnode_1615640969899","targetHandle":null,"type":"smoothstep","arrowHeadType":"arrowclosed","animated":true,"id":"reactflow__edge-1null-randomnode_1615640969899null"}]'
        const obj = JSON.parse(json_data);
        setElements(obj)
    };
    return (
        <>
            <div className="flex justify-between flex-wrap items-center ">
                <PageTitle title="Report daily Server health Proxima Centauri SRV-441" subtitle="Created at 202018" />
                <div>
                    <BtnCreate onClick={onAdd} text="Add Node" />
                    <BtnCreate onClick={onSave} text="Save" />
                </div>
            </div>
            <div style={{ height: "45rem" }}>
                <ReactFlow elements={elements}
                    onConnect={onConnect}
                    className="bg-gray-50 rounded-lg mt-4  border"
                    onEdgeUpdate={onEdgeUpdate}
                    snapToGrid={true}
                    onElementsRemove={onElementsRemove}
                    onLoad={setRfInstance}
                >
                    <Controls />
                    <Background variant={BackgroundVariant.Lines} />
                </ReactFlow>
            </div>
        </>
    );
}

export default PipelineFlow;
