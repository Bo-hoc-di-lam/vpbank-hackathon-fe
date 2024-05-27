import { useDiagramManager } from '@/store/digaram-mananger-store';
import { useClipboard } from "@mantine/hooks"
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import { Button } from "@mantine/core";

import { exportToMermaidFile } from '@/utils/file';

const ViewMermaid = () => {
    const diagramManager = useDiagramManager();
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid);

    diagramManager.onMermaid((mermaid) => {
        setCodeString(mermaid);
    });

    const clipboard = useClipboard({ timeout: 500 })

    const copyToClipboard = () => {
        if (!codeString) {
            toast.error('No code to copy');
            return;
        }

        clipboard.copy(codeString)
        if (clipboard.error) {
            toast.error("Failed to copy to clipboard")
            return
        }
        toast.success("Copied to clipboard")
    };

    const exportToFile = () => {
        if (!codeString) {
            toast.error('No code to export');
            return;
        }

        exportToMermaidFile(codeString);
        toast.success('File exported successfully');
    };

    return (
        <div className="flex flex-col gap-4">
            <SyntaxHighlighter language="plaintext" style={dracula} wrapLines={true}
                lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}>
                {codeString}
            </SyntaxHighlighter>
            <Button
                fullWidth
                variant="light"
                onClick={copyToClipboard}
            >
                Copy to Clipboard
            </Button>
            <Button
                fullWidth
                variant="light"
                onClick={exportToFile}
            >
                Export to File
            </Button>
        </div>
    );
};

export default ViewMermaid;
