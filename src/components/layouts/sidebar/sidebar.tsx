import {
    ActionIcon,
    AppShell,
    CloseButton,
    Stack,
    Tooltip,
} from "@mantine/core"
import { Icon12Hours, IconAccessPoint } from "@tabler/icons-react"
import { useMemo, useState } from "react"

interface SidebarProps {
    openSidebar: () => void
    closeSidebar: () => void
}

interface SidebarItem {
    icon: React.ReactNode
    label: string
    chilren: React.ReactNode
}

const Sidebar = ({ openSidebar, closeSidebar }: SidebarProps) => {
    const sidebarItems = useMemo<SidebarItem[]>(() => {
        return [
            {
                icon: <Icon12Hours size={24} />,
                label: "Time",
                chilren: <div>Time</div>,
            },
            {
                icon: <IconAccessPoint size={24} />,
                label: "Network",
                chilren: <div>Network</div>,
            },
        ]
    }, [])

    const [activeItem, setActiveItem] = useState<SidebarItem | null>(null)

    const handleActiveItem = (item: SidebarItem) => {
        if (activeItem === item) {
            setActiveItem(null)
            closeSidebar()
            return
        }
        setActiveItem(item)
        openSidebar()
    }

    return (
        <>
            <div className="fixed top-[60px] left-0 bottom-0 bg-white w-[60px] z-20 p-4 border-r border-[#dee2e6]">
                <Stack gap={16}>
                    {sidebarItems.map((item, index) => (
                        <Tooltip
                            key={index}
                            label={item.label}
                            position="right"
                            withArrow
                        >
                            <ActionIcon
                                aria-label={item.label}
                                onClick={() => handleActiveItem(item)}
                            >
                                {item.icon}
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </Stack>
            </div>
            <AppShell.Navbar p="md" zIndex="10" ml={60}>
                {activeItem?.chilren}
            </AppShell.Navbar>
        </>
    )
}

export default Sidebar
