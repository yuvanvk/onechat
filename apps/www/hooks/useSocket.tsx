"use client"

import { useEffect, useRef } from "react";

export function useSocket(conversationId: string) {
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8787/api/v1/ai/chat?conversationId=${conversationId}`);
        ws.current = socket;

        return () => {
            if(ws.current) {
                ws.current.close()
                ws.current = null
            }
        }
    }, [conversationId])

    return ws;
}   