import {
    ActionIcon,
    AppShell,
    CloseButton,
    Group,
    Stack,
    Title,
    Tooltip,
} from "@mantine/core"
import { IconEdit, IconCode, IconDoor } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import { ManualEdit, GenerateTools, Room } from "./sidebar-items"
import { useAppShell, useNav } from "@/store/app-shell-store"

interface SidebarItem {
    icon: React.ReactNode
    label: string
    chilren: React.ReactNode
}

const Sidebar = () => {
    const sidebarItems = useMemo<SidebarItem[]>(() => {
        return [
            {
                icon: <IconDoor size={24} />,
                label: "Room",
                chilren: <Room />,
            },
            {
                icon: <IconEdit size={24} />,
                label: "Manual edit",
                chilren: <ManualEdit />,
            },
            {
                icon: <IconCode size={24} />,
                label: "Generate Tools",
                chilren: <GenerateTools />,
            },
        ]
    }, [])

    const [_, { open: openNav, close: closeNav }] = useNav()

    const [appShellShowed] = useAppShell()

    const [activeItem, setActiveItem] = useState<SidebarItem | null>(null)

    const handleCloseNav = () => {
        setActiveItem(null)
        closeNav()
    }

    const handleActiveItem = (item: SidebarItem) => {
        if (activeItem === item) {
            handleCloseNav()
            return
        }
        setActiveItem(item)
        openNav()
    }

    return (
        <>
            {appShellShowed && (
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
            )}

            <AppShell.Navbar
                p="md"
                zIndex="10"
                ml={60}
                className="overflow-y-auto"
            >
                <AppShell.Section>
                    <Group justify="space-between">
                        <Title order={4}>{activeItem?.label}</Title>
                        <CloseButton onClick={handleCloseNav} />
                    </Group>
                </AppShell.Section>
                <AppShell.Section my={"md"} grow>
                    {activeItem?.chilren}
                </AppShell.Section>
            </AppShell.Navbar>
        </>
    )
}

export default Sidebar
