import React from 'react';
import { Device, DeviceStatus, DeviceType } from '../types';
import { Monitor, Wifi, WifiOff, Power, MoreVertical, Search, Plus } from 'lucide-react';

interface DeviceListProps {
  devices: Device[];
  toggleStatus: (id: string) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, toggleStatus }) => {
  return (
    <div className="space-y-6">
       <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Appareils Connectés</h2>
          <p className="text-slate-400">Gestion de l'inventaire IoT et statuts</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
            <Plus size={16} />
            Ajouter un appareil
        </button>
      </header>

      {/* Filter/Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Rechercher par nom, IP ou MAC..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-500"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${
                    device.type === DeviceType.GATEWAY ? 'bg-purple-500/20 text-purple-400' : 
                    device.type === DeviceType.CAMERA ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-700 text-slate-400'
                }`}>
                    {device.type === DeviceType.GATEWAY ? <Monitor size={20} /> : <Monitor size={20} />}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{device.name}</h3>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{device.type}</span>
                </div>
              </div>
              <div className="relative">
                <button className="text-slate-500 hover:text-slate-300 p-1">
                    <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">IP Address</span>
                    <span className="text-slate-300 font-mono text-xs">{device.ip}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">MAC Address</span>
                    <span className="text-slate-300 font-mono text-xs">{device.mac}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Firmware</span>
                    <span className="text-slate-300 text-xs">{device.firmware}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${
                    device.status === DeviceStatus.ONLINE ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                    {device.status === DeviceStatus.ONLINE ? <Wifi size={12} /> : <WifiOff size={12} />}
                    {device.status}
                </div>
                
                <button 
                    onClick={() => toggleStatus(device.id)}
                    className="p-2 rounded-lg bg-slate-750 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Toggle Power"
                >
                    <Power size={16} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
