import { Link, SubGraph, Vertex } from "./diagram"

export enum WSEvent {
    Error = 'ERROR',
    Prompt = 'PROMPT',
    PromptEdit = 'PROMPT_EDIT',
    AddNode = 'ADD_NODE',
    AddLink = 'ADD_LINK',
    AddSubGraph = 'ADD_SUB_GRAPH',
    ChangeNode = 'CHANGE_NODE',
    ChangeLink = 'CHANGE_LINK',
    ChangeSubGraph = 'CHANGE_SUB_GRAPH',
    DelNode = 'DEL_NODE',
    DelLink = 'DEL_LINK',
    DelSubGraph = 'DEL_SUB_GRAPH',
    SetNodePosition = 'SET_NODE_POSITION',
    JoinRoom = 'JOIN_ROOM',
    RoomInfo = 'ROOM_INFO',
    SetComment = 'SET_COMMENT',
}

export type MessageData = string | Prompt | Vertex | Link | SubGraph

export interface Message<T extends MessageData> {
    event: WSEvent
    data: T
}

export interface Prompt {
    input?: string
    edit_nodes?: EditNode[]
}

export interface EditNode {
    node_id?: string
    title?: string | Vertex | Link | SubGraph
}