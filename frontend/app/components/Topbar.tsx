'use client';

import { Shield, AlertTriangle, Download, TrendingUp } from 'lucide-react';

interface TopbarProps {
  totalIncidents: number;
  criticalIncidents: number;
}

export function Topbar({ totalIncidents, criticalIncidents }: TopbarProps) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  return (
    <header className="h-14 glass-panel border-b border-cyber-border flex items-center px-5 gap-4 shrink-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
        <span className="text-cyber-tx2 text-xs tracking-wider font-mono">
          / REAL RAILS INTELLIGENCE
        </span>
      </div>
      
      <div className="w-px h-5 bg-cyber-border" />
      
      <Shield className="w-4 h-4 text-cyber-cyan" />
      <span className="text-cyber-tx2 text-xs font-mono">
        CYBER INCIDENT DISCLOSURE TRACKER
      </span>
      
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-cyber-red" />
          <span className="font-mono text-[11px] text-cyber-red">
            {criticalIncidents} CRITICAL
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-cyber-cyan" />
          <span className="font-mono text-[11px] text-cyber-cyan">
            {totalIncidents.toLocaleString()} INCIDENTS
          </span>
        </div>
        
        <a
          href={`${API_BASE}/api/export/csv`}
          target="_blank"
          className="flex items-center gap-1.5 font-mono text-[10px] border border-cyber-border text-cyber-tx2 px-2.5 py-1 rounded-sm hover:border-cyber-cyan hover:text-cyber-cyan transition"
        >
          <Download className="w-3 h-3" />
          EXPORT CSV
        </a>
      </div>
    </header>
  );
}