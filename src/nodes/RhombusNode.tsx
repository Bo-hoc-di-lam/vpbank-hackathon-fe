import { NodeProps } from "reactflow"
import BaseNode from "./BaseNode"

export type RhombusNodeData = {
    label?: string
}

export const RhombusNode = ({ data, selected }: NodeProps<RhombusNodeData>) => {
    return (
        <BaseNode selected={selected} className="w-20 h-20 transform rotate-45">
            {data.label && (
                <div className="text-center text-xs transform -rotate-45">
                    {data.label}
                </div>
            )}
        </BaseNode>
    )
}
