'use client';

import { X, CheckCircle, Circle, ExternalLink, Clock, Users, FileText, Shield } from 'lucide-react';

interface ResponseChecklistProps {
  incident: any;
  onClose: () => void;
}

export function ResponseChecklist({ incident, onClose }: ResponseChecklistProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-cyber-red border-cyber-red';
      case 'High': return 'text-cyber-orange border-cyber-orange';
      case 'Medium': return 'text-cyber-yellow border-cyber-yellow';
      default: return 'text-cyber-green border-cyber-green';
    }
  };
  
  const responseItems = incident.response_items || [];
  const completedItems = incident.completed_items || [];
  
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-panel rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cyber-border">
          <div>
            <h2 className="text-lg font-semibold text-white">{incident.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-cyber-tx2">{incident.company}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-cyber-border rounded transition"
          >
            <X className="w-5 h-5 text-cyber-tx2" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Incident Details */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-cyan mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Incident Summary
            </h3>
            <p className="text-sm text-cyber-tx2 leading-relaxed">{incident.description}</p>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cyber-bg/50 rounded p-2 text-center">
              <Clock className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
              <p className="text-[10px] text-cyber-tx3">Response Time</p>
              <p className="text-sm font-semibold text-white">{incident.response_time_days} days</p>
            </div>
            <div className="bg-cyber-bg/50 rounded p-2 text-center">
              <Users className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
              <p className="text-[10px] text-cyber-tx3">Records Affected</p>
              <p className="text-sm font-semibold text-white">{incident.affected_records.toLocaleString()}</p>
            </div>
            <div className="bg-cyber-bg/50 rounded p-2 text-center">
              <FileText className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
              <p className="text-[10px] text-cyber-tx3">Severity Score</p>
              <p className="text-sm font-semibold text-cyber-red">{incident.severity_score}/100</p>
            </div>
          </div>
          
          {/* Response Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-cyan mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Incident Response Checklist
            </h3>
            <div className="space-y-2">
              {responseItems.map((item: string, idx: number) => {
                const isCompleted = completedItems.includes(item);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-cyber-green" />
                    ) : (
                      <Circle className="w-4 h-4 text-cyber-tx3" />
                    )}
                    <span className={`text-sm ${isCompleted ? 'text-cyber-tx2 line-through' : 'text-white'}`}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Remediation Status */}
          <div className="bg-cyber-bg/30 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyber-tx3">Remediation Status</span>
              <span className="text-xs font-mono text-cyber-cyan">{incident.remediation_status}</span>
            </div>
            <div className="w-full bg-cyber-border rounded-full h-1.5">
              <div 
                className="bg-cyber-green h-1.5 rounded-full"
                style={{ width: `${(completedItems.length / responseItems.length) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-cyber-tx3 mt-2">
              {completedItems.length}/{responseItems.length} remediation steps complete
            </p>
          </div>
          
          {/* SEC Filing Link */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-cyan mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Regulatory Filing
            </h3>
            <a
              href={incident.filing_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-cyber-bg/50 rounded hover:bg-cyber-bg transition"
            >
              <div>
                <p className="text-sm font-medium text-white">{incident.filing_type} Filing</p>
                <p className="text-[10px] text-cyber-tx3">Filed: {new Date(incident.disclosure_date).toLocaleDateString()}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-cyber-cyan" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}