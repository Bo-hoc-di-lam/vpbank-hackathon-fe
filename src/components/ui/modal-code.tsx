import { Button, CopyButton, MantineSize, Modal } from "@mantine/core"
import { ReactNode, useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

interface ModalCodeProps extends React.HTMLProps<HTMLDivElement> {
    children?: ReactNode,
    title: string,
    modalSize?: number | string
    data?: string,
    opened: boolean,
    fileName: string,
    handler: { open: () => void, close: () => void }
}

export const ModalCode = ({
    className,
    children,
    opened,
    handler,
    title,
    modalSize = "100%",
    data,
    fileName,
    ...props
}: ModalCodeProps) => {
    const exportToFile = () => {
        const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    return (
        <>
            <Modal
                opened={opened}
                onClose={handler.close}
                size={modalSize}
                title={title}
            >
                <div className="flex gap-2 pb-2">

                    <CopyButton value={data}>
                        {
                            ({ copied, copy }) => (
                                <Button
                                    variant="light"
                                    onClick={copy}
                                    disabled={data === "" || !data}
                                >
                                    {copied ? "Copied to clipboard" : "Copy to clipboard"}
                                </Button>
                            )
                        }
                    </CopyButton>
                    <Button disabled={data === "" || !data} variant="light" onClick={exportToFile}>
                        Export to file
                    </Button>
                </div>
                <SyntaxHighlighter language="auto" wrapLines lineProps={{
                    style: {
                        wordBreak: "break-all",
                        whiteSpace: "pre-wrap",
                    },
                }}>
                    {data}
                </SyntaxHighlighter>
                {children}
            </Modal>

        </>
    )
}