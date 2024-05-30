import { NodeProps } from "reactflow"
import BaseNode, { BaseNodeData } from "./BaseNode"

export interface CommonNodeData extends BaseNodeData { }

export const CommonAWSNode = ({ data, selected }: NodeProps<CommonNodeData>) => {
    return (
        <BaseNode
            label={data.label}
            icon={data.icon}
            selected={selected}
            className="min-w-[150px] max-w-[200px] min-h-[50px] rounded-md"
        />
    )
}
