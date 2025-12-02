import React, { useState } from 'react';
import { SecurityLog, SecuritySeverity, AiAnalysisResult } from '../types';
import { ShieldAlert, RefreshCw, Search, Lock, AlertCircle, CheckCircle, BrainCircuit, AlertTriangle } from 'lucide-react';
import { analyzeSecurityLogs } from '../services/geminiService';

interface SecurityLogProps {
  logs: SecurityLog[];
  addLog: (log: SecurityLog) => void;
}

const SecurityLogPanel: React.FC<SecurityLogProps> = ({ logs, addLog }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);

  const handleSimulateAttack = () => {
    const attackTypes = [
        { msg: "SSH Brute Force Attempt failed for user 'admin'", port: "SSH (22)" },
        { msg: "Port Scanning detected from external IP", port: "TCP (Various)" },
        { msg: "SQL Injection pattern detected in HTTP request", port: "HTTP (80)" },
        { msg: "Unauthorized access attempt to MQTT broker", port: "MQTT (1883)" }
    ];
    const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    
    const newLog: SecurityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
      event: randomAttack.msg,
      severity: SecuritySeverity.WARNING,
      protocol: randomAttack.port
    };
    addLog(newLog);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysis(null);
    const result = await analyzeSecurityLogs(logs);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Journal de Sécurité</h2>
          <p className="text-slate-400">Surveillance des événements et analyse de menaces</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSimulateAttack}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors flex items-center gap-2 text-sm"
          >
            <AlertCircle size={16} />
            Simuler Attaque
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg shadow-lg shadow-indigo-900/50 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            {analyzing ? <RefreshCw className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
            {analyzing ? 'Analyse IA en cours...' : 'Analyser avec Gemini'}
          </button>
        </div>
      </header>

      {/* AI Analysis Result Panel */}
      {analysis && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
          
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="text-indigo-400" size={20} />
              Rapport d'Analyse IA
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                analysis.threatLevel === 'CRITICAL' || analysis.threatLevel === 'HIGH' 
                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                : analysis.threatLevel === 'MEDIUM' 
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                : 'bg-green-500/20 text-green-400 border-green-500/30'
            }`}>
              MENACE: {analysis.threatLevel}
            </span>
          </div>

          <p className="text-slate-300 mb-4">{analysis.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Recommandations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-200">
                    <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={14} />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Protocoles Affectés</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.affectedProtocols.map((proto, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-300 border border-slate-700 font-mono">
                    {proto}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
                <th className="p-4 font-medium">Horodatage</th>
                <th className="p-4 font-medium">Sévérité</th>
                <th className="p-4 font-medium">Source IP</th>
                <th className="p-4 font-medium">Protocole</th>
                <th className="p-4 font-medium">Événement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {logs.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Aucun log disponible.</td>
                 </tr>
              ) : (
                logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-750 transition-colors text-sm text-slate-300">
                    <td className="p-4 font-mono text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-4">
                        <SeverityBadge level={log.severity} />
                    </td>
                    <td className="p-4 font-mono">{log.sourceIp}</td>
                    <td className="p-4 text-xs font-mono bg-slate-800/0">
                        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">{log.protocol}</span>
                    </td>
                    <td className="p-4">{log.event}</td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SeverityBadge: React.FC<{ level: SecuritySeverity }> = ({ level }) => {
  const styles = {
    [SecuritySeverity.INFO]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    [SecuritySeverity.WARNING]: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    [SecuritySeverity.CRITICAL]: "bg-red-500/10 text-red-400 border-red-500/20",
    [SecuritySeverity.SUCCESS]: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  const icons = {
    [SecuritySeverity.INFO]: <AlertCircle size={12} />,
    [SecuritySeverity.WARNING]: <AlertTriangle size={12} />,
    [SecuritySeverity.CRITICAL]: <ShieldAlert size={12} />,
    [SecuritySeverity.SUCCESS]: <CheckCircle size={12} />,
  };

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border w-fit ${styles[level]}`}>
      {icons[level]}
      {level}
    </span>
  );
};

export default SecurityLogPanel;