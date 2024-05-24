import { NodeProps } from "reactflow"
import BaseNode, { BaseNodeData } from "./BaseNode"

export interface StadiumShapedNodeData extends BaseNodeData {}

export const StadiumShapedNode = ({
    data,
    selected,
}: NodeProps<StadiumShapedNodeData>) => {
    return (
        <BaseNode
            label={data.label}
            selected={selected}
            className="w-[150px] rounded-[20px]"
        />
    )
}
