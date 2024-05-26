import { useDiagramManager } from '@/store/digaram-mananger-store';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from "@mantine/core";

const AWSAction = () => {
	const diagramManager = useDiagramManager();

	const generateAWS = () => {
		if (!diagramManager.mermaid) {
			toast.error("No diagram found");
			return;
		}

		diagramManager.genAWS();
	};


    return (
        <div className="flex flex-col gap-4">
            <Button
                fullWidth
                variant="light"
				onClick={generateAWS}
            >
                Generate AWS Service
            </Button>
        </div>
    );
};

export default AWSAction;
