import { useCheckNodeSelected, useSelectedNodeStore } from "@/store/node-store"
import { cn } from "@/utils/cn"
import { ActionIcon } from "@mantine/core"
import { IconMinus, IconPlus } from "@tabler/icons-react"
import { Handle, NodeToolbar, Position, useNodeId } from "reactflow"

interface BaseNodeProps {
    children: React.ReactNode
    selected: boolean
    className?: string
}

const BaseNode = ({ children, selected, className = "" }: BaseNodeProps) => {
    const nodeId = useNodeId()
    const isNodeSelected = useCheckNodeSelected(nodeId!)

    const toggleSelectedNode = useSelectedNodeStore(
        (state) => state.toggleSelectedNode
    )

    const handleClick = () => {
        toggleSelectedNode(nodeId!)
    }

    return (
        <>
            <NodeToolbar position={Position.Top} offset={0} align="end">
                <ActionIcon
                    variant="light"
                    color={isNodeSelected ? "red" : "green"}
                    onClick={handleClick}
                >
                    {isNodeSelected ? <IconMinus /> : <IconPlus />}
                </ActionIcon>
            </NodeToolbar>
            <div
                className={cn(
                    ` ${selected ? "border-2" : "border"} ${
                        isNodeSelected ? "border-green-600" : "border-black"
                    } p-2.5 bg-white flex items-center justify-center`,
                    className
                )}
            >
                <div>{nodeId}</div>
                {children}
                <Handle type="source" position={Position.Top} />
                <Handle type="source" position={Position.Left} />
                <Handle type="target" position={Position.Bottom} />
                <Handle type="target" position={Position.Right} />
            </div>
        </>
    )
}

export default BaseNode
