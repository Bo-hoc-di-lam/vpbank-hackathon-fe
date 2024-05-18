import { useCallback } from "react"
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    OnConnect,
    useEdgesState,
    useNodesState,
} from "reactflow"

import { initialNodes, nodeTypes } from "../../nodes"
import { initialEdges, edgeTypes } from "../../edges"

const DiagramPage = () => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    )
    return (
        <>
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                edgeTypes={edgeTypes}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </>
    )
}

export default DiagramPage
