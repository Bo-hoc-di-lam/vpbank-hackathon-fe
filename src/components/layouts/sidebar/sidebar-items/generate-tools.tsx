import { useDiagramManager } from "@/store/digaram-mananger-store"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button, Card, Divider, Modal } from "@mantine/core"
import {
    IconBrandAws,
    IconBrandTerraform,
    IconCopy,
    IconFileExport,
} from "@tabler/icons-react"
import { useClipboard, useDisclosure } from "@mantine/hooks"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
    exportToDrawIO,
    exportToMermaidFile,
    exportToTerraform,
} from "@/utils/file"
import { modals } from "@mantine/modals"
import { WSEvent } from "@/type/ws_data"

const MermaidCodeModal = ({ codeString }: { codeString: string }) => {
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
        <>
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
        </>
    )
}

const MermaidCode = () => {
    const diagramManager = useDiagramManager()
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid)

    useEffect(() => {
        diagramManager.onMermaid((mermaid) => {
            setCodeString(mermaid)
        })
    }, [])

    const handleViewMermaid = () => {
        if (!codeString) {
            toast.error("Generate diagram first")
            return
        }
        modals.open({
            title: "Mermaid Code",
            size: "100%",
            children: <MermaidCodeModal codeString={codeString} />,
        }) // open modal
    }

    return (
        <Button fullWidth variant="light" onClick={handleViewMermaid}>
            View Mermaid Code
        </Button>
    )
}

const TerraFormModal = ({
    terraform,
    generating,
}: {
    terraform: string
    generating: boolean
}) => {
    const clipboard = useClipboard({ timeout: 500 })
    const copyToClipboard = () => {
        if (!terraform) {
            toast.error("No code to copy")
            return
        }

        clipboard.copy(terraform)
        if (clipboard.error) {
            toast.error("Failed to copy to clipboard")
            return
        }
        toast.success("Copied to clipboard")
    }

    const exportToFile = () => {
        if (!terraform) {
            toast.error("No code to export")
            return
        }

        exportToTerraform(terraform)
        toast.success("File exported successfully")
    }
    return (
        <>
            <div className="flex gap-4">
                <Button
                    variant="light"
                    onClick={copyToClipboard}
                    disabled={terraform === "" || generating}
                >
                    Copy to Clipboard
                    <IconCopy size={16} />
                </Button>
                <Button
                    variant="light"
                    onClick={exportToFile}
                    disabled={terraform === "" || generating}
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
                {terraform}
            </SyntaxHighlighter>
        </>
    )
}

const TerraformAction = () => {
    const diagramManager = useDiagramManager()
    const [terraform, setTerraform] = useState<string>(diagramManager.terraform)
    const [generating, setGenerating] = useState<boolean>(false)

    useEffect(() => {
        diagramManager.onTerraform((terraform) => {
            setTerraform(terraform)
        })

        diagramManager.onDone(() => {
            setGenerating(false)
        })
    }, [])

    const generateTerraform = () => {
        setGenerating(true)
        if (!diagramManager.mermaid) {
            toast.error("No diagram found")
            return
        }

        toast.loading("Generating Terraform Code")
        diagramManager.genTerraform()
    }

    const handleOpen = () => {
        if (!diagramManager.nodesAWS.length) {
            toast.error("No AWS diagram found")
            return
        }

        if (terraform === "") {
            generateTerraform()
        }

        modals.open({
            title: "Terraform Code",
            size: "100%",
            children: (
                <TerraFormModal terraform={terraform} generating={generating} />
            ),
        }) // open modal
    }

    return (
        <Button
            fullWidth
            variant="light"
            rightSection={<IconBrandTerraform size={20} />}
            onClick={handleOpen}
        >
            Generate Terraform Code
        </Button>
    )
}

const ExportDrawIO = () => {
    const [toastId, setToastId] = useState<string>("")
    const diagramManager = useDiagramManager()
    const genDrawIO = () => {
        if (!diagramManager.mermaid) {
            toast.error("No diagram found")
            return
        }
        diagramManager.genDrawIO()
        setToastId(toast.loading("Generating DrawIO..."))
    }
    useEffect(() => {
        diagramManager.onDone((data) => {
            console.log("mermaid", data)
            if (data.event !== WSEvent.GenerateDrawIO) {
                return
            }
            exportToDrawIO(diagramManager.drawIO)
            toast.dismiss(toastId)
            toast.success("DrawIO exported successfully")
        })
    }, [])
    return (
        <Button fullWidth variant="light" onClick={genDrawIO}>
            Export DrawIO
        </Button>
    )
}

const GenerateTools = () => {
    return (
        <div className="flex flex-col gap-4">
            <TerraformAction />
            <MermaidCode />
            <ExportDrawIO />
        </div>
    )
}

export default GenerateTools
