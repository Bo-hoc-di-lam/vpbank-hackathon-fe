import { useContext } from "react"
import { SidebarDrawerContext } from "../context/sidebar-drawer-context"

const useSidebarDrawer = () => {
    const sidebarDrawer = useContext(SidebarDrawerContext)
    return sidebarDrawer
}

export default useSidebarDrawer
