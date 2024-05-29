import { useDiagramManager } from "@/store/digaram-mananger-store"
import {
    ActionIcon,
    AppShell,
    Group,
    ScrollArea,
    Textarea,
    Loader,
} from "@mantine/core"
import { IconSend } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import toast from "react-hot-toast"
import { useReactFlow } from "reactflow"

interface Message {
    role: string
    message: string
}

const ChatAside = () => {
    const [conversation, setConversation] = useState<Message[]>([
        { role: "bot", message: "Hi, how can I help you?" },
    ])
    const [chat, setChat] = useState<string>("")
    const [messaging, setMessaging] = useState<boolean>(false)

    const chatSectionViewport = useRef<HTMLDivElement>(null)
    const reactFlow = useReactFlow()

    const scrollBottom = () => {
        setTimeout(() => {
            chatSectionViewport.current!.scrollTo({
                top: chatSectionViewport.current!.scrollHeight,
                behavior: "smooth",
            })
        }, 100)
    }

    const diagramManager = useDiagramManager()

    const handleChat = () => {
        if (chat === "") {
            toast.error("Please enter a message")
            return
        }

        // show toast loading
        toast.loading("Generating diagram...")

        diagramManager.start(chat)
        setChat("")
        setMessaging(true)

        setConversation((prevConversation) => [
            ...prevConversation,
            { role: "user", message: chat },
            { role: "bot", message: "l" },
        ])

        scrollBottom()
    }

    let AWSGenerating = false
    const handleAWSChat = () => {
        if (AWSGenerating) {
            return
        }
        AWSGenerating = true
        setChat("")
        setMessaging(true)

        setConversation((prevConversation) => [
            ...prevConversation,
            { role: "bot", message: "l" },
        ])

        scrollBottom()
    }

    useEffect(() => {
        diagramManager.setHandleAWSChatCallback(handleAWSChat)
        diagramManager.onCommentChange((comment) => {
            if (comment !== "") {
                setConversation((prevConversation) => {
                    const newConversation = [...prevConversation]
                    newConversation[newConversation.length - 1] = {
                        role: "bot",
                        message: comment,
                    }
                    return newConversation
                })
                scrollBottom()
            }
        })

        diagramManager.onDone(() => {
            // hide toast loading
            toast.dismiss()
            setMessaging(false)
            // setConversation((prevConversation) => [
            //     ...prevConversation,
            //     { role: "bot", message: "Done" },
            // ]);
            scrollBottom()
            reactFlow.fitView()
            toast.success("Done!")
        })
    }, [])

    return (
        <>
            <AppShell.Section
                grow
                component={ScrollArea}
                py={16}
                viewportRef={chatSectionViewport}
            >
                <ScrollArea>
                    {conversation.map((message, index) => (
                        <ChatUi key={index} {...message} />
                    ))}
                </ScrollArea>
            </AppShell.Section>
            <AppShell.Section>
                <Group pt={16} align="end">
                    <Textarea
                        className="grow"
                        placeholder="Chat with AI here"
                        autosize
                        minRows={1}
                        maxRows={10}
                        onChange={(e) => setChat(e.currentTarget.value)}
                        value={chat}
                        disabled={messaging}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleChat()
                            }
                        }}
                    />
                    <ActionIcon
                        aria-label="Send message"
                        size="lg"
                        disabled={messaging}
                        onClick={handleChat}
                    >
                        {messaging ? (
                            <Loader size="sm" />
                        ) : (
                            <IconSend size={20} />
                        )}
                    </ActionIcon>
                </Group>
            </AppShell.Section>
        </>
    )
}

const ChatUi = ({ role, message }: Message) => {
    if (role === "bot") {
        return (
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Bot avatar"
                            src="https://www.shutterstock.com/image-vector/chatbot-robo-advisor-adviser-chat-600nw-1222464061.jpg"
                        />
                    </div>
                </div>
                <div className="chat-header">Chatbot</div>
                <div className="chat-bubble chat-bubble-info flex items-center bg-[#228be6]">
                    {message === "l" ? (
                        // Add loading dots animation here using tailwindcss
                        <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-gray-100 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-gray-100 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-gray-100 rounded-full animate-bounce delay-300"></div>
                        </div>
                    ) : (
                        <span className="text-white">
                            <ReactMarkdown>{message}</ReactMarkdown>
                        </span>
                    )}
                </div>
            </div>
        )
    } else {
        return (
            <div className="chat chat-end pr-4">
                <div className="chat-header">You</div>
                <div className="chat-bubble chat-bubble-info bg-[#228be6] text-white">
                    {message}
                </div>
            </div>
        )
    }
}

export default ChatAside
