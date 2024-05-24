import { create } from "zustand"

interface SelectedNodeStore {
    nodes: string[]
    toggleSelectedNode: (node: string) => void
    clearSelectedNodes: () => void
}

export const useSelectedNodeStore = create<SelectedNodeStore>((set) => ({
    nodes: [],
    toggleSelectedNode: (node: string) =>
        set((state) => ({
            nodes: state.nodes.includes(node)
                ? state.nodes.filter((n) => n !== node)
                : [...state.nodes, node],
        })),
    clearSelectedNodes: () => set(() => ({ nodes: [] })),
}))

export type ExtractState<S> = S extends {
    getState: () => infer T
}
    ? T
    : never

const selectedNodeSelector = (
    state: ExtractState<typeof useSelectedNodeStore>
) => state.nodes

const checkSelectedNodeSelector =
    (nodeId: string) => (state: ExtractState<typeof useSelectedNodeStore>) =>
        state.nodes.includes(nodeId)

export const useSelectedNodes = () => useSelectedNodeStore(selectedNodeSelector)

export const useCheckNodeSelected = (nodeId: string) =>
    useSelectedNodeStore(checkSelectedNodeSelector(nodeId))
