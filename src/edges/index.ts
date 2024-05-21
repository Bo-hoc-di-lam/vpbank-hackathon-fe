import type { Edge, EdgeTypes } from "reactflow"

export const initialEdges = [
    // Client to API Gateway
    { id: "A->B", source: "A", target: "B" },

    // API Gateway to APIs
    { id: "B->C", source: "B", target: "C" },
    { id: "B->D", source: "B", target: "D" },
    { id: "B->E", source: "B", target: "E" },
    { id: "B->F", source: "B", target: "F" },
    { id: "B->G", source: "B", target: "G" },

    // APIs to their respective Databases
    { id: "C->H", source: "C", target: "H" },
    { id: "D->I", source: "D", target: "I" },
    { id: "E->J", source: "E", target: "J" },
    { id: "F->K", source: "F", target: "K" },
    { id: "G->L", source: "G", target: "L" },

    // Interactions between services and databases
    { id: "D->H", source: "D", target: "H" },
    { id: "D->G", source: "D", target: "G" },
    { id: "E->J", source: "E", target: "J" },
    { id: "E->G", source: "E", target: "G" },
] satisfies Edge[]

export const edgeTypes = {
    // Add your custom edge types here!
} satisfies EdgeTypes
