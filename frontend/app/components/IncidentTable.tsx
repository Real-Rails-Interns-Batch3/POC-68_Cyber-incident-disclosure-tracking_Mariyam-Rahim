'use client';

import { ExternalLink, ChevronRight } from 'lucide-react';

interface IncidentTableProps {
  incidents: any[];
  onSelectIncident: (incident: any) => void;
}

export function IncidentTable({ incidents, onSelectIncident }: IncidentTableProps) {
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'severity-critical';
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      default: return 'severity-low';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const formatRecords = (records: number) => {
    if (records >= 1000000) {
      return `${(records / 1000000).toFixed(1)}M`;
    }
    if (records >= 1000) {
      return `${(records / 1000).toFixed(0)}K`;
    }
    return records.toString();
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-cyber-surface border-b border-cyber-border">
          <tr>
            <th className="text-left p-3 text-xs font-mono text-cyber-cyan">Company</th>
            <th className="text-left p-3 text-xs font-mono text-cyber-cyan">Incident Type</th>
            <th className="text-left p-3 text-xs font-mono text-cyber-cyan">Severity</th>
            <th className="text-left p-3 text-xs font-mono text-cyber-cyan">Disclosure Date</th>
            <th className="text-left p-3 text-xs font-mono text-cyber-cyan">Records</th>
            <th className="text-left p-3 text-xs font-mono text-cyber-cyan">Filing</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr 
              key={incident.id} 
              className="border-b border-cyber-border cursor-pointer hover:bg-cyber-cyan/5 transition"
              onClick={() => onSelectIncident(incident)}
            >
              <td className="p-3 text-sm font-medium text-white">{incident.company}</td>
              <td className="p-3 text-sm text-cyber-tx2">{incident.incident_type}</td>
              <td className="p-3">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${getSeverityClass(incident.severity)}`}>
                  {incident.severity}
                </span>
              </td>
              <td className="p-3 text-sm text-cyber-tx2">{formatDate(incident.disclosure_date)}</td>
              <td className="p-3 text-sm text-cyber-tx2">{formatRecords(incident.affected_records)}</td>
              <td className="p-3">
                <button
                  onClick={() => {
                    alert(`SEC Filing: ${incident.filing_type}\n\nThis is a synthetic demo link.\nTo view real filings, add SEC EDGAR API key.`);
                  }}
                  className="text-cyber-cyan hover:text-cyber-cyan/80 transition flex items-center gap-1 text-xs"
                >
                  {incident.filing_type}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </td>
              <td className="p-3">
                <ChevronRight className="w-4 h-4 text-cyber-tx3" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}