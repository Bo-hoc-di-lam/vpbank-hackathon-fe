
import { Link, SubGraph, Vertex } from '@/type/diagram'
import { Message, WSEvent, Prompt, MessageData, EditNode } from '@/type/ws_data'

type MessageCallback<T extends MessageData> = (msg: Message<T>) => void

interface WSEventMap {
    [WSEvent.Error]: MessageCallback<string>
    [WSEvent.Prompt]: MessageCallback<Prompt>
    [WSEvent.PromptEdit]: MessageCallback<Prompt>
    [WSEvent.AddNode]: MessageCallback<Vertex>
    [WSEvent.AddLink]: MessageCallback<Link>
    [WSEvent.AddSubGraph]: MessageCallback<SubGraph>
    [WSEvent.ChangeNode]: MessageCallback<Vertex>
    [WSEvent.ChangeLink]: MessageCallback<Link>
    [WSEvent.ChangeSubGraph]: MessageCallback<SubGraph>
    [WSEvent.DelNode]: MessageCallback<Vertex>
    [WSEvent.DelLink]: MessageCallback<Link>
    [WSEvent.DelSubGraph]: MessageCallback<SubGraph>
    [WSEvent.SetNodePosition]: MessageCallback<Vertex>
    [WSEvent.JoinRoom]: MessageCallback<string>
    [WSEvent.RoomInfo]: MessageCallback<string>
    [WSEvent.SetComment]: MessageCallback<string>
    [key: string]: MessageCallback<any>
}

type MPEvent = {
    [key in WSEvent]?: WSEventMap[key]
} & {
    [key: string]: MessageCallback<string>
}

export class WSClient {

    private roomNameplate: string = ''

    private ws: WebSocket

    private eventHandler: MPEvent = {}
    private staticHandler: MPEvent = {
        [WSEvent.Error]: (evt) => {
            console.error(evt)
        },
        [WSEvent.RoomInfo]: (evt) => {
            this.roomNameplate = evt.data
        }
    }

    constructor() {
        this.ws = new WebSocket(import.meta.env.VITE_WS_URL)
        this.ws.addEventListener('error', err => {
            console.error(err)
        })
        this.ws.addEventListener('message', this.handleEvent.bind(this))
    }

    private async sendMessage(data: Message<any>) {
        await this.waitForConnection()
        this.ws.send(JSON.stringify(data))
    }

    public joinRoom(nameplate: string) {
        const data: Message<string> = {
            event: WSEvent.JoinRoom,
            data: nameplate
        }
        this.sendMessage(data)
    }

    public sendPrompt(prompt: string) {
        const data: Message<Prompt> = {
            event: WSEvent.Prompt,
            data: {
                input: prompt
            }
        }
        this.sendMessage(data)
    }

    public sendEditPrompt(prompt: string, editNodes: Vertex[]) {
        const editNodeDTOs: EditNode[] = editNodes.map(node => ({
            node_id: node.id,
            title: node.text
        }))
        const data: Message<Prompt> = {
            event: WSEvent.PromptEdit,
            data: {
                input: prompt,
                edit_nodes: editNodeDTOs
            }
        }
        this.ws.send(JSON.stringify(data))
    }

    public on<T extends WSEvent>(evt: T, callback: WSEventMap[T]) {
        this.eventHandler[evt] = callback
    }
    public nameplate(): string {
        return this.roomNameplate
    }

    private handleEvent(msg: MessageEvent<any>) {
        const data = msg.data
        const event: Message<any> = JSON.parse(data)
        this.staticHandler[event.event as WSEvent]?.(event.data)
        this.eventHandler[event.event as WSEvent]?.(event.data)
    }

    private async waitForConnection() {
        while (this.ws.readyState !== WebSocket.OPEN) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }
}
