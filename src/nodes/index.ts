import type { Node, NodeTypes } from "reactflow"
import { StadiumShapedNode } from "./StadiumShapedNode"
import { CircleNode } from "./CircleNode"
import { RhombusNode } from "./RhombusNode"
import { CommonNode } from "./CommonNode"

export const initialNodes = [
    {
        "id": "A",
        "type": "common",
        "data": {
            "label": "User Devices"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "C",
        "type": "common",
        "data": {
            "label": "Web Servers"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "E",
        "type": "common",
        "data": {
            "label": "Microservices"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "G",
        "type": "common",
        "data": {
            "label": "Payment Gateway"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "B",
        "type": "common",
        "data": {
            "label": "Load Balancer"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "I",
        "type": "common",
        "data": {
            "label": "Recommendation Engine"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "J",
        "type": "common",
        "data": {
            "label": "Third-Party APIs"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "L",
        "type": "common",
        "data": {
            "label": "NoSQL Database"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "F",
        "type": "common",
        "data": {
            "label": "Authentication Service"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "M",
        "type": "common",
        "data": {
            "label": "Cache"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "D",
        "type": "common",
        "data": {
            "label": "Application Servers"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "H",
        "type": "common",
        "data": {
            "label": ""
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "K",
        "type": "common",
        "data": {
            "label": "Relational Database"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "O",
        "type": "common",
        "data": {
            "label": "Logging Service"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "N",
        "type": "common",
        "data": {
            "label": "Monitoring Service"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    },
    {
        "id": "P",
        "type": "common",
        "data": {
            "label": "Cloud Provider"
        },
        "style": {
            "width": 100,
            "height": 100
        },
        "position": {
            "x": 0,
            "y": 0
        }
    }
] satisfies Node[]

export const nodeTypes = {
    common: CommonNode,
    "stadium-shaped": StadiumShapedNode,
    circle: CircleNode,
    rhombus: RhombusNode,
} satisfies NodeTypes
