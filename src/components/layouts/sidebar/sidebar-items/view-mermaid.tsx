import { useDiagramManager } from "@/store/digaram-mananger-store"
import { useClipboard, useDisclosure } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import toast from "react-hot-toast"
import { Button, Divider, Modal } from "@mantine/core"

import { exportToDrawIO, exportToMermaidFile } from "@/utils/file"
import { IconCopy, IconFileExport } from "@tabler/icons-react"
import { WSEvent } from "@/type/ws_data"

const ViewMermaid = () => {
    const diagramManager = useDiagramManager()
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid)
    const [mermaidModalOpened, mermaidModal] = useDisclosure(false)


    const genDrawIO = () => {
        diagramManager.genDrawIO()
    }
    useEffect(() => {
        diagramManager.onDone((data) => {
            console.log("mermaid", data)
            if (data.event !== WSEvent.GenerateDrawIO) {
                console.log("not gen")
                return
            }
            exportToDrawIO(diagramManager.drawIO)
            toast.success("DrawIO exported successfully")
        })

        diagramManager.onMermaid((mermaid) => {
            setCodeString(mermaid)
        })

    }, [])



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
                opened={mermaidModalOpened}
                onClose={mermaidModal.close}
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
                onClick={mermaidModal.open}
                disabled={codeString === ""}
            >
                {codeString === ""
                    ? "Please generate first to view"
                    : "View Mermaid Code"}
            </Button>
            <Divider />
            <Button
                fullWidth
                variant="light"
                onClick={genDrawIO}
                disabled={codeString === ""}
            >
                Generate DrawIO
            </Button>
        </div>
    )
}

export default ViewMermaid
