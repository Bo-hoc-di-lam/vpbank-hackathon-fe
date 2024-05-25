import { useCallback, useEffect } from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    OnConnect,
    useEdgesState,
    useNodesState,
    useReactFlow,
    Node,
    Edge,
} from "reactflow";
import { useLocation } from "react-router-dom";
import ELK from "elkjs/lib/elk.bundled.js";

import { nodeTypes } from "../../nodes";
import { edgeTypes } from "../../edges";
import { useRemoveLogo } from "../../hooks";
import { useWtf } from "@/hooks/use-wtf";
import {
    getDiagramManager,
    useDiagramManager,
} from "@/store/digaram-mananger-store";

const elk = new ELK();

const elkOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    "elk.spacing.nodeNode": "80",
};


const createGraph = (nodes, edges, subGraphs, options) => {
    const isHorizontal = options?.["elk.direction"] === "RIGHT";

    const createSubGraph = (parentNode, allNodes, allEdges) => {
        const children = allNodes.filter(node => node.parentNode === parentNode.id);
        const subGraphs = allNodes.filter(node => node.type === 'subgraph' && node.parentNode === parentNode.id);

        return {
            id: parentNode.id,
            layoutOptions: options,
            children: children.map(node => ({
                ...node,
                targetPosition: isHorizontal ? "left" : "top",
                sourcePosition: isHorizontal ? "right" : "bottom",
                width: 150,
                height: 50,
                ...createSubGraph(node, allNodes, allEdges)  // Recurse into subgraphs
            })),
            edges: allEdges.filter(edge => edge.source === parentNode.id || edge.target === parentNode.id)
        };
    };

    const rootNodes = nodes.filter(node => !node.parentNode);
    const rootSubGraphs = subGraphs.filter(subGraph => !subGraph.parentNode);

    return {
        id: "root",
        layoutOptions: options,
        children: rootNodes.map(node => ({
            ...node,
            targetPosition: isHorizontal ? "left" : "top",
            sourcePosition: isHorizontal ? "right" : "bottom",
            width: 150,
            height: 50,
            ...createSubGraph(node, nodes, edges)  // Recurse into subgraphs
        })).concat(rootSubGraphs.map(subGraph => createSubGraph(subGraph, nodes, edges))),
        edges: edges
    };
};

const getLayoutedElements = async (nodes: Node<any>[], edges: Edge<any>[], subGraphs: Node<any>[], options: any) => {
    const graph = createGraph(nodes, edges, subGraphs, options);

    try {
        const layoutedGraph = await elk.layout(graph);
        const layoutedNodes = layoutedGraph.children.map((node) => ({
            ...node,
            position: { x: node.x, y: node.y },
        }));

        // console.log("layoutedGraph", layoutedGraph);
        // console.log("layoutedNodes", layoutedNodes);

        return {
            nodes: layoutedNodes,
            edges: layoutedGraph.edges,
            subGraphs, // handle subGraphs here if needed
        };
    } catch (error) {
        console.error(error);
        return { nodes, edges, subGraphs };
    }
};

const DiagramPage = () => {
    useRemoveLogo();
    useWtf();

    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const setDiagram = async (nodes, edges, subGraphs) => {
        const layouted = await getLayoutedElements(nodes, edges, subGraphs, { "elk.direction": "DOWN" });

        setNodes([...layouted.nodes, ...layouted.subGraphs]); // Include subGraphs in nodes if necessary
        setEdges([...layouted.edges]);

        window.requestAnimationFrame(() => {
            fitView();
        });
    };

    const diagramManager = useDiagramManager();

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!diagramManager.needRerender) {
                await setDiagram(diagramManager.nodes, diagramManager.edges, diagramManager.subGraphs); // Pass subGraphs
                if (!diagramManager.isGenerating) {
                    return;
                }
                return;
            }

            console.log("rendering...");
            await setDiagram(diagramManager.nodes, diagramManager.edges, diagramManager.subGraphs); // Pass subGraphs

            diagramManager.needRerender = false;
        }, 500);

        return () => {
            console.log("rendering final...");
            setDiagram(diagramManager.nodes, diagramManager.edges, diagramManager.subGraphs); // Pass subGraphs
            clearInterval(interval);
        };
    }, [diagramManager]);

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
    );
};

export default DiagramPage;
