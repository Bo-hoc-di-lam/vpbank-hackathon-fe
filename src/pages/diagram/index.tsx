import Dagre from "@dagrejs/dagre"
import { useCallback, useEffect, useState } from "react"
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    OnConnect,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "reactflow"
import { useLocation } from "react-router-dom"

import { nodeTypes } from "../../nodes"
import { edgeTypes } from "../../edges"
import { useRemoveLogo } from "../../hooks"
import { useHotkeys } from "@mantine/hooks"
import { DiagramManager } from "@/diagram/manager"
import { useWtf } from "@/hooks/use-wtf"
import {
    getDiagramManager,
    useDiagramManager,
} from "@/store/digaram-mananger-store"

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
    useWtf()

    const { fitView } = useReactFlow()
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    )

    const setDiagram = (
        nodes: any,
        edges: any,
        autoLayout: boolean = false
    ) => {
        if (autoLayout) {
            const layouted = getLayoutedElements(nodes, edges, {
                direction: "LR",
            })

            setNodes([...layouted.nodes])
            setEdges([...layouted.edges])
        } else {
            setNodes([...nodes])
            setEdges([...edges])
        }

        window.requestAnimationFrame(() => {
            fitView()
        })
        // toggleDirection()
    }

    const diagramManager = useDiagramManager()

    // Handle input and render chart
    useEffect(() => {
        const interval = setInterval(() => {
            if (!diagramManager.needRerender) {
                if (!diagramManager.isGenerating) {
                    return
                }

                return
            }
            const isAutoLayout = diagramManager.isNeedGenLayout
            setDiagram(diagramManager.nodes, diagramManager.edges, isAutoLayout)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // useEffect(() => {
    //     const { needRerender, isGenerating } = diagramManagerState
    //     console.log("rendering...", needRerender, isGenerating)

    // if (!needRerender) {
    //     if (!isGenerating) {
    //         return
    //     }

    //     return
    // }

    // const isAutoLayout = diagramManager.isNeedGenLayout
    // console.log("rendering...", isAutoLayout)
    // setDiagram(diagramManager.nodes, diagramManager.edges, isAutoLayout)

    // diagramManager.needRerender = false
    // }, [diagramManagerState])

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
            {/* <Panel position="top-left">
                <Tooltip label={directionRecords[direction]} position="right">
                    <ActionIcon onClick={onLayout}>
                        <IconLayout />
                    </ActionIcon>
                </Tooltip>
            </Panel> */}
            <Background />
            <Controls />
        </ReactFlow>
    )
}

export default DiagramPage
