import React from 'react';
import { LayoutDashboard, Server, ShieldAlert, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'devices', label: 'Appareils IoT', icon: Server },
    { id: 'security', label: 'Journal Sécurité', icon: ShieldAlert },
    { id: 'system', label: 'Système & Réseau', icon: Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <ShieldAlert className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">SecureGate</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 text-slate-500 hover:text-slate-300 transition-colors px-4 py-2 w-full">
          <Settings size={18} />
          <span className="text-sm">Configuration</span>
        </button>
        <div className="mt-4 px-4 py-2 bg-slate-950 rounded border border-slate-800">
          <p className="text-xs text-slate-500">Firmware</p>
          <p className="text-xs font-mono text-cyan-500">v2.4.1-stable</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
