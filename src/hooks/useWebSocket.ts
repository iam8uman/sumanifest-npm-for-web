import { useState, useEffect, useCallback, useRef } from 'react';

export function useWebSocket<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const sendMessage = useCallback((message: string) => {
    if (isConnected && ws.current) {
      ws.current.send(message);
    }
  }, [isConnected]);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);
    ws.current.onerror = (event) => setError(new Error('WebSocket error'));
    ws.current.onmessage = (event) => setData(JSON.parse(event.data));

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return { data, isConnected, error, sendMessage };
}