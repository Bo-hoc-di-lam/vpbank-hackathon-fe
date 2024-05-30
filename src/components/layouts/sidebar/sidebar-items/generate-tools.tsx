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
    IconBrandAnsible,
    IconBrandTerraform,
    IconChartDots3,
    IconReload,
    IconShape2
} from "@tabler/icons-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

const AnsibleCode = () => {
    const diagramManager = useDiagramManager()
    const [mermaidAWS, setMermaidAWS] = useState<string>(diagramManager.mermaidAWS)
    const [terraform, setTerraform] = useState<string>(diagramManager.terraform)
    const [ansible, setAnsible] = useState<string>(diagramManager.ansible)
    const [generating, setGenerating] = useState<boolean>(false)
    const [opened, handler] = useDisclosure(false)

    useEffect(() => {
        diagramManager.on(WSEvent.MermaidAWS, (mermaid: string) => {
            setMermaidAWS(mermaid)
        })
        diagramManager.on(WSEvent.SetTerraformAWS, (terraform: string) => {
            setTerraform(terraform)
        })
        diagramManager.on(WSEvent.SetAnsibleAWS, (ansible: string) => {
            setAnsible(ansible)
        })

        diagramManager.on(WSEvent.Done, () => {
            setGenerating(false)
        })
    }, [])

    const handleOpen = () => {
        if (!mermaidAWS.length) {
            toast.error("No AWS diagram found")
            return
        }

        handler.open()
        if (ansible === "") {
            generateAnsible()
            return
        }

    }

    const generateAnsible = () => {
        if (generating) {
            return
        }

        setGenerating(true)
        toast.loading("Generating Ansible Code")
        diagramManager.genAnsible()
    }

    return (
        <>
            <ModalCode
                title="Ansible code"
                data={ansible}
                fileName="ansible.yml"
                handler={handler}
                opened={opened}
                language="yaml"
            />
            <Button.Group>
                <Button
                    fullWidth
                    variant="light"
                    leftSection={<IconBrandAnsible size={20} />}
                    onClick={handleOpen}
                    disabled={mermaidAWS === "" || terraform === ""}
                >
                    Ansible code
                </Button>
                <Button disabled={ansible === ""}>
                    <IconReload size={20} onClick={generateAnsible} />
                </Button>
            </Button.Group>
        </>
    )
}

const MermaidCode = () => {
    const diagramManager = useDiagramManager()
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid)
    const [opened, handler] = useDisclosure(false)

    useEffect(() => {
        diagramManager.on(WSEvent.Mermaid, (mermaid: string) => {
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
                language="mermaid"
            />
            <Button
                fullWidth
                variant="light"
                onClick={handler.open}
                leftSection={<IconChartDots3 size={20} />}
                disabled={codeString === ""}
            >
                {"View Mermaid"}
            </Button>
        </>
    )
}

const TerraformAction = () => {
    const diagramManager = useDiagramManager()
    const [mermaidAWS, setMermaidAWS] = useState<string>(diagramManager.mermaidAWS)
    const [terraform, setTerraform] = useState<string>(diagramManager.terraform)
    const [generating, setGenerating] = useState<boolean>(false)
    const [opened, handler] = useDisclosure(false)

    useEffect(() => {
        diagramManager.on(WSEvent.SetTerraformAWS, (terraform: string) => {
            setTerraform(terraform)
        })

        diagramManager.on(WSEvent.Done, (evt: any) => {
            setGenerating(false)
            if (evt?.event === WSEvent.GenerateCode) {
                handler.open()
            }
        })
        diagramManager.on(WSEvent.MermaidAWS, (mermaid: string) => {
            setMermaidAWS(mermaid)
        })
    }, [])

    const generateTerraform = () => {
        if (generating) {
            return
        }
        setGenerating(true)
        if (!mermaidAWS) {
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

        handler.open()
        if (terraform === "") {
            generateTerraform()
            return
        }

    }

    return (
        <>
            <ModalCode
                title="Terraform code"
                data={terraform}
                fileName="terraform.tf"
                handler={handler}
                opened={opened}
                language="hcl"
            />
            <Button.Group>
                <Button
                    fullWidth
                    variant="light"
                    leftSection={<IconBrandTerraform size={20} />}
                    onClick={handleOpen}
                    disabled={mermaidAWS === "" || generating}
                >
                    {generating ? 'Generating terraform code' : 'Terraform code'}
                </Button>
                <Button disabled={terraform === "" || generating}>
                    <IconReload size={20} onClick={generateTerraform} />
                </Button>
            </Button.Group>
        </>
    )
}

const ExportDrawIO = () => {
    const diagramManager = useDiagramManager()
    const [toastId, setToastId] = useState<string>("")
    const [mermaid, setMermaid] = useState<string>(diagramManager.mermaid)
    const genDrawIO = () => {
        if (!mermaid) {
            toast.error("No diagram found")
            return
        }
        diagramManager.genDrawIO()
        setToastId(toast.loading("Generating DrawIO..."))
    }
    useEffect(() => {
        diagramManager.on(WSEvent.Mermaid, (mermaid: string) => {
            setMermaid(mermaid)
        })
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
            disabled={mermaid == ""}
        >
            Export DrawIO
        </Button>
    )
}

const GenerateTools = () => {
    return (
        <div className="flex flex-col gap-4">
            <MermaidCode />
            <TerraformAction />
            <AnsibleCode />
            <ExportDrawIO />
        </div>
    )
}

export default React.memo(GenerateTools)
