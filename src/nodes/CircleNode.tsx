import { Handle, NodeProps, Position } from "reactflow"

export type CircleNodeData = {
    label?: string
}

export const CircleNode = ({ data }: NodeProps<CircleNodeData>) => {
    return (
        <div className="border p-2.5 w-[100px] h-[100px] border-black rounded-full bg-white flex items-center justify-center">
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
