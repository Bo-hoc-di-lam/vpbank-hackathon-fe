import { Affix, CloseButton, Group, Transition } from "@mantine/core"

interface SidebarDrawerProps {
    show: boolean
    onClose: () => void
    content: {
        children: React.ReactNode
    }
}

const SidebarDrawer = ({ show, onClose, content }: SidebarDrawerProps) => {
    return (
        <Affix position={{ top: 60, left: 60, bottom: 0 }} zIndex={2}>
            <Transition transition="slide-right" mounted={show}>
                {(transitionStyles) => (
                    <div
                        style={transitionStyles}
                        className="w-[300px] bg-white h-full border-r border-[#dee2e6] p-4"
                    >
                        <Group justify="end">
                            <CloseButton onClick={onClose} />
                        </Group>
                        {content.children}
                    </div>
                )}
            </Transition>
        </Affix>
    )
}

export default SidebarDrawer
