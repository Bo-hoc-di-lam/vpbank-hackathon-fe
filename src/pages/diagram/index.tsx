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

const getLayoutedElements = (nodes: any, edges: any, subGraphs: any, options: any) => {
    g.setGraph({ rankdir: options.direction })

    edges.forEach((edge: any) => g.setEdge(edge.source, edge.target))
    nodes.forEach((node: any) => g.setNode(node.id, node))

    try {
        Dagre.layout(g)
    } catch (error) {
        console.error(error)
        console.log("subGraphs", subGraphs)
        console.log("nodes", nodes)
        console.log("edges", edges)
        console.log("g", g)
    }

    // map positions
    nodes = nodes.map((node: any) => {
        const { x, y } = g.node(node.id)
        return { ...node, position: { x: x * 3, y: y * 2 } }
    }) 

    // Calculate subGraph positions and sizes
    subGraphs.forEach((subGraph: any) => {
        const childNodes = nodes.filter((node: any) => node.parentNode === subGraph.id)
        if (childNodes.length === 0) return
        
        const xPositions = childNodes.map((node: any) => node.position.x)
        const yPositions = childNodes.map((node: any) => node.position.y)

        const minX = Math.min(...xPositions)
        const maxX = Math.max(...xPositions)
        const minY = Math.min(...yPositions)
        const maxY = Math.max(...yPositions)

        // to draw a node x, width -> render at x - width
        // each component is 100 x 50
        // -> middle of each component is x + 50, y + 25
        const midX = (minX + maxX) / 2
        const midY = (minY + maxY) / 2

        const block_width = 120
        const block_height = 80
        const width = maxX - minX + block_width
        const height = maxY - minY + block_height

        const subGraphX = midX - width / 2 + block_width / 4 + 20
        const subGraphY = midY - height / 2 + block_height / 4 + 0

        // subtract all children's positions
        childNodes.forEach((node: any) => {
            node.position.x -= subGraphX
            node.position.y -= subGraphY
        })

        subGraph.position = { x: subGraphX, y: subGraphY }
        subGraph.style = { width: width, height: height }
    })

    subGraphs = subGraphs.filter((subGraph: any) => subGraph.position)

    // console.log("subGraphs", subGraphs)

    return {
        nodes,
        edges,
        subGraphs
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

 const setDiagram = (nodes: any, edges: any, subGraphs: any) => {
        const layouted = getLayoutedElements(nodes, edges, subGraphs, { direction: 'TD' })

        setNodes([...layouted.nodes, ...layouted.subGraphs]) // Include subGraphs in nodes
        setEdges([...layouted.edges])

        window.requestAnimationFrame(() => {
            fitView()
        })
    }

    const diagramManager = useDiagramManager()

    useEffect(() => {
        const interval = setInterval(() => {
            if (!diagramManager.needRerender) {
                // setDiagram(diagramManager.nodes, diagramManager.edges, diagramManager.subGraphs) // Pass subGraphs
                if (!diagramManager.isGenerating) {
                    return
                }

                return
            }

            console.log('rendering...')
            setDiagram(diagramManager.nodes, diagramManager.edges, diagramManager.subGraphs) // Pass subGraphs

            diagramManager.needRerender = false;
        }, 500);

        return () => { 
            console.log('rendering final...')
            setDiagram(diagramManager.nodes, diagramManager.edges, diagramManager.subGraphs) // Pass subGraphs
            clearInterval(interval);
        }
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
            <Background />
            <Controls />
        </ReactFlow>
    )
}

export default DiagramPage