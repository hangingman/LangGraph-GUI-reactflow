// Node.js

import { memo, useCallback } from 'react';
import NodeLayout from './NodeLayout';

function Node({ data, isConnectable, id, prevs }) {
  const onChangeLabel = useCallback((evt) => {
    data.label = evt.target.value;
  }, [data]);

  const onChangeDescription = useCallback((evt) => {
    data.description = evt.target.value;
  }, [data]);

  return (
    <NodeLayout
      data={data}
      isConnectable={isConnectable}
      onChangeLabel={onChangeLabel}
      onChangeDescription={onChangeDescription}
      prevs={prevs}
    />
  );
}

export const addNode = (nodes, setNodes, nodeIdCounter, setNodeIdCounter, newPosition) => {
  const newNode = {
    id: nodeIdCounter.toString(),
    type: 'textUpdater',
    data: { label: `Node ${nodeIdCounter}`, description: '', nexts: [] },
    position: newPosition,
    prevs: []
  };
  setNodes((nds) => nds.concat(newNode));
  setNodeIdCounter(nodeIdCounter + 1);
};

export const deleteNode = (nodes, setNodes, edges, setEdges, nodeId) => {
  const nodeToDelete = nodes.find((node) => node.id === nodeId);
  if (!nodeToDelete) return;

  // Remove the node itself
  setNodes((nds) => nds.filter((node) => node.id !== nodeId));

  // Remove edges connected to this node
  setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

  // Remove references from other nodes
  setNodes((nds) =>
    nds.map((node) => {
      if (node.data.nexts.includes(nodeId)) {
        return { ...node, data: { ...node.data, nexts: node.data.nexts.filter((id) => id !== nodeId) } };
      }
      if (node.prevs.includes(nodeId)) {
        return { ...node, prevs: node.prevs.filter((id) => id !== nodeId) };
      }
      return node;
    })
  );
};

export default memo(Node);
