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
import ReactMarkdown from 'react-markdown'

interface Message {
    role: string
    message: string
}

const ChatAside = () => {
    const [conversation, setConversation] = useState<Message[]>([])
    const [chat, setChat] = useState<string>("")
    const [messaging, setMessaging] = useState<boolean>(false)

    const chatSectionViewport = useRef<HTMLDivElement>(null)

    const scrollBottom = () => {
        setTimeout(() => {
            chatSectionViewport.current!.scrollTo({
                top: chatSectionViewport.current!.scrollHeight,
                behavior: "smooth",
            })
        }, 100)
    }

    const diagramManager = useDiagramManager()

    const handleChat = (prompt: string) => {
        diagramManager.start(prompt);
        setChat("");
        setMessaging(true);

        setConversation((prevConversation) => [
            ...prevConversation,
            { role: "user", message: prompt },
            { role: "bot", message: "l" },
        ]);

        scrollBottom();
    };

    useEffect(() => {
        diagramManager.onCommentChange((comment) => {
            if (comment !== "") {
                setConversation((prevConversation) => {
                    const newConversation = [...prevConversation];
                    newConversation[newConversation.length - 1] = {
                        role: "bot",
                        message: comment,
                    };
                    return newConversation;
                });
                scrollBottom();
            }
        })

        diagramManager.onDone(() => {
            setMessaging(false);
            setConversation((prevConversation) => [
                ...prevConversation,
                { role: "bot", message: "Done" },
            ]);
            scrollBottom();
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
                    />
                    <ActionIcon
                        aria-label="Send message"
                        size="lg"
                        onClick={() => handleChat(chat)}
                        disabled={messaging}
                    >
                        {messaging ? <Loader size="sm" /> : <IconSend size={20} />}
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
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        />
                    </div>
                </div>
                <div className="chat-header">Chatbot</div>
                <div className="chat-bubble chat-bubble-info flex items-center">
                    {message === "l" ? (
                        // Add loading dots animation here using tailwindcss
                        <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce delay-300"></div>
                        </div>
                    ) : (
                        <span>
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
                <div className="chat-bubble chat-bubble-info">{message}</div>
            </div>
        )
    }
}

export default ChatAside
