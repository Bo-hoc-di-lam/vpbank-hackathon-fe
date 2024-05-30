import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    OnConnect,
    useEdgesState,
    useNodesState,
    useReactFlow,
    Panel,
} from "reactflow";
import ELK from "elkjs/lib/elk.bundled.js";

import { nodeTypes } from "../../nodes";
import { edgeTypes } from "../../edges";
import { useRemoveLogo } from "../../hooks";
import { useWtf } from "@/hooks/use-wtf";
import { useDiagramManager } from "@/store/digaram-mananger-store";
import toast from "react-hot-toast";
import { ActionIcon, Button, Indicator } from "@mantine/core";
import {
    IconMaximize,
    IconMinimize,
    IconUser,
    IconUsers,
} from "@tabler/icons-react";
import { useClipboard, useFullscreen } from "@mantine/hooks";
import { useAppShell } from "@/store/app-shell-store";
import { WSEvent } from "@/type/ws_data";

const elk = new ELK();

const createGraph = (nodes, edges, subGraphs, options) => {
    const isHorizontal = options?.["elk.direction"] === "RIGHT";

    const createSubGraph = (parentNode, allNodes, allEdges) => {
        const children = allNodes.filter(
            (node) => node.parentNode === parentNode.id
        );
        const nestedSubGraphs = subGraphs.filter(
            (subGraph) => subGraph.parentNode === parentNode.id
        );

        return {
            id: parentNode.id,
            layoutOptions: options,
            children: children
                .map((node) => ({
                    ...node,
                    targetPosition: isHorizontal ? "left" : "top",
                    sourcePosition: isHorizontal ? "right" : "bottom",
                    width: 200,
                    height: 50,
                    ...createSubGraph(node, allNodes, allEdges), // Recurse into subgraphs
                }))
                .concat(
                    nestedSubGraphs.map((subGraph) =>
                        createSubGraph(subGraph, allNodes, allEdges)
                    )
                ),
            edges: allEdges.filter(
                (edge) =>
                    edge.source === parentNode.id ||
                    edge.target === parentNode.id
            ),
        };
    };

    const rootNodes = nodes.filter((node) => !node.parentNode);
    const rootSubGraphs = subGraphs.filter((subGraph) => !subGraph.parentNode);

    return {
        id: "root",
        layoutOptions: options,
        children: rootNodes
            .map((node) => ({
                ...node,
                targetPosition: isHorizontal ? "left" : "top",
                sourcePosition: isHorizontal ? "right" : "bottom",
                width: 200,
                height: 50,
                ...createSubGraph(node, nodes, edges), // Recurse into subgraphs
            }))
            .concat(
                rootSubGraphs.map((subGraph) =>
                    createSubGraph(subGraph, nodes, edges)
                )
            ),
        edges: edges,
    };
};

const basicNodeInfo = (info: any): any => {
    const node = {
        id: info.id,
        data: {
            label: info.data?.label || info.id,
            icon: info.data?.icon,
        },
        parentNode: info.parentNode,
        position: {
            x: info.x,
            y: info.y,
        },
        type: info.type || "common",
    };

    return node;
};

const processsubGraph = (subGraph: any): any => {
    let output = [];

    const node = basicNodeInfo(subGraph);
    if (subGraph.children.length > 0) {
        subGraph.children.forEach((child) => {
            output = output.concat(processsubGraph(child));
        });

        node.type = "custom-group";
        node.style = {
            width: subGraph.width,
            height: subGraph.height,
        };
    }

    output.push(node);
    return output;
};

const getLayoutedElements = async (nodes, edges, subGraphs, options) => {
    const graph = createGraph(nodes, edges, subGraphs, options);

    try {
        const layoutedGraph = await elk.layout(graph);
        const nodes = layoutedGraph.children.map(processsubGraph).flat();

        // sort to bring subGraphs to top
        nodes.sort((a, b) => {
            if (a.type === "custom-group" && b.type !== "custom-group") {
                return 1;
            }
            if (a.type !== "custom-group" && b.type === "custom-group") {
                return -1;
            }
            return 0;
        });

        return {
            nodes,
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
    // useWtf();

    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const setDiagram = async (nodes, edges, subGraphs) => {
        const layouted = await getLayoutedElements(nodes, edges, subGraphs, {
            "elk.direction": "DOWN",
        });

        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);

        window.requestAnimationFrame(() => {
            fitView();
        });
    };

    const diagramManager = useDiagramManager();

    const onSelectionChange = ({ nodes, edges }) => {
        diagramManager.setSelectedNodes(nodes);
    };

    const [nameplate, setNameplate] = useState<string>("");
    const [userCount, setUserCount] = useState<number>(0);
    useEffect(() => {
        diagramManager.onUserCounterChange((count) => {
            setUserCount(count);
        });


        diagramManager.on(WSEvent.RoomInfo, (nameplate) => {
            toast.success(`Room name: ${nameplate}`);
            setNameplate(nameplate);
        });

        diagramManager.setInterval(async () => {
            if (!diagramManager.needRerender) {
                return;
            }

            console.log("rendering...");
            await setDiagram(
                diagramManager.nodes,
                diagramManager.edges,
                diagramManager.subGraphs
            ); // Pass subGraphs

            diagramManager.needRerender = false;
        }, 500);

        return () => {
            setDiagram(
                diagramManager.nodes,
                diagramManager.edges,
                diagramManager.subGraphs
            ); // Pass subGraphs

            if (diagramManager.interval) {
                clearInterval(diagramManager.interval);
            }
        };
    }, [diagramManager]);

    const clipboard = useClipboard({ timeout: 500 });

    const handleCopyNameplate = () => {
        if (!nameplate) {
            toast.error("Nameplate is empty");
            return;
        }
        clipboard.copy(nameplate);
        if (clipboard.error) {
            toast.error("Failed to copy nameplate");
            return;
        }

        toast.success("Copied");
    };

    const [appShellShowed, { toggle: toggleAppShell }] = useAppShell();
    const { toggle: toggleFullScreen } = useFullscreen();

    const handleToggleAppShell = () => {
        toggleAppShell();
        toggleFullScreen();
    };

    return (
        <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onSelectionChange={onSelectionChange}
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
            <Panel position="top-left">
                <Button
                    variant="filled"
                    size="sm"
                    radius="xl"
                    onClick={handleCopyNameplate}
                    className="group"
                >
                    <Indicator
                        label={userCount}
                        color="yellow"
                        size={16}
                        processing
                    >
                        {userCount == 1 ? (
                            <IconUser size={16} />
                        ) : (
                            <IconUsers size={16} />
                        )}
                    </Indicator>
                    <span className="ml-2 group-hover:ml-4 w-0 group-hover:w-full transition-all duration-300">
                        {nameplate}
                    </span>
                </Button>
            </Panel>
            <Panel position="bottom-right">
                <ActionIcon radius={"xl"} onClick={handleToggleAppShell}>
                    {appShellShowed ? (
                        <IconMaximize size={16} />
                    ) : (
                        <IconMinimize size={16} />
                    )}
                </ActionIcon>
            </Panel>
        </ReactFlow>
    );
};

export default DiagramPage;