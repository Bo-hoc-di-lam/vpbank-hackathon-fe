
import { Link, SubGraph, Vertex } from '@/type/diagram'
import { Message, WSEvent, Prompt, MessageData, EditNode, SystemTypeDTO, SystemType } from '@/type/ws_data'

type MessageCallback<T extends MessageData> = (msg: T) => void

interface WSEventMap {
    // info
    [WSEvent.Error]: MessageCallback<string>
    [WSEvent.UserJoined]: MessageCallback<string>
    [WSEvent.UserLeave]: MessageCallback<string>
    [WSEvent.Lock]: MessageCallback<any>
    [WSEvent.Done]: MessageCallback<any>
    [WSEvent.Mermaid]: MessageCallback<string>
    [WSEvent.RoomInfo]: MessageCallback<string>
    [WSEvent.Reset]: MessageCallback<any>

    // user action
    [WSEvent.Prompt]: MessageCallback<Prompt>
    [WSEvent.PromptEdit]: MessageCallback<Prompt>
    [WSEvent.GenerateIcon]: MessageCallback<SystemTypeDTO>
    [WSEvent.JoinRoom]: MessageCallback<string>
    [WSEvent.GenerateCode]: MessageCallback<SystemTypeDTO>
    [WSEvent.GenerateDrawIO]: MessageCallback<any>

    // server diagram response
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
    [WSEvent.SetComment]: MessageCallback<string>
    [WSEvent.SetTerraform]: MessageCallback<string>
    [WSEvent.SetDrawIO]: MessageCallback<string>

    // server diagram with custom icon response
    [WSEvent.AddNodeAWS]: MessageCallback<Vertex>
    [WSEvent.AddLinkAWS]: MessageCallback<Link>
    [WSEvent.AddSubGraphAWS]: MessageCallback<SubGraph>
    [WSEvent.ChangeNodeAWS]: MessageCallback<Vertex>
    [WSEvent.ChangeLinkAWS]: MessageCallback<Link>
    [WSEvent.ChangeSubGraphAWS]: MessageCallback<SubGraph>
    [WSEvent.DelNodeAWS]: MessageCallback<Vertex>
    [WSEvent.DelLinkAWS]: MessageCallback<Link>
    [WSEvent.DelSubGraphAWS]: MessageCallback<SubGraph>
    [WSEvent.SetNodePositionAWS]: MessageCallback<Vertex>
    [WSEvent.SetCommentAWS]: MessageCallback<string>
    [WSEvent.SetTerraformAWS]: MessageCallback<string>

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
            this.roomNameplate = evt
        }
    }

    constructor() {
        this.ws = new WebSocket(import.meta.env.VITE_WS_URL)
        this.ws.addEventListener('error', err => {
            console.error(err)
        })
        this.ws.addEventListener('open', () => {
            console.info("ws connected")
            setInterval(() => {
                this.ws.send("PING")
            }, 500)
        })
        this.ws.addEventListener('message', this.handleEvent.bind(this))
    }

    private async sendMessage(data: Message<any>) {
        await this.waitForConnection()
        console.info("send", data)
        this.ws.send(JSON.stringify(data))
    }

    public joinRoom(nameplate: string) {
        const data: Message<string> = {
            event: WSEvent.JoinRoom,
            data: nameplate
        }
        this.sendMessage(data)
    }

    public generateDrawIO() {
        const data: Message<any> = {
            event: WSEvent.GenerateDrawIO,
            data: null,
        }
        this.sendMessage(data)
    }

    public generateIcon(systemType: SystemType) {
        const data: Message<SystemTypeDTO> = {
            event: WSEvent.GenerateIcon,
            data: {
                type: systemType
            }
        }
        this.sendMessage(data)
    }

    public generateTerraform(systemType: SystemType) {
        const data: Message<SystemTypeDTO> = {
            event: WSEvent.GenerateCode,
            data: {
                type: systemType
            }
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
        this.sendMessage(data)
    }

    public on<T extends WSEvent>(evt: T, callback: WSEventMap[T]) {
        this.eventHandler[evt] = callback
    }
    public nameplate(): string {
        return this.roomNameplate
    }

    private handleEvent(msg: MessageEvent<any>) {
        const data = msg.data
        if (data === "PONG") {
            return
        }
        const event: Message<any> = JSON.parse(data)

        console.log(event.event, event.data)
        this.staticHandler[event.event as WSEvent]?.(event.data)
        this.eventHandler[event.event as WSEvent]?.(event.data)
    }

    private async waitForConnection() {
        while (this.ws.readyState !== WebSocket.OPEN) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }
}
