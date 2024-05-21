import { useMemo } from "react"
import { useReactFlow } from "reactflow"
import { Button } from "@mantine/core"

let id = 0

const ManualEdit = () => {
    const reactflow = useReactFlow()
    const editTools = useMemo(
        () => [
            {
                label: "Add node",
                action: () => {
                    reactflow.addNodes({
                        id: `node_${id++}`,
                        type: "default",
                        position: {
                            x: 0,
                            y: -200,
                        },
                        data: { label: `Node ${id}` },
                    })
                },
            },
            {
                label: "Clear canvas",
                action: () => {
                    reactflow.setEdges([])
                    reactflow.setNodes([])
                },
            },
        ],
        []
    )

    return (
        <div className="flex flex-col gap-4">
            {editTools.map((tool, index) => (
                <Button
                    fullWidth
                    variant="light"
                    key={index}
                    onClick={tool.action}
                >
                    {tool.label}
                </Button>
            ))}
        </div>
    )
}

export default ManualEdit
