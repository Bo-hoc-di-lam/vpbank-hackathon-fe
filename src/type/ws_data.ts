import { Link, SubGraph, Vertex } from "./diagram"

export enum IconType {
    AWS = 'AWS',
}

export enum WSEvent {
    // info
    Error = 'ERROR',
    UserJoined = "JOIN",
    UserLeave = "LEAVE",
    Lock = "LOCK",
    Done = "DONE",
    Mermaid = "MERMAID",
    RoomInfo = 'ROOM_INFO',
    Reset = "RESET",

    // user action
    Prompt = 'PROMPT',
    PromptEdit = 'PROMPT_EDIT',
    GenerateIcon = 'GENERATE_ICON',
    JoinRoom = 'JOIN_ROOM',


    // server diagram response
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
    SetComment = 'SET_COMMENT',

    // server diagram with icon response
    AddNodeAWS = 'ADD_NODE_AWS',
    AddLinkAWS = 'ADD_LINK_AWS',
    AddSubGraphAWS = 'ADD_SUB_GRAPH_AWS',
    ChangeNodeAWS = 'CHANGE_NODE_AWS',
    ChangeLinkAWS = 'CHANGE_LINK_AWS',
    ChangeSubGraphAWS = 'CHANGE_SUB_GRAPH_AWS',
    DelNodeAWS = 'DEL_NODE_AWS',
    DelLinkAWS = 'DEL_LINK_AWS',
    DelSubGraphAWS = 'DEL_SUB_GRAPH_AWS',
    SetNodePositionAWS = 'SET_NODE_POSITION_AWS',
    SetCommentAWS = 'SET_COMMENT_AWS',


}

export type MessageData = string | Prompt | Vertex | Link | SubGraph | GenerateIcon

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

export interface GenerateIcon {
    type: IconType
}
