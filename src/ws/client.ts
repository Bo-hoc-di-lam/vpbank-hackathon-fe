
import { Link, SubGraph, Vertex } from '@/type/diagram'
import { Message, WSEvent, Prompt, MessageData, EditNode, SystemTypeDTO, System } from '@/type/ws_data'

type MessageCallback<T extends MessageData> = (msg: Message<T>) => void

interface WSEventMap {
    // info
    [WSEvent.Error]: MessageCallback<string>
    [WSEvent.UserJoined]: MessageCallback<string>
    [WSEvent.UserLeave]: MessageCallback<string>
    [WSEvent.Lock]: MessageCallback<any>
    [WSEvent.Done]: MessageCallback<any>
    [WSEvent.Mermaid]: MessageCallback<string>
    [WSEvent.RoomInfo]: MessageCallback<string>

    // user action
    [WSEvent.Prompt]: MessageCallback<Prompt>
    [WSEvent.PromptEdit]: MessageCallback<Prompt>
    [WSEvent.GenerateIcon]: MessageCallback<SystemTypeDTO>
    [WSEvent.JoinRoom]: MessageCallback<string>
    [WSEvent.GenerateCode]: MessageCallback<SystemTypeDTO>

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
            this.roomNameplate = evt.data
        }
    }



    constructor(nameplate?: string) {
        if (!nameplate) {
            this.ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws`)
        } else {
            this.ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/room/${nameplate}/ws`)
        }
        this.ws.addEventListener('error', err => {
            console.error(err)
        })
        this.ws.addEventListener('open', () => {
            console.log('connected')
        })
        this.ws.addEventListener('close', () => {

        })
        this.ws.addEventListener('message', this.handleEvent)
    }



    public JoinRoom(nameplate: string) {
        const data: Message<string> = {
            event: WSEvent.JoinRoom,
            data: nameplate
        }
        this.ws.send(JSON.stringify(data))
    }

    public GenerateCode(system: System) {
        const data: Message<SystemTypeDTO> = {
            event: WSEvent.GenerateCode,
            data: {
                type: system
            }
        }
        this.ws.send(JSON.stringify(data))
    }

    public GenerateIcon(system: System) {
        const data: Message<SystemTypeDTO> = {
            event: WSEvent.GenerateIcon,
            data: {
                type: system
            }
        }
        this.ws.send(JSON.stringify(data))
    }


    public SendPrompt(prompt: string) {
        const data: Message<Prompt> = {
            event: WSEvent.Prompt,
            data: {
                input: prompt
            }
        }
        this.ws.send(JSON.stringify(data))
    }

    public SendEditPrompt(prompt: string, editNodes: Vertex[]) {
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

    public On<T extends WSEvent>(evt: T, callback: WSEventMap[T]) {
        this.eventHandler[evt] = callback
    }
    public Nameplate(): string {
        return this.roomNameplate
    }

    private handleEvent(msg: MessageEvent<any>) {
        const data = msg.data
        var event: Message<any> = JSON.parse(data)
        this.staticHandler[event.event as WSEvent]?.(event.data)
        this.eventHandler[event.event as WSEvent]?.(event.data)
    }
}
