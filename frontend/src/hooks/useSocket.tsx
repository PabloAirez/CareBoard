import { io } from 'socket.io-client';
import { useEffect } from 'react';

export function useSocket(url: string, unitId: number, onUpdate: (data: any) => void) {
  useEffect(() => {
    const socket = io(url);

    socket.emit('join_unit', unitId);

    socket.on('dashboard_update', onUpdate);

    return () => {
      socket.disconnect();
    };
  }, [url, unitId]);
}