import { Handle, NodeProps, Position } from "reactflow"

export type StadiumShapedNodeData = {
    label?: string
}

export const StadiumShapedNode = ({
    data,
}: NodeProps<StadiumShapedNodeData>) => {
    return (
        <div className="border p-2.5 w-[150px] border-black rounded-[20px] bg-white">
            {data.label && (
                <div className="text-center text-xs">{data.label}</div>
            )}

            <Handle type="source" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
            <Handle type="source" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    )
}
