import { NodeProps } from "reactflow"
import BaseNode, { BaseNodeData } from "./BaseNode"

export interface RhombusNodeData extends BaseNodeData {}

export const RhombusNode = ({ data, selected }: NodeProps<RhombusNodeData>) => {
    return (
        <BaseNode
            label={data.label}
            selected={selected}
            className="w-20 h-20 transform rotate-45"
            labelClassName="transform -rotate-45"
        />
    )
}
