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
import { ModalCode } from "@/components/ui/modal_code"

const ViewMermaid = () => {
    const diagramManager = useDiagramManager()
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid)
    const [mermaidModalOpened, mermaidModal] = useDisclosure(false)


    const genDrawIO = () => {
        diagramManager.genDrawIO()
    }
    useEffect(() => {
        diagramManager.on(WSEvent.Done, (data: any) => {
            console.log("mermaid", data)
            if (data.event !== WSEvent.GenerateDrawIO) {
                return
            }
            exportToDrawIO(diagramManager.drawIO)
            toast.success("DrawIO exported successfully")
        })

        diagramManager.on(WSEvent.Mermaid, (mermaid: string) => {
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
            <ModalCode
                opened={mermaidModalOpened}
                handler={mermaidModal}
                title="Mermaid"
                data={codeString}
                fileName="mermaid.mmd"
            />
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
