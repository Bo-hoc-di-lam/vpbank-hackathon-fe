import { useMemo } from "react"
import { useReactFlow } from "reactflow"
import { cn } from "../../../../utils/cn"

let id = 0

const ManualEdit = () => {
    const reactflow = useReactFlow()
    const editTools = useMemo(
        () => [
            {
                displayElement: (
                    <div
                        className={cn(
                            `react-flow__node react-flow__node-input nopan selectable w-full`
                        )}
                    >
                        Add node
                    </div>
                ),
                action: () => {
                    reactflow.addNodes({
                        id: `node_${id++}`,
                        type: "default",
                        position: {
                            // random positive negative values
                            x: Math.random() * 600 - 300,
                            y: Math.random() * 600 - 300,
                        },
                        data: { label: `Node ${id}` },
                    })
                },
            },
        ],
        []
    )

    return (
        <div className="flex flex-col gap-6">
            {editTools.map((tool, index) => (
                <div key={index} onClick={tool.action}>
                    {tool.displayElement}
                </div>
            ))}
        </div>
    )
}

export default ManualEdit
