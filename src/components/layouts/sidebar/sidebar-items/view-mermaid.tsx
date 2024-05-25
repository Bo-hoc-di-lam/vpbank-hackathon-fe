import { useDiagramManager } from '@/store/digaram-mananger-store';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';



const ViewMermaid = () => {
    const diagramManager = useDiagramManager();
    const [codeString, setCodeString] = useState<string>(diagramManager.mermaid);

    diagramManager.onMermaid((mermaid) => {
        setCodeString(mermaid);
    });

    const copyToClipboard = () => {
        if (!codeString) {
            toast.error('No code to copy');
            return;
        }

        navigator.clipboard.writeText(codeString).then(() => {
            toast.success('Copied to clipboard');
        }, (err) => {
            toast.error('Failed to copy to clipboard');
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <SyntaxHighlighter language="plaintext" style={dracula} wrapLines={true}
                lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}>
                {codeString}
            </SyntaxHighlighter>
            <button
                onClick={copyToClipboard}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Copy to Clipboard
            </button>
        </div>
    );
};

export default ViewMermaid;
