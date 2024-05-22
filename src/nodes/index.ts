import type { Node, NodeTypes } from "reactflow"
import { PositionLoggerNode } from "./PositionLoggerNode"
import { StadiumShapedNode } from "./StadiumShapedNode"
import { CircleNode } from "./CircleNode"
import RhombusNode from "./RhombusNode"

export const initialNodes = [
    {
        id: "A",
        type: "group",
        data: { label: "Hello" },
        position: { x: 0, y: 0 },
        style: {
            width: 400,
            height: 300,
        },
    },
    {
        id: "B",
        type: "default",
        data: { label: "child node 1" },
        position: { x: 10, y: 10 },
        parentNode: "A",
        extent: "parent",
    },
    {
        id: "C",
        type: "rhombus",
        data: { label: "child node 2" },
        position: { x: 10, y: 90 },
        parentNode: "A",
        extent: "parent",
    },
] satisfies Node[]

export const nodeTypes = {
    "position-logger": PositionLoggerNode,
    "stadium-shaped": StadiumShapedNode,
    circle: CircleNode,
    rhombus: RhombusNode,
} satisfies NodeTypes
