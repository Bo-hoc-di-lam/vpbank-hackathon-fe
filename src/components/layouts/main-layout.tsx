import { ActionIcon, AppShell, Group } from "@mantine/core"
import { useDisclosure, useDocumentTitle } from "@mantine/hooks"
import { IconMessageCircle, IconX } from "@tabler/icons-react"
import { Sidebar } from "./sidebar"
import { Link } from "react-router-dom"
import { ChatAside } from "./aside"

interface MainLayoutProps {
    title?: string
    sidebar?: boolean
    children?: React.ReactNode
}

export function MainLayout({
    title = "VPBank Hackathon",
    sidebar,
    children,
}: MainLayoutProps) {
    const [chatOpened, { toggle: toggleChat }] = useDisclosure(true)

    useDocumentTitle(title)

    return (
        <>
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 60,
                    breakpoint: "sm",
                }}
                aside={{
                    width: 500,
                    breakpoint: "md",
                    collapsed: { desktop: !chatOpened, mobile: true },
                }}
                padding="md"
                className="h-full"
            >
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Link to="/">This is LOGO</Link>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md">
                    {sidebar && <Sidebar />}
                </AppShell.Navbar>
                <AppShell.Main className="h-full">{children}</AppShell.Main>
                <AppShell.Aside p="md">
                    <div className="absolute -left-8 rounded-l-xl overflow-hidden">
                        <ActionIcon
                            variant="filled"
                            radius={0}
                            aria-label="Settings"
                            onClick={toggleChat}
                            size={32}
                        >
                            {chatOpened ? (
                                <IconX size={20} />
                            ) : (
                                <IconMessageCircle size={20} />
                            )}
                        </ActionIcon>
                    </div>
                    <ChatAside />
                </AppShell.Aside>
            </AppShell>
        </>
    )
}

export default MainLayout
