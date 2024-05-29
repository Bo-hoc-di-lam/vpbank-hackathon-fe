import { NodeProps } from "reactflow"
import BaseNode, { BaseNodeData } from "./BaseNode"

export interface CircleNodeData extends BaseNodeData {}

export const CircleNode = ({ data, selected }: NodeProps<CircleNodeData>) => {
    return (
        <BaseNode
            label={data.label}
            icon={data.icon}
            selected={selected}
            className="w-[100px] h-[100px] rounded-full"
        />
    )
}
