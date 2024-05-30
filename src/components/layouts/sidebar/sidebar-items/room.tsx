import { useDiagramManager } from "@/store/digaram-mananger-store";
import { WSEvent } from "@/type/ws_data";
import { ActionIcon, Button, CopyButton, Input, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconDoor } from "@tabler/icons-react";
import { useState } from "react";
import toast from "react-hot-toast";



const Room = () => {

    const [nameplate, setNameplate] = useState<string>("");

    const diagramManager = useDiagramManager();

    const [currentNameplate, setCurrentNameplate] = useState<string>(diagramManager.nameplate);

    diagramManager.on(WSEvent.RoomInfo, (roomToJoin: string) => {
        setCurrentNameplate(roomToJoin);
        if (roomToJoin === nameplate) {
            setNameplate("");
        }
    })

    const joinRoom = () => {
        diagramManager.joinRoom(nameplate);
    }

    return (
        <div className="flex flex-col gap-4">
            <Input
                readOnly
                value={currentNameplate}
                leftSection={
                    <IconDoor size={16} />
                }
                rightSectionPointerEvents="all"

                rightSection={
                    <CopyButton value={currentNameplate} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                    {copied ? (
                                        <IconCheck size={16} />
                                    ) : (
                                        <IconCopy size={16} />
                                    )}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                }

            ></Input>
            <TextInput
                label="Nameplate"
                description="Place nameplate of your friend's room here!"
                placeholder="Room nameplate"
                value={nameplate}
                onChange={(event) => setNameplate(event.currentTarget.value)}
            />
            <Button variant="light" fullWidth onClick={joinRoom} disabled={nameplate === "" || nameplate === currentNameplate} >
                {nameplate === currentNameplate ? "Already joined" : "Join"}
            </Button>
        </div>
    )
}

export default Room