'use client';

import { 
  Shield, 
  AlertCircle, 
  Building2, 
  FileText, 
  DollarSign,
  Users,
  Clock,
  Download,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  metrics: any;
  selectedIncident: any;
  onExport: () => void;
}

export function Sidebar({ metrics, selectedIncident, onExport }: SidebarProps) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const downloadSample = async () => {
    const response = await fetch(`${API_BASE}/api/export/sample`);
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_incidents.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <aside className="w-[380px] h-full glass-panel border-l border-cyber-border flex flex-col overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Section A - Core Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-cyber-cyan" />
            <p className="text-[10px] tracking-wider text-cyber-tx3 font-mono">
              SECTION A — INTELLIGENCE METRICS
            </p>
          </div>
          
          <h1 className="text-xl font-semibold text-white mb-1">
            Cyber Risk Dashboard
          </h1>
          <p className="text-sm text-cyber-tx2 mb-5">
            Public disclosure & incident tracking
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<AlertTriangle className="w-3.5 h-3.5" />}
              label="Total Incidents"
              value={metrics?.total_incidents?.toLocaleString() || '0'}
              color="cyan"
            />
            <StatCard
              icon={<AlertCircle className="w-3.5 h-3.5" />}
              label="Critical Incidents"
              value={metrics?.critical_incidents || '0'}
              color="red"
            />
            <StatCard
              icon={<Building2 className="w-3.5 h-3.5" />}
              label="Companies Affected"
              value={metrics?.unique_companies || '0'}
              color="indigo"
            />
            <StatCard
              icon={<Users className="w-3.5 h-3.5" />}
              label="Records Exposed"
              value={metrics ? `${(metrics.total_affected_records / 1000000).toFixed(1)}M` : '0'}
              color="yellow"
            />
          </div>
        </div>
        
        {/* Section B - Why This Matters */}
        <div className="border-t border-cyber-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-cyber-yellow" />
            <p className="text-[10px] tracking-wider text-cyber-tx3 font-mono">
              SECTION B — WHY THIS MATTERS
            </p>
          </div>
          
          <p className="text-sm text-cyber-tx2 leading-relaxed">
            Cyber incidents are now material events requiring public disclosure under SEC rules. 
            Tracking these disclosures provides critical intelligence on sector risk patterns, 
            response effectiveness, and governance quality. Investors and allocators use this 
            data to assess cybersecurity posture and regulatory compliance.
          </p>
          
          <div className="mt-3 p-3 bg-cyber-red/5 border border-cyber-red/20 rounded">
            <p className="text-xs text-cyber-tx3">
              <span className="text-cyber-red font-mono">⚠ KEY INSIGHT</span><br/>
              Average response time: <span className="text-cyber-cyan">{metrics?.avg_response_time || 0} days</span><br/>
              Estimated regulatory fines: <span className="text-cyber-yellow">${((metrics?.regulatory_fines || 0) / 1000000).toFixed(0)}M</span>
            </p>
          </div>
        </div>
        
        {/* Section C - Who Controls the Rail */}
        <div className="border-t border-cyber-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-3.5 h-3.5 text-cyber-cyan" />
            <p className="text-[10px] tracking-wider text-cyber-tx3 font-mono">
              SECTION C — WHO CONTROLS THE RAIL
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-cyber-tx2">SEC EDGAR Database</span>
              <span className="font-mono text-cyber-cyan">Filing Source</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-cyber-tx2">GDELT News Feed</span>
              <span className="font-mono text-cyber-cyan">Media Monitor</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-cyber-tx2">CISA Alerts</span>
              <span className="font-mono text-cyber-cyan">Govt Intel</span>
            </div>
          </div>
          
          <div className="mt-3 pt-2 text-[10px] text-cyber-tx3">
            Data sources: SEC EDGAR, GDELT (synthetic for demo)
          </div>
        </div>
        
        {/* Section D - Response Metrics */}
        <div className="border-t border-cyber-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
            <p className="text-[10px] tracking-wider text-cyber-tx3 font-mono">
              SECTION D — RESPONSE METRICS
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-cyber-tx2">Avg Response Time</span>
              <span className="text-xs font-mono text-cyber-cyan">{metrics?.avg_response_time || 0} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-cyber-tx2">Cyber Insurance Claims</span>
              <span className="text-xs font-mono text-cyber-yellow">{metrics?.cyber_insurance_claims?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-cyber-tx2">Regulatory Fines</span>
              <span className="text-xs font-mono text-cyber-red">${((metrics?.regulatory_fines || 0) / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
        
        {/* Section E - Data Controls */}
        <div className="border-t border-cyber-border pt-5">
          <p className="text-[10px] tracking-wider text-cyber-tx3 font-mono mb-3">
            SECTION E — DATA CONTROLS
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onExport}
              className="flex-1 flex items-center justify-center gap-1.5 font-mono text-[11px] border border-cyber-border text-cyber-tx2 px-3 py-2 rounded hover:border-cyber-cyan hover:text-cyber-cyan transition"
            >
              <Download className="w-3 h-3" />
              EXPORT
            </button>
            
            <button
              onClick={downloadSample}
              className="flex-1 font-mono text-[11px] border border-cyber-border text-cyber-tx2 px-3 py-2 rounded hover:border-cyber-cyan hover:text-cyber-cyan transition"
            >
              SAMPLE
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colorClasses: Record<string, string> = {
    cyan: 'text-cyber-cyan',
    red: 'text-cyber-red',
    indigo: 'text-cyber-indigo',
    yellow: 'text-cyber-yellow',
  };
  
  return (
    <div className="glass-panel rounded p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <div className={`${colorClasses[color]}`}>{icon}</div>
        <p className="text-[9px] font-mono text-cyber-tx3 uppercase">{label}</p>
      </div>
      <p className={`text-lg font-semibold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}