import { createContext, useState } from "react"
import SidebarDrawer from "../components/layouts/sidebar/sidebar-drawer"
import { useDisclosure } from "@mantine/hooks"

interface Content {
    children: React.ReactNode
}

export const SidebarDrawerContext = createContext(
    {} as {
        show: (content: Content) => void
        hide: () => void
    }
)

const SidebarDrawerProvider = ({ children }: { children: React.ReactNode }) => {
    const [showDrawer, handlers] = useDisclosure(false)
    const [content, setContent] = useState<Content>({
        children: null,
    })

    const show = ({ children }: Content) => {
        setContent({ children })
        handlers.open()
    }

    const hide = () => {
        handlers.close()
        setContent({ children: null })
    }

    const sidebarDrawer = { show, hide }

    return (
        <SidebarDrawerContext.Provider value={sidebarDrawer}>
            <SidebarDrawer show={showDrawer} onClose={hide} content={content} />
            {children}
        </SidebarDrawerContext.Provider>
    )
}

export default SidebarDrawerProvider
