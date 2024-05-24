import { NodeProps } from "reactflow"
import BaseNode from "./BaseNode"

export type CircleNodeData = {
    label?: string
}

export const CircleNode = ({ data, selected }: NodeProps<CircleNodeData>) => {
    return (
        <BaseNode
            selected={selected}
            className="w-[100px] h-[100px] rounded-md"
        >
            {data.label && (
                <div className="text-center text-xs">{data.label}</div>
            )}
        </BaseNode>
    )
}
