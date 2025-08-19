"use client";
import { Button } from "@/components/ui/button";
import { useNodeConnections } from "@/providers/connections-provider";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  onCreateNodesEdges,
  onFlowPublish,
} from "../_actions/workflow-connections";
import { toast } from "sonner";
import { useEditor } from "@/providers/editor-provider";

type Props = {
  children: React.ReactNode;
  edges: any[];
  nodes: any[];
};

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const { state } = useEditor();
  const pathname = usePathname();
  const [isFlow, setIsFlow] = useState<string[]>([]);
  const { nodeConnection } = useNodeConnections();

  const onFlowAutomation = useCallback(async () => {
    const flow = await onCreateNodesEdges(
      pathname.split("/").pop()!,
      JSON.stringify(state.editor.elements),
      JSON.stringify(state.editor.edges),
      JSON.stringify(isFlow)
    );
    if (flow) toast.message(flow.message);
  }, [state.editor.elements, state.editor.edges, isFlow, pathname]);

  const onPublishWorkflow = useCallback(async () => {
    const response = await onFlowPublish(pathname.split("/").pop()!, true);
    if (response) toast.message(response);
  }, [pathname]);

  const onAutomateFlow = useCallback(() => {
    const flows: string[] = [];
    edges.forEach((edge) => {
      nodes.forEach((node) => {
        if (node.id === edge.target) {
          flows.push(node.type);
        }
      });
    });
    setIsFlow(flows);
  }, [edges, nodes]);

  useEffect(() => {
    onAutomateFlow();
  }, [edges, onAutomateFlow]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button onClick={onFlowAutomation} disabled={isFlow.length < 1}>
          Save
        </Button>
        <Button disabled={isFlow.length < 1} onClick={onPublishWorkflow}>
          Publish
        </Button>
      </div>
      {children}
    </div>
  );
};

export default FlowInstance;
