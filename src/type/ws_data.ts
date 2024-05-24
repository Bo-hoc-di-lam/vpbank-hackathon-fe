import { Link, SubGraph, Vertex } from "./diagram"

export enum WSEvent {
    Prompt = 'PROMPT',
    PromptEdit = 'PROMPT_EDIT',
    JoinRoom = 'JOIN_ROOM',
    Error = 'ERROR',
    RoomInfo = 'ROOM_INFO',
    AddNode = 'ADD_NODE',
    DelNode = 'DEL_NODE',
    ChangeNode = 'CHANGE_NODE',
    AddLink = 'ADD_LINK',
    DelLink = 'DEL_LINK',
    ChangeLink = 'CHANGE_LINK',
    AddSubGraph = 'ADD_SUB_GRAPH',
    DelSubGraph = 'DEL_SUB_GRAPH',
    ChangeSubGraph = 'CHANGE_SUB_GRAPH',
    SetNodePosition = 'SET_NODE_POSITION',
    SetComment = 'SET_COMMENT',
}

export interface Message {
    event: WSEvent
    data: any
}

export interface Prompt {
    input?: string
    edit_nodes?: EditNode[]
}

export interface EditNode {
    node_id?: string
    title?: string | Vertex | Link | SubGraph
}