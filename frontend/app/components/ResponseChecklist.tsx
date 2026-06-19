'use client';

import { X, CheckCircle, Circle, ExternalLink, Clock, Users, FileText, Shield } from 'lucide-react';

interface ResponseChecklistProps {
  incident: any;
  onClose: () => void;
}

export function ResponseChecklist({ incident, onClose }: ResponseChecklistProps) {
  if (!incident) return null;

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
      <div className="glass-panel rounded-xl w-[600px] max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-cyber-surface/95 backdrop-blur-md border-b border-cyber-border p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{incident.title}</h2>
              <p className="text-sm text-cyber-tx2">{incident.company}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-cyber-border rounded">
              <X className="w-5 h-5 text-cyber-tx2" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-cyber-tx2">{incident.description}</p>

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

          {/* Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-cyber-cyan mb-3">Response Checklist</h3>
            <div className="space-y-2">
              {responseItems.map((item, idx) => {
                const isCompleted = idx < completedCount;
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

          {/* Progress */}
          <div className="bg-cyber-bg/30 rounded p-3">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-cyber-tx3">Remediation Progress</span>
              <span className="text-xs font-mono text-cyber-cyan">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-cyber-border rounded-full h-2">
              <div 
                className="bg-cyber-green h-2 rounded-full"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* SEC Filing */}
          <a
            href={incident.filing_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-cyber-bg/50 rounded hover:bg-cyber-bg transition"
          >
            <div>
              <p className="text-sm font-medium text-white">{incident.filing_type} Filing</p>
              <p className="text-[10px] text-cyber-tx3">SEC EDGAR</p>
            </div>
            <ExternalLink className="w-4 h-4 text-cyber-cyan" />
          </a>
        </div>
      </div>
    </div>
  );
}