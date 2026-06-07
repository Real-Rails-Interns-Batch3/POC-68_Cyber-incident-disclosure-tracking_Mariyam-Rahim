'use client';

import { X, Calendar, Building2, AlertTriangle, FileText, ExternalLink, Clock, Users, Shield, CheckCircle, Circle } from 'lucide-react';

interface IncidentDetailModalProps {
  incident: any;
  onClose: () => void;
}

export function IncidentDetailModal({ incident, onClose }: IncidentDetailModalProps) {
  if (!incident) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 border-red-500';
      case 'High': return 'text-orange-500 border-orange-500';
      case 'Medium': return 'text-yellow-500 border-yellow-500';
      default: return 'text-green-500 border-green-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-500';
    if (score >= 65) return 'text-orange-500';
    if (score >= 35) return 'text-yellow-500';
    return 'text-green-500';
  };

  const responseItems = [
    'Incident identified and contained',
    'Forensic investigation initiated',
    'Regulatory notification submitted',
    'Affected parties notified',
    'Security patches deployed',
    'Access credentials rotated',
    'Third-party assessment engaged',
    'Remediation plan implemented'
  ];

  const completedCount = incident.response_completed || Math.floor(Math.random() * 8);
  const totalCount = incident.response_total || 8;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-panel rounded-xl w-[650px] max-h-[85vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-cyber-surface/95 backdrop-blur-md border-b border-cyber-border p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-cyber-red" />
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getSeverityColor(incident.severity)}`}>
                  {incident.severity.toUpperCase()} SEVERITY
                </span>
                <span className="text-[10px] font-mono text-cyber-tx3">
                  Score: <span className={getScoreColor(incident.severity_score)}>{incident.severity_score}/100</span>
                </span>
              </div>
              <h2 className="text-xl font-semibold text-white">{incident.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyber-tx3" />
                  <span className="text-sm text-cyber-tx2">{incident.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyber-tx3" />
                  <span className="text-sm text-cyber-tx2">
                    {new Date(incident.disclosure_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-cyber-border rounded-lg transition"
            >
              <X className="w-5 h-5 text-cyber-tx2" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-cyan mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Incident Summary
            </h3>
            <p className="text-sm text-cyber-tx2 leading-relaxed">{incident.description}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-cyber-bg/50 rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
              <p className="text-[9px] text-cyber-tx3">Response Time</p>
              <p className="text-base font-semibold text-white">{incident.response_time_days}d</p>
            </div>
            <div className="bg-cyber-bg/50 rounded-lg p-3 text-center">
              <Users className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
              <p className="text-[9px] text-cyber-tx3">Records Affected</p>
              <p className="text-base font-semibold text-white">
                {incident.affected_records >= 1000000 
                  ? `${(incident.affected_records / 1000000).toFixed(1)}M` 
                  : incident.affected_records >= 1000 
                    ? `${(incident.affected_records / 1000).toFixed(0)}K`
                    : incident.affected_records}
              </p>
            </div>
            <div className="bg-cyber-bg/50 rounded-lg p-3 text-center">
              <AlertTriangle className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
              <p className="text-[9px] text-cyber-tx3">Incident Type</p>
              <p className="text-xs font-semibold text-white truncate">{incident.incident_type}</p>
            </div>
            <div className="bg-cyber-bg/50 rounded-lg p-3 text-center">
              <Shield className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
              <p className="text-[9px] text-cyber-tx3">Remediation</p>
              <p className="text-xs font-semibold text-white">{incident.remediation_status}</p>
            </div>
          </div>

          {/* Response Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-cyan mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Incident Response Checklist
            </h3>
            <div className="space-y-2">
              {responseItems.map((item, idx) => {
                const isCompleted = idx < completedCount;
                return (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg hover:bg-cyber-border/20 transition">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-cyber-green flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-cyber-tx3 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isCompleted ? 'text-cyber-tx2 line-through' : 'text-white'}`}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-cyber-bg/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyber-tx3">Remediation Progress</span>
              <span className="text-xs font-mono text-cyber-cyan">{completedCount}/{totalCount} Complete</span>
            </div>
            <div className="w-full bg-cyber-border rounded-full h-2">
              <div 
                className="bg-cyber-green h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* SEC Filing Link */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-cyan mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Regulatory Filing
            </h3>
            <a
              href={incident.filing_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-cyber-bg/50 rounded-lg hover:bg-cyber-bg transition group"
            >
              <div>
                <p className="text-sm font-medium text-white group-hover:text-cyber-cyan transition">
                  {incident.filing_type} Filing with SEC
                </p>
                <p className="text-[10px] text-cyber-tx3">
                  EDGAR Database • {new Date(incident.disclosure_date).toLocaleDateString()}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-cyber-cyan opacity-70 group-hover:opacity-100 transition" />
            </a>
          </div>

          {/* GDELT Mention Count */}
          <div className="border-t border-cyber-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyber-tx3">GDELT News Mentions</span>
              <span className="text-xs font-mono text-cyber-cyan">{incident.gdelt_mentions?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}