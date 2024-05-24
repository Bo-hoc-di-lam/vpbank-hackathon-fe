import { NodeProps } from "reactflow"
import BaseNode from "./BaseNode"

export type CommonNodeData = {
    label?: string
}

export const CommonNode = ({ data, selected }: NodeProps<CommonNodeData>) => {
    return (
        <BaseNode selected={selected} className="w-[150px] rounded-md">
            {data.label && (
                <div className="text-center text-xs">{data.label}</div>
            )}
        </BaseNode>
    )
}
