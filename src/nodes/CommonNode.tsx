import { NodeProps } from "reactflow"
import BaseNode, { BaseNodeData } from "./BaseNode"

export interface CommonNodeData extends BaseNodeData {}

export const CommonNode = ({ data, selected }: NodeProps<CommonNodeData>) => {
    return (
        <BaseNode
            label={data.label}
            selected={selected}
            className="w-[100px] h-[50px] rounded-md"
        />
    )
}
