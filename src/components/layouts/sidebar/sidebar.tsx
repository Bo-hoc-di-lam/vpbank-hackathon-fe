import { ActionIcon, AppShell, Stack, Title, Tooltip } from "@mantine/core"
import { IconEdit, IconChartBar } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import { ManualEdit, ViewMermaid } from "./sidebar-items"

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
                icon: <IconEdit size={24} />,
                label: "Manual edit",
                chilren: <ManualEdit />,
            },
            {
                icon: <IconChartBar size={24} />,
                label: "View Mermaid Code",
                chilren: <ViewMermaid />,
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
                            disabled={activeItem === item}
                        >
                            <ActionIcon
                                aria-label={item.label}
                                onClick={() => handleActiveItem(item)}
                                variant={
                                    activeItem === item
                                        ? "filled"
                                        : "transparent"
                                }
                            >
                                {item.icon}
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </Stack>
            </div>
            <AppShell.Navbar p="md" zIndex="10" ml={60} className="overflow-y-auto">
                <AppShell.Section>
                    <Title order={4}>{activeItem?.label}</Title>
                </AppShell.Section>
                <AppShell.Section my={"md"} grow>
                    {activeItem?.chilren}
                </AppShell.Section>
            </AppShell.Navbar>
        </>
    )
}

export default Sidebar
