
export interface DiagramNode {
    id: string
}

export interface Position {
    x: number
    y: number
}

export interface Vertex extends DiagramNode {
    position: Position
    icon?: string
    sub_graph?: string
    id: string
    text: string
    shape: string
}

export interface Link extends DiagramNode {
    from_id: string
    to_id: string
    text?: string
    type: string
}

export interface SubGraph extends DiagramNode {
    id: string
    text?: string
}
