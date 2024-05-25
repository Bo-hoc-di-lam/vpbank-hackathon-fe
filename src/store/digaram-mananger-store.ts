import { DiagramManager } from "@/diagram/manager"
import { create } from "zustand"

interface DiagramManagerStore {
    diagramManager: DiagramManager
}

export const useDiagramManagerStore = create<DiagramManagerStore>(() => ({
    diagramManager: new DiagramManager(),
}))

export type ExtractState<S> = S extends {
    getState: () => infer T
}
    ? T
    : never

const diagramManagerSelector = (
    state: ExtractState<typeof useDiagramManagerStore>
) => state.diagramManager

export const useDiagramManager = () =>
    useDiagramManagerStore(diagramManagerSelector)
