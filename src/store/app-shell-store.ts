import { create } from "zustand";

interface AppShellStore {
    showed: boolean;
    navOpened: boolean;
    sideOpened: boolean;

    showAppShell: () => void;
    hideAppShell: () => void;
    toggleAppShell: () => void;

    openNav: () => void;
    closeNav: () => void;
    toggleNav: () => void;

    openSide: () => void;
    closeSide: () => void;
    toggleSide: () => void;
}

export const useAppShellStore = create<AppShellStore>((set) => ({
    showed: true,
    navOpened: false,
    sideOpened: true,

    showAppShell: () => set(() => ({ showed: true })),
    hideAppShell: () =>
        set(() => ({ showed: false, navOpened: false, sideOpened: false })),
    toggleAppShell: () =>
        set((state) => ({ showed: !state.showed, sideOpened: !state.showed })),

    openNav: () => set(() => ({ navOpened: true })),
    closeNav: () => set(() => ({ navOpened: false })),
    toggleNav: () => set((state) => ({ navOpened: !state.navOpened })),

    openSide: () => set(() => ({ sideOpened: true })),
    closeSide: () => set(() => ({ sideOpened: false })),
    toggleSide: () => set((state) => ({ sideOpened: !state.sideOpened })),
}));

export type ExtractState<S> = S extends {
    getState: () => infer T;
}
    ? T
    : never;

const appShellSelector = (state: ExtractState<typeof useAppShellStore>) => {
    return [
        state.showed,
        {
            show: state.showAppShell,
            hide: state.hideAppShell,
            toggle: state.toggleAppShell,
        },
    ] as const;
};

export const useAppShell = () => useAppShellStore(appShellSelector);

const navSelector = (state: ExtractState<typeof useAppShellStore>) => {
    return [
        state.navOpened,
        {
            open: state.openNav,
            close: state.closeNav,
            toggle: state.toggleNav,
        },
    ] as const;
};

export const useNav = () => useAppShellStore(navSelector);

const sideSelector = (state: ExtractState<typeof useAppShellStore>) => {
    return [
        state.sideOpened,
        {
            open: state.openSide,
            close: state.closeSide,
            toggle: state.toggleSide,
        },
    ] as const;
};

export const useSide = () => useAppShellStore(sideSelector);
