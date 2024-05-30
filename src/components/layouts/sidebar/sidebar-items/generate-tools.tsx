import { ModalCode } from "@/components/ui/modal-code"
import { useDiagramManager } from "@/store/digaram-mananger-store"
import { WSEvent } from "@/type/ws_data"
import {
    exportToDrawIO
} from "@/utils/file"
import {
    Button
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
    IconBrandTerraform,
    IconChartDots3,
    IconReload,
    IconShape2
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const MermaidCode = () => {
    const diagramManager = useDiagramManager()
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid)
    const [opened, handler] = useDisclosure(false)

    useEffect(() => {
        diagramManager.on(WSEvent.Mermaid, (mermaid) => {
            setCodeString(mermaid)
        })
    }, [])

    return (
        <>
            <ModalCode
                title="Mermaid code"
                data={codeString}
                fileName="mermaid.mmd"
                handler={handler}
                opened={opened}
                disabled={codeString === ""}
            />
            <Button
                fullWidth
                variant="light"
                onClick={handler.open}
                leftSection={<IconChartDots3 size={20} />}
            >
                {codeString === "" ? "Please prompt first" : "View Mermaid"}
            </Button>
        </>
    )
}

const TerraformAction = () => {
    const diagramManager = useDiagramManager()
    const [terraform, setTerraform] = useState<string>(diagramManager.terraform)
    const [generating, setGenerating] = useState<boolean>(false)
    const [opened, handler] = useDisclosure(false)

    useEffect(() => {
        diagramManager.on(WSEvent.SetTerraformAWS, (terraform: string) => {
            setTerraform(terraform)
        })

        diagramManager.on(WSEvent.Done, () => {
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
            return
        }

        handler.open()
    }

    return (
        <>
            <ModalCode
                title="Terraform code"
                data={terraform}
                fileName="terraform.tf"
                handler={handler}
                opened={opened}
            />
            <Button.Group>
                <Button
                    fullWidth
                    variant="light"
                    leftSection={<IconBrandTerraform size={20} />}
                    onClick={handleOpen}
                >
                    Terraform code
                </Button>
                <Button disabled={terraform === ""}>
                    <IconReload size={20} onClick={generateTerraform} />
                </Button>
            </Button.Group>
        </>
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
        diagramManager.on(WSEvent.Done, (data) => {
            if (data.event !== WSEvent.GenerateDrawIO) {
                return
            }
            exportToDrawIO(diagramManager.drawIO)
            toast.dismiss(toastId)
            toast.success("DrawIO exported successfully")
        })
    }, [])
    return (
        <Button
            fullWidth
            variant="light"
            onClick={genDrawIO}
            leftSection={<IconShape2 size={20} />}
        >
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
