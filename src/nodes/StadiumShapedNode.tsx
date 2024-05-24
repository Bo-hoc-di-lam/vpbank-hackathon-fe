import { NodeProps } from "reactflow"
import BaseNode from "./BaseNode"

export type StadiumShapedNodeData = {
    label?: string
}

export const StadiumShapedNode = ({
    data,
    selected,
}: NodeProps<StadiumShapedNodeData>) => {
    return (
        <BaseNode selected={selected} className="w-[150px] rounded-[20px]">
            {data.label && (
                <div className="text-center text-xs">{data.label}</div>
            )}
        </BaseNode>
    )
}
