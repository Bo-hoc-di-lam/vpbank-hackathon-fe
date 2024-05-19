import { ActionIcon, Stack, Tooltip } from "@mantine/core"
import { Icon12Hours, IconAccessPoint } from "@tabler/icons-react"
import useSidebarDrawer from "../../../hooks/use-sidebar-drawer"
import { useMemo } from "react"

interface SidebarItem {
    icon: React.ReactNode
    label: string
    chilren: React.ReactNode
}

const Sidebar = () => {
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

    const sidebarDrawer = useSidebarDrawer()
    return (
        <Stack gap={16}>
            {sidebarItems.map((item, index) => (
                <Tooltip
                    key={index}
                    label={item.label}
                    position="right"
                    withArrow
                >
                    <ActionIcon
                        onClick={() =>
                            sidebarDrawer.show({ children: item.chilren })
                        }
                        aria-label={item.label}
                    >
                        {item.icon}
                    </ActionIcon>
                </Tooltip>
            ))}
        </Stack>
    )
}

export default Sidebar
