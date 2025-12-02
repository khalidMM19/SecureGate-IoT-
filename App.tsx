import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SecurityLogPanel from './components/SecurityLog';
import DeviceList from './components/DeviceList';
import { Device, DeviceStatus, DeviceType, SecurityLog, SecuritySeverity, SystemStats } from './types';

// Mock Initial Data
const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'Main Gateway', ip: '192.168.1.1', mac: 'AA:BB:CC:DD:EE:01', type: DeviceType.GATEWAY, status: DeviceStatus.ONLINE, lastSeen: 'Now', firmware: '2.4.1' },
  { id: '2', name: 'Temp Sensor Hall', ip: '192.168.1.10', mac: 'AA:BB:CC:DD:EE:02', type: DeviceType.SENSOR, status: DeviceStatus.ONLINE, lastSeen: '2m ago', firmware: '1.0.5' },
  { id: '3', name: 'Ext Camera Front', ip: '192.168.1.15', mac: 'AA:BB:CC:DD:EE:03', type: DeviceType.CAMERA, status: DeviceStatus.ONLINE, lastSeen: '1m ago', firmware: '3.1.0' },
  { id: '4', name: 'Smart Lock Entry', ip: '192.168.1.20', mac: 'AA:BB:CC:DD:EE:04', type: DeviceType.ACTUATOR, status: DeviceStatus.OFFLINE, lastSeen: '5h ago', firmware: '1.2.0' },
];

const INITIAL_LOGS: SecurityLog[] = [
  { id: '101', timestamp: new Date(Date.now() - 3600000).toISOString(), sourceIp: '192.168.1.15', severity: SecuritySeverity.INFO, event: 'Camera motion detected', protocol: 'RTSP' },
  { id: '102', timestamp: new Date(Date.now() - 7200000).toISOString(), sourceIp: '203.0.113.42', severity: SecuritySeverity.WARNING, event: 'Failed login attempt (root)', protocol: 'SSH' },
  { id: '103', timestamp: new Date(Date.now() - 86400000).toISOString(), sourceIp: 'System', severity: SecuritySeverity.SUCCESS, event: 'Firmware updated successfully', protocol: 'OTA' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [logs, setLogs] = useState<SecurityLog[]>(INITIAL_LOGS);
  
  // Real-time stats simulation
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 24,
    memoryUsage: 45,
    temp: 52,
    networkIn: 12.5,
    networkOut: 4.2
  });
  
  const [statsHistory, setStatsHistory] = useState<any[]>([]);

  // Simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const newCpu = Math.min(100, Math.max(0, prev.cpuUsage + (Math.random() * 10 - 5)));
        const newTemp = Math.min(90, Math.max(30, prev.temp + (Math.random() * 4 - 2)));
        const newNetIn = Math.max(0, prev.networkIn + (Math.random() * 5 - 2.5));
        const newNetOut = Math.max(0, prev.networkOut + (Math.random() * 2 - 1));
        
        return {
          cpuUsage: parseFloat(newCpu.toFixed(1)),
          memoryUsage: prev.memoryUsage, // Keep somewhat static for demo
          temp: Math.floor(newTemp),
          networkIn: parseFloat(newNetIn.toFixed(1)),
          networkOut: parseFloat(newNetOut.toFixed(1))
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update history
  useEffect(() => {
    setStatsHistory(prev => {
      const newHistory = [...prev, { time: new Date().toLocaleTimeString(), ...stats }];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
  }, [stats]);

  const toggleDeviceStatus = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === DeviceStatus.ONLINE ? DeviceStatus.OFFLINE : DeviceStatus.ONLINE };
      }
      return d;
    }));
  };

  const addLog = (log: SecurityLog) => {
    setLogs(prev => [log, ...prev]);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} history={statsHistory} />;
      case 'devices':
        return <DeviceList devices={devices} toggleStatus={toggleDeviceStatus} />;
      case 'security':
        return <SecurityLogPanel logs={logs} addLog={addLog} />;
      default:
        return <div className="text-white">Module en développement</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
