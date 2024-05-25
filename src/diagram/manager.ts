import { WSEvent } from "@/type/ws_data"
import { WSClient } from "@/ws/client"
import { Node, Edge } from "reactflow"

export class DiagramManager {
    public nodes: Node<any>[] = []
    public edges: Edge<any>[] = []
    public isGenerating: boolean = false
    public isNeedGenLayout: boolean = false
    public needRerender: boolean = false
    public comment: string = ""

    private ws: WSClient

    constructor() {
        this.ws = new WSClient()

        this.ws.on(WSEvent.AddNode, (data: any) => {
            this.needRerender = true
            this.nodes.push({
                id: data.id,
                type: "common",
                data: {
                    label: data.text,
                },
                position: data.position,
            })
        })

        this.ws.on(WSEvent.AddLink, (data: any) => {
            this.needRerender = true
            this.edges.push({
                id: data.id,
                source: data.from_id,
                target: data.to_id,
                ariaLabel: data.text,
            })
        })

        this.ws.on(WSEvent.SetNodePosition, (data: any) => {
            this.needRerender = true
            this.isNeedGenLayout = false
            const node = this.nodes.find((n) => n.id === data.id)
            if (node) {
                node.position = data.position
            }
        })

        this.ws.on(WSEvent.SetComment, (data: any) => {
            this.needRerender = true
            this.comment = data
        })

        this.ws.on(WSEvent.Done, () => {
            this.needRerender = true
            this.isGenerating = false
        })
    }

    public start(query: string) {
        this.isGenerating = true
        this.isNeedGenLayout = true
        this.ws.sendPrompt(query)
    }
}
