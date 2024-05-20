import type { Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from "./PositionLoggerNode";

export const initialNodes = [
  // Client node
  { id: "A", position: { x: 0, y: 0 }, data: { label: "Product Page" } },
  
  // API Gateway node
  { id: "B", position: { x: 200, y: 0 }, data: { label: "API Gateway" } },
  
  // API Gateway nodes
  { id: "C", position: { x: 400, y: 100 }, data: { label: "Item API" } },
  { id: "D", position: { x: 400, y: 50 }, data: { label: "Reviews API" } },
  { id: "E", position: { x: 400, y: 0 }, data: { label: "Recommendations API" } },
  { id: "F", position: { x: 400, y: -50 }, data: { label: "Auth API" } },
  { id: "G", position: { x: 400, y: -100 }, data: { label: "Search API" } },
  
  // Microservices database nodes
  { id: "H", position: { x: 600, y: 100 }, data: { label: "Item API DB" } },
  { id: "I", position: { x: 600, y: 50 }, data: { label: "Reviews API DB" } },
  { id: "J", position: { x: 600, y: 0 }, data: { label: "Recommendations API DB" } },
  { id: "K", position: { x: 600, y: -50 }, data: { label: "Auth API DB" } },
  { id: "L", position: { x: 600, y: -100 }, data: { label: "Search API DB" } },
] satisfies Node[];


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
