import { useDiagramManager } from "@/store/digaram-mananger-store"
import {
    useCheckNodeSelected,
    useSelectedNodeStore,
} from "@/store/selected-node-store"
import { WSEvent } from "@/type/ws_data"
import { convertIconName } from "@/utils/aws-icon"
import { cn } from "@/utils/cn"
import { ActionIcon, Stack, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
    IconCheck,
    IconEdit,
    IconTrash,
    IconX
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import {
    Handle,
    NodeToolbar,
    Position,
    useNodeId,
    useReactFlow,
} from "reactflow"

export interface BaseNodeData {
    label?: string
    icon?: string
}

interface BaseNodeProps extends BaseNodeData {
    selected: boolean
    className?: string
    labelClassName?: string
}

const BaseNode = ({
    label,
    selected,
    icon,
    className = "",
    labelClassName = "",
}: BaseNodeProps) => {
    const diagramManager = useDiagramManager()
    const [editMode, { open: openEditMode, close: closeEditMode }] =
        useDisclosure(false)

    const { getNode, setNodes, getNodes } = useReactFlow()
    const [iconExist, setIconExist] = useState(false)
    const nodeId = useNodeId()
    const isNodeSelected = useCheckNodeSelected(nodeId!)
    const [iconUrl, setIconUrl] = useState("")
    const [genId, setGenId] = useState(0)

    const toggleSelectedNode = useSelectedNodeStore(
        (state) => state.toggleSelectedNode
    )

    const handleClick = () => {
        toggleSelectedNode(nodeId!)
    }

    const [labelEdit, setLabelEdit] = useState(label)
    const [isSaved, setIsSaved] = useState(false)
    const handleEditSave = () => {
        setIsSaved(true)
        closeEditMode()
    }

    const handleEditCancel = () => {
        setLabelEdit(label)
        closeEditMode()
    }
    useEffect(() => {
        diagramManager.on(WSEvent.Done, (data) => {
            if (data.event === WSEvent.GenerateIcon) {
                setGenId(Math.random())
            }
        })
    }, [])

    useEffect(() => {
        if (isSaved) {
            const nodes = getNodes()
            const node = getNode(nodeId!)
            if (node) {
                setNodes(
                    nodes.map((n) => {
                        if (n.id === nodeId) {
                            return {
                                ...n,
                                data: {
                                    ...n.data,
                                    label: labelEdit,
                                },
                            }
                        }
                        return n
                    })
                )
            }
            setIsSaved(false)
        }
    }, [isSaved, labelEdit, nodeId, getNode, getNodes, setNodes])

    useEffect(() => {
        if (!selected) {
            handleEditCancel()
        }
    }, [selected])

    useEffect(() => {
        if (icon) {
            const converted = convertIconName(icon)
            setIconUrl(`https://app.eraser.io/static/canvas-icons/${converted}.svg`)
            setIconExist(true)
        }
    }, [icon, genId])

    return (
        <>
            <NodeToolbar position={Position.Right} offset={10} align="center">
                {editMode ? (
                    <Stack gap={4} bg="white">
                        <Tooltip label="Save">
                            <ActionIcon
                                variant="light"
                                color="green"
                                onClick={handleEditSave}
                            >
                                <IconCheck />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Cancel">
                            <ActionIcon
                                variant="light"
                                color="red"
                                onClick={handleEditCancel}
                            >
                                <IconX />
                            </ActionIcon>
                        </Tooltip>
                    </Stack>
                ) : (
                    <Stack gap={4} bg="white">
                        <Tooltip label="Edit">
                            <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={openEditMode}
                            >
                                <IconEdit />
                            </ActionIcon>
                        </Tooltip>
                        {/* <Tooltip
                            label={
                                isNodeSelected ? "Discard" : "Keep this node"
                            }
                        >
                            <ActionIcon
                                variant="light"
                                color={isNodeSelected ? "red" : "green"}
                                onClick={handleClick}
                            >
                                {isNodeSelected ? <IconMinus /> : <IconPin />}
                            </ActionIcon>
                        </Tooltip> */}
                        <Tooltip label="Delete">
                            <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => {
                                    setNodes((nodes) =>
                                        nodes.filter((n) => n.id !== nodeId)
                                    )
                                }}
                            >
                                <IconTrash />
                            </ActionIcon>
                        </Tooltip>
                    </Stack>
                )}
            </NodeToolbar>

            <div
                className={cn(
                    ` 
                    w-auto h-auto p-1
                    transition-all duration-150 shadow-md
                    bg-white flex items-center justify-center border border-slate-500
                    ${(selected || isNodeSelected) &&
                    "border-green-600 scale-110 border-2"
                    }
                      `,
                    className
                )}
            >
                <div className="flex items-center w-full h-full gap-1">
                    {iconExist && (
                        <div className="flex-shrink-0">
                            <Tooltip label={icon.toUpperCase()}>
                                <img
                                    src={iconUrl}
                                    alt={icon}
                                    className=" w-auto h-10 rounded-sm hover:animate-pulse"
                                    onError={evt => {
                                        console.log("img broken")
                                        evt.currentTarget.style.display = 'none'
                                    }}
                                />
                            </Tooltip>
                        </div>
                    )}
                    <div className="flex-grow text-center text-xs">
                        {label && (
                            <div className={cn(labelClassName)}>
                                {editMode ? (
                                    <input
                                        value={labelEdit}
                                        onChange={(e) =>
                                            setLabelEdit(e.currentTarget.value)
                                        }
                                        className="w-full text-center border border-black rounded-sm"
                                    />
                                ) : (
                                    <span>{label}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <Handle type="source" position={Position.Bottom} />
                <Handle type="target" position={Position.Top} />
            </div>
        </>
    )
}

export default BaseNode
