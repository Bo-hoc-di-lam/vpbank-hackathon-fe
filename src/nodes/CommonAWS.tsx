import { NodeProps } from "reactflow"
import BaseNode, { BaseNodeData } from "./BaseNode"

export interface CommonNodeData extends BaseNodeData {}

export const CommonAWSNode = ({ data, selected }: NodeProps<CommonNodeData>) => {
    return (
        <BaseNode
            label={data.label}
            icon={data.icon}
            selected={selected}
            className="w-[150px] h-[50px] rounded-md"
        />
    )
}
