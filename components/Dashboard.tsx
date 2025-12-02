import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Cpu, Wifi, Thermometer, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SystemStats } from '../types';
import { generateOptimizationTips } from '../services/geminiService';

interface DashboardProps {
  stats: SystemStats;
  history: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, history }) => {
  const [aiTip, setAiTip] = useState<string>("Analyse du système en cours...");
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    // Generate an AI tip occasionally
    const fetchTip = async () => {
        setLoadingTip(true);
        const tip = await generateOptimizationTips(stats);
        setAiTip(tip);
        setLoadingTip(false);
    };
    
    // Initial fetch
    fetchTip();
    
    // Refresh tip every 60s
    const interval = setInterval(fetchTip, 60000);
    return () => clearInterval(interval);
  }, []); // Dependence on stats omitted to avoid spamming API on every tick

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Tableau de Bord</h2>
          <p className="text-slate-400">Vue d'ensemble de la passerelle IoT</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-900/20 text-green-400 px-3 py-1 rounded-full border border-green-800/50">
          <ShieldCheck size={16} />
          <span className="text-sm font-medium">Système Sécurisé</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="text-slate-400 text-sm font-medium">CPU Usage</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.cpuUsage}%</h3>
            </div>
            <div className={`p-2 rounded-lg ${stats.cpuUsage > 80 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <Cpu size={20} />
            </div>
          </div>
          {/* Decorative bar */}
          <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${stats.cpuUsage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${stats.cpuUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Mémoire</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.memoryUsage}%</h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <ActivityIcon />
            </div>
          </div>
          <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${stats.memoryUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Température</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.temp}°C</h3>
            </div>
            <div className={`p-2 rounded-lg ${stats.temp > 75 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <Thermometer size={20} />
            </div>
          </div>
          <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${stats.temp > 75 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${(stats.temp / 100) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Réseau (Total)</p>
              <h3 className="text-2xl font-bold text-white mt-1">{(stats.networkIn + stats.networkOut).toFixed(1)} Mbps</h3>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wifi size={20} />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 text-xs text-slate-400">
             <span>↓ {stats.networkIn}</span>
             <span>↑ {stats.networkOut}</span>
          </div>
        </div>
      </div>

      {/* Gemini Insight */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={120} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Gemini AI Insight</span>
        </h3>
        <p className="text-slate-300 max-w-2xl leading-relaxed">
           {loadingTip ? "Analyse en cours..." : aiTip}
        </p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Trafic Réseau (Temps Réel)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorNetIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNetOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val} Mb`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="networkIn" stroke="#06b6d4" fillOpacity={1} fill="url(#colorNetIn)" name="Download" />
                <Area type="monotone" dataKey="networkOut" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorNetOut)" name="Upload" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Charge CPU & Température</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="cpuUsage" stroke="#3b82f6" strokeWidth={2} dot={false} name="CPU %" />
                <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={2} dot={false} name="Temp °C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple internal icon component if needed, or import from lucide
const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default Dashboard;
