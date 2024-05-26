import {
    useCheckNodeSelected,
    useSelectedNodeStore,
} from "@/store/selected-node-store"
import { cn } from "@/utils/cn"
import { ActionIcon, Group, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
    IconCheck,
    IconEdit,
    IconMinus,
    IconPin,
    IconX,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import {
    Handle,
    NodeToolbar,
    Position,
    useNodeId,
    useReactFlow,
} from "reactflow"
import { checkIconExist } from "@/utils/aws-icon"

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
    const [editMode, { open: openEditMode, close: closeEditMode }] =
        useDisclosure(false)

    const { getNode, setNodes, getNodes } = useReactFlow()
    const [iconExist, setIconExist] = useState(false)
    const nodeId = useNodeId()
    const isNodeSelected = useCheckNodeSelected(nodeId!)

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
            checkIconExist(icon).then((exist) => {
                setIconExist(exist)
            })
        }
    }, [icon])

    return (
        <>
            <NodeToolbar position={Position.Top} offset={10} align="end">
                {editMode ? (
                    <Group gap={4}>
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
                    </Group>
                ) : (
                    <Group gap={4}>
                        <Tooltip label="Edit">
                            <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={openEditMode}
                            >
                                <IconEdit />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={isNodeSelected ? "Discard" : "Mask as edit"}>
                            <ActionIcon
                                variant="light"
                                color={isNodeSelected ? "red" : "green"}
                                onClick={handleClick}
                            >
                                {isNodeSelected ? <IconMinus /> : <IconPin />}
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                )}
            </NodeToolbar>
            <div
                className={cn(
                    ` ${selected ? "border-2" : "border"} ${
                        isNodeSelected ? "border-green-600" : "border-black"
                    } bg-white flex items-center justify-center ${iconExist ? 'px-1 py-2.5' : 'p-2.5'}`,
                    className
                )}
            >
                <div className="flex items-center w-full">
                    <div>
                        {iconExist && (
                            <img
                                src={`https://app.eraser.io/static/canvas-icons/${icon}.svg`}
                                alt={icon}
                                className="w-8 h-8"
                            />
                        )}
                    </div>
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
