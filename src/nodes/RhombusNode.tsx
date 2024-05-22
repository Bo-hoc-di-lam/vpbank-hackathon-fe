import { Handle, NodeProps, Position } from "reactflow"

export type RhombusNodeData = {
    label?: string
}

const RhombusNode = ({ data }: NodeProps<RhombusNodeData>) => {
    return (
        <div className="border p-2.5 w-20 h-20 transform rotate-45 border-black bg-white flex items-center justify-center">
            {data.label && (
                <div className="text-center text-xs transform -rotate-45">
                    {data.label}
                </div>
            )}

            <Handle type="source" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
            <Handle type="source" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    )
}

export default RhombusNode
