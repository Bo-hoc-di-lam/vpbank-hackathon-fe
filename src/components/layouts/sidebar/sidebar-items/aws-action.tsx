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
import { exportToTerraform } from "@/utils/file"

const AWSAction = () => {
    const diagramManager = useDiagramManager()
    const [opened, { open, close }] = useDisclosure(false)
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

    const generateAWS = () => {
        if (!diagramManager.mermaid) {
            toast.error("No diagram found")
            return
        }

        // check if isGenerating
        // if (diagramManager.isGenerating) {
        //     toast.error("Generating in progress");
        //     return;
        // }

        toast.loading("Generating AWS Service")
        diagramManager.genAWS()

        // toast.success("AWS Service generated");
    }

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
        <div className="flex flex-col gap-4">
            <Button
                fullWidth
                variant="light"
                onClick={generateAWS}
                rightSection={<IconBrandAws size={20} />}
            >
                Generate AWS Service
            </Button>
            {/* <Button
                fullWidth
                variant="light"
                onClick={generateTerraform}
                rightSection={<IconBrandTerraform size={20} />}
            >
                Generate Terraform Code
            </Button> */}
            <Button
                fullWidth
                variant="light"
                rightSection={<IconBrandTerraform size={20} />}
                onClick={() => {
                    if (diagramManager.mermaid) open()
                    if (terraform === "") generateTerraform()
                }}
            // disabled={terraform === "" || generating}
            >
                {/* {terraform === "" ? "Please generate first to view" : "View Terraform Code"} */}
                Generate Terraform Code
            </Button>
            <Modal
                opened={opened}
                onClose={close}
                title="Terraform Code"
                size="100%"
            >
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
            </Modal>
        </div>
    )
}

export default AWSAction
