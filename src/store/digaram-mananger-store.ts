import { DiagramManager } from "@/diagram/manager"
import { create } from "zustand"

interface DiagramManagerStore {
    diagramManager: DiagramManager | null
}

export const useDiagramManagerStore = create<DiagramManagerStore>(() => ({
    diagramManager: null,
}))

export type ExtractState<S> = S extends {
    getState: () => infer T
}
    ? T
    : never

const diagramManagerSelector = (
    state: ExtractState<typeof useDiagramManagerStore>
) => state.diagramManager

export const useDiagramManager = () => {
    const store = useDiagramManagerStore.getState()
    if (!store.diagramManager) {
        store.diagramManager = new DiagramManager()
    }
    return store.diagramManager
}
