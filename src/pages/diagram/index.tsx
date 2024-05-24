import Dagre from "@dagrejs/dagre"
import { useCallback } from "react"
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    OnConnect,
    Panel,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "reactflow"

import { initialNodes, nodeTypes } from "../../nodes"
import { initialEdges, edgeTypes } from "../../edges"
import { useRemoveLogo } from "../../hooks"
import { ActionIcon, Tooltip } from "@mantine/core"
import { IconLayout } from "@tabler/icons-react"
import { useHotkeys, useToggle } from "@mantine/hooks"

const directionRecords: Record<string, string> = {
    TB: "Top to Bottom",
    BT: "Bottom to Top",
    RL: "Right to Left",
    LR: "Left to Right",
}

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

const getLayoutedElements = (nodes: any, edges: any, options: any) => {
    g.setGraph({ rankdir: options.direction })

    edges.forEach((edge: any) => g.setEdge(edge.source, edge.target))
    nodes.forEach((node: any) => g.setNode(node.id, node))

    Dagre.layout(g)

    return {
        nodes: nodes.map((node: any) => {
            const { x, y } = g.node(node.id)

            return { ...node, position: { x, y } }
        }),
        edges,
    }
}
const DiagramPage = () => {
    useRemoveLogo()

    useHotkeys([
        [
            "A+A",
            () =>
                (window.location.href =
                    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
        ],
    ])
    const [direction, toggleDirection] = useToggle(["TB", "BT", "RL", "LR"])

    const { fitView } = useReactFlow()
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    )

    const onLayout = useCallback(() => {
        const layouted = getLayoutedElements(nodes, edges, { direction })

        setNodes([...layouted.nodes])
        setEdges([...layouted.edges])

        window.requestAnimationFrame(() => {
            fitView()
        })
        toggleDirection()
    }, [nodes, edges])

    return (
        <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            defaultEdgeOptions={{
                animated: true,
                type: "straight",
            }}
        >
            <Panel position="top-left">
                <Tooltip label={directionRecords[direction]} position="right">
                    <ActionIcon onClick={onLayout}>
                        <IconLayout />
                    </ActionIcon>
                </Tooltip>
            </Panel>
            <Background />
            <Controls />
        </ReactFlow>
    )
}

export default DiagramPage
