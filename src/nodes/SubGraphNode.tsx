// SubGraphNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const SubGraphNode = ({ data }) => {
    const { label, width, height } = data;

    return (
        <div style={{
            border: '1px solid black',
            borderRadius: '5px',
            background: '#f0f0f0',
            width: `${width}px`,
            height: `${height}px`,
            position: 'relative'
        }}>
            <div style={{ padding: '5px' }}>{label}</div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default SubGraphNode;
