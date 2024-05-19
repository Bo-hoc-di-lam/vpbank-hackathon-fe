import { ActionIcon, Stack } from "@mantine/core"
import { Icon12Hours, IconAccessPoint } from "@tabler/icons-react"
import useSidebarDrawer from "../../../hooks/use-sidebar-drawer"

const Sidebar = () => {
    const sidebarDrawer = useSidebarDrawer()
    return (
        <Stack gap={16}>
            <ActionIcon
                onClick={() =>
                    sidebarDrawer.show({
                        children: <div>This is sidebar</div>,
                    })
                }
            >
                <IconAccessPoint />
            </ActionIcon>
            <ActionIcon
                onClick={() =>
                    sidebarDrawer.show({
                        children: <div>Phuong Linh xinh gai</div>,
                    })
                }
            >
                <Icon12Hours />
            </ActionIcon>
        </Stack>
    )
}

export default Sidebar
