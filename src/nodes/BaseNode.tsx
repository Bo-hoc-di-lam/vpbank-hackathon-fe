import { cn } from "@/utils/cn"
import { ActionIcon } from "@mantine/core"
import { IconPin } from "@tabler/icons-react"
import { Handle, NodeToolbar, Position } from "reactflow"

interface BaseNodeProps {
    children: React.ReactNode
    selected: boolean
    className?: string
}

const BaseNode = ({ children, selected, className = "" }: BaseNodeProps) => {
    return (
        <>
            <NodeToolbar position={Position.Top} offset={0} align="end">
                <ActionIcon variant="light">
                    <IconPin />
                </ActionIcon>
            </NodeToolbar>
            <div
                className={cn(
                    ` ${
                        selected ? "border-2" : "border"
                    } p-2.5 border-black bg-white flex items-center justify-center`,
                    className
                )}
            >
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
