import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  initializeSocket, 
  getSocket, 
  isSocketConnected, 
  realtimeAPI, 
  offlineStorage, 
  networkStatus 
} from '../services/api';

const RealtimeContext = createContext();

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(networkStatus.isOnline());
  const [lastSync, setLastSync] = useState(null);
  const [pendingSync, setPendingSync] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error

  // Initialize socket connection
  const connectSocket = useCallback((agentId) => {
    if (!agentId) return;

    const newSocket = initializeSocket(agentId);
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('✅ RealtimeContext: Connected to backend');
      setIsConnected(true);
      setSyncStatus('idle');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ RealtimeContext: Disconnected from backend');
      setIsConnected(false);
    });

    newSocket.on('call_updated', (data) => {
      console.log('📞 RealtimeContext: Call updated', data);
      // Trigger call data refresh
      window.dispatchEvent(new CustomEvent('callUpdated', { detail: data }));
    });

    newSocket.on('reminder_updated', (data) => {
      console.log('⏰ RealtimeContext: Reminder updated', data);
      // Trigger reminder data refresh
      window.dispatchEvent(new CustomEvent('reminderUpdated', { detail: data }));
    });

    newSocket.on('lead_updated', (data) => {
      console.log('👤 RealtimeContext: Lead updated', data);
      // Trigger lead data refresh
      window.dispatchEvent(new CustomEvent('leadUpdated', { detail: data }));
    });

    newSocket.on('sync_response', (data) => {
      console.log('🔄 RealtimeContext: Sync response received', data);
      handleSyncResponse(data);
    });

    newSocket.on('offline_sync_response', (data) => {
      console.log('📱 RealtimeContext: Offline sync response received', data);
      handleOfflineSyncResponse(data);
    });

    newSocket.on('data_synced', (data) => {
      console.log('✅ RealtimeContext: Data synced', data);
      // Trigger general data refresh
      window.dispatchEvent(new CustomEvent('dataSynced', { detail: data }));
    });

    newSocket.on('sync_error', (error) => {
      console.error('❌ RealtimeContext: Sync error', error);
      setSyncStatus('error');
    });

    newSocket.on('offline_sync_error', (error) => {
      console.error('❌ RealtimeContext: Offline sync error', error);
      setSyncStatus('error');
    });

    newSocket.on('pong', () => {
      // Connection is alive
    });

    return newSocket;
  }, []);

  // Handle sync response
  const handleSyncResponse = useCallback((data) => {
    setLastSync(new Date().toISOString());
    setSyncStatus('idle');
    
    // Store synced data locally
    if (data.updates) {
      Object.keys(data.updates).forEach(key => {
        offlineStorage.store(key, data.updates[key]);
      });
    }
  }, []);

  // Handle offline sync response
  const handleOfflineSyncResponse = useCallback((data) => {
    setLastSync(new Date().toISOString());
    setSyncStatus('idle');
    
    // Clear pending sync data
    setPendingSync([]);
    
    // Clear offline data after successful sync
    if (data.results) {
      Object.keys(data.results).forEach(key => {
        offlineStorage.remove(key);
      });
    }
  }, []);

  // Request sync
  const requestSync = useCallback((type, agentId, since) => {
    if (!isConnected || !socket) {
      console.log('⚠️ RealtimeContext: Cannot sync - not connected');
      return;
    }

    setSyncStatus('syncing');
    realtimeAPI.requestSync({ type, lastSync: since, agentId });
  }, [isConnected, socket]);

  // Send offline sync data
  const sendOfflineSync = useCallback((agentId) => {
    if (!isConnected || !socket) {
      console.log('⚠️ RealtimeContext: Cannot sync - not connected');
      return;
    }

    const offlineData = offlineStorage.getAllOfflineData();
    if (Object.keys(offlineData).length === 0) {
      console.log('📱 RealtimeContext: No offline data to sync');
      return;
    }

    setSyncStatus('syncing');
    realtimeAPI.sendOfflineSync({
      agentId,
      calls: offlineData.calls?.data || [],
      reminders: offlineData.reminders?.data || [],
      leads: offlineData.leads?.data || []
    });
  }, [isConnected, socket]);

  // Store data for offline sync
  const storeForSync = useCallback((type, data) => {
    offlineStorage.store(type, data);
    setPendingSync(prev => [...prev, { type, data, timestamp: new Date().toISOString() }]);
  }, []);

  // Emit real-time updates
  const emitUpdate = useCallback((type, data) => {
    if (isConnected && socket) {
      switch (type) {
        case 'call':
          realtimeAPI.emitCallUpdate(data);
          break;
        case 'reminder':
          realtimeAPI.emitReminderUpdate(data);
          break;
        case 'lead':
          realtimeAPI.emitLeadUpdate(data);
          break;
        default:
          console.warn('⚠️ RealtimeContext: Unknown update type', type);
      }
    } else {
      // Store for offline sync
      storeForSync(type, data);
    }
  }, [isConnected, socket, storeForSync]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 RealtimeContext: Network online');
      setIsOnline(true);
      
      // Attempt to sync offline data when back online
      if (pendingSync.length > 0) {
        const agentId = localStorage.getItem('techbro24_agentId');
        if (agentId) {
          sendOfflineSync(agentId);
        }
      }
    };

    const handleOffline = () => {
      console.log('📱 RealtimeContext: Network offline');
      setIsOnline(false);
    };

    networkStatus.addOnlineListener(handleOnline);
    networkStatus.addOfflineListener(handleOffline);

    return () => {
      networkStatus.removeOnlineListener(handleOnline);
      networkStatus.removeOfflineListener(handleOffline);
    };
  }, [pendingSync.length, sendOfflineSync]);

  // Auto-reconnect when network comes back online
  useEffect(() => {
    if (isOnline && !isConnected) {
      const agentId = localStorage.getItem('techbro24_agentId');
      if (agentId) {
        console.log('🔄 RealtimeContext: Attempting to reconnect...');
        connectSocket(agentId);
      }
    }
  }, [isOnline, isConnected, connectSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Context value
  const value = {
    socket,
    isConnected,
    isOnline,
    lastSync,
    pendingSync,
    syncStatus,
    connectSocket,
    requestSync,
    sendOfflineSync,
    storeForSync,
    emitUpdate,
    getSocket,
    isSocketConnected
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export default RealtimeContext; 