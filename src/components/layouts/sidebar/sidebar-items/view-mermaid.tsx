import { useDiagramManager } from "@/store/digaram-mananger-store"
import { useClipboard, useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import toast from "react-hot-toast"
import { Button, Modal } from "@mantine/core"

import { exportToMermaidFile } from "@/utils/file"
import { IconCopy, IconFileExport } from "@tabler/icons-react"

const ViewMermaid = () => {
    const diagramManager = useDiagramManager()
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid)
    const [modalOpened, { open, close }] = useDisclosure(false)

    diagramManager.onMermaid((mermaid) => {
        setCodeString(mermaid)
    })

    const clipboard = useClipboard({ timeout: 500 })

    const copyToClipboard = () => {
        if (!codeString) {
            toast.error("No code to copy")
            return
        }

        clipboard.copy(codeString)
        if (clipboard.error) {
            toast.error("Failed to copy to clipboard")
            return
        }
        toast.success("Copied to clipboard")
    }

    const exportToFile = () => {
        if (!codeString) {
            toast.error("No code to export")
            return
        }

        exportToMermaidFile(codeString)
        toast.success("File exported successfully")
    }

    return (
        <div className="flex flex-col gap-4">
            <Modal
                opened={modalOpened}
                onClose={close}
                title="Mermaid"
                size="100%"
            >
                <div className="flex gap-4">
                    <Button
                        variant="light"
                        onClick={copyToClipboard}
                        disabled={codeString === ""}
                    >
                        Copy to Clipboard
                        <IconCopy size={16} />
                    </Button>
                    <Button
                        variant="light"
                        onClick={exportToFile}
                        disabled={codeString === ""}
                    >
                        Export to File
                        <IconFileExport size={16} />
                    </Button>
                </div>
                <SyntaxHighlighter
                    language="plaintext"
                    style={dracula}
                    wrapLines={true}
                    lineProps={{
                        style: {
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                        },
                    }}
                >
                    {codeString}
                </SyntaxHighlighter>
            </Modal>
            <Button
                fullWidth
                variant="light"
                onClick={open}
                disabled={codeString === ""}
            >
                {codeString === ""
                    ? "Please generate first to view"
                    : "View Mermaid Code"}
            </Button>
        </div>
    )
}

export default ViewMermaid
