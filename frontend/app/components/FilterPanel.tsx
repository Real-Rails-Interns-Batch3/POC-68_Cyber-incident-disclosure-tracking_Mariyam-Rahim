'use client';

import { useState } from 'react';
import { Filter, ChevronDown, X, TrendingUp } from 'lucide-react';
import { Filters } from '@/app/page';

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  sectors: Array<{ id: string; name: string }>;
  companies: Array<{ id: string; name: string }>;
  incidentTypes: Array<{ id: string; name: string }>;
}

export function FilterPanel({ filters, onChange, sectors, companies, incidentTypes }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const severityLevels = [
    { value: 'ALL', label: 'All Severities', color: 'gray' },
    { value: 'Critical', label: 'Critical', color: 'red' },
    { value: 'High', label: 'High', color: 'orange' },
    { value: 'Medium', label: 'Medium', color: 'yellow' },
    { value: 'Low', label: 'Low', color: 'green' },
  ];
  
  const hasActiveFilters = filters.sector !== 'ALL' || 
                          filters.severity !== 'ALL' || 
                          filters.minScore > 0 ||
                          filters.company !== '' ||
                          filters.incidentType !== 'ALL';
  
  const clearFilters = () => {
    onChange({
      sector: 'ALL',
      severity: 'ALL',
      minScore: 0,
      company: '',
      incidentType: 'ALL',
    });
  };
  
  return (
    <div className="glass-panel rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-mono text-cyber-tx2 hover:text-cyber-cyan transition"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5" />
          FILTERS
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="border-t border-cyber-border p-3 space-y-3 min-w-[260px]">
          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="bg-cyber-cyan/5 border border-cyber-cyan/20 rounded p-2">
              <div className="text-[9px] text-cyber-cyan mb-1">ACTIVE FILTERS:</div>
              <div className="flex flex-wrap gap-1">
                {filters.sector !== 'ALL' && (
                  <span className="text-[9px] bg-cyber-cyan/20 px-1.5 py-0.5 rounded">Sector: {filters.sector}</span>
                )}
                {filters.severity !== 'ALL' && (
                  <span className="text-[9px] bg-cyber-cyan/20 px-1.5 py-0.5 rounded">Severity: {filters.severity}</span>
                )}
                {filters.minScore > 0 && (
                  <span className="text-[9px] bg-cyber-cyan/20 px-1.5 py-0.5 rounded">Score &gt; {filters.minScore}</span>
                )}
                {filters.company && (
                  <span className="text-[9px] bg-cyber-cyan/20 px-1.5 py-0.5 rounded">Company: {filters.company}</span>
                )}
                {filters.incidentType !== 'ALL' && (
                  <span className="text-[9px] bg-cyber-cyan/20 px-1.5 py-0.5 rounded">Type: {filters.incidentType}</span>
                )}
              </div>
            </div>
          )}
          
          {/* Sector Filter */}
          <div>
            <label className="text-[10px] font-mono text-cyber-tx3 uppercase tracking-wider block mb-1.5">
              Sector
            </label>
            <select
              value={filters.sector}
              onChange={(e) => onChange({ ...filters, sector: e.target.value })}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-2 py-1.5 text-xs text-cyber-tx focus:border-cyber-cyan outline-none"
            >
              <option value="ALL">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector.id} value={sector.name}>{sector.name}</option>
              ))}
            </select>
          </div>
          
          {/* Severity Filter */}
          <div>
            <label className="text-[10px] font-mono text-cyber-tx3 uppercase tracking-wider block mb-1.5">
              Severity Level
            </label>
            <div className="flex flex-wrap gap-1.5">
              {severityLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => onChange({ ...filters, severity: level.value })}
                  className={`text-[10px] px-2 py-1 rounded transition ${
                    filters.severity === level.value
                      ? 'bg-cyber-cyan text-black font-mono'
                      : 'bg-cyber-border text-cyber-tx2 hover:bg-cyber-border/70'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Severity Score Slider */}
          <div>
            <label className="text-[10px] font-mono text-cyber-tx3 uppercase tracking-wider block mb-1.5">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Min Severity Score: {filters.minScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minScore}
              onChange={(e) => onChange({ ...filters, minScore: parseInt(e.target.value) })}
              className="w-full h-1 bg-cyber-border rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
            />
            <div className="flex justify-between text-[8px] text-cyber-tx3 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Critical</span>
            </div>
          </div>
          
          {/* Company Search */}
          <div>
            <label className="text-[10px] font-mono text-cyber-tx3 uppercase tracking-wider block mb-1.5">
              Company
            </label>
            <input
              type="text"
              placeholder="Search company..."
              value={filters.company}
              onChange={(e) => onChange({ ...filters, company: e.target.value })}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-2 py-1.5 text-xs text-cyber-tx focus:border-cyber-cyan outline-none"
            />
          </div>
          
          {/* Incident Type Filter */}
          <div>
            <label className="text-[10px] font-mono text-cyber-tx3 uppercase tracking-wider block mb-1.5">
              Incident Type
            </label>
            <select
              value={filters.incidentType}
              onChange={(e) => onChange({ ...filters, incidentType: e.target.value })}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-2 py-1.5 text-xs text-cyber-tx focus:border-cyber-cyan outline-none"
            >
              <option value="ALL">All Types</option>
              {incidentTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-1.5 text-[10px] font-mono text-cyber-tx3 hover:text-cyber-red transition py-1.5 border-t border-cyber-border mt-1 pt-2"
            >
              <X className="w-3 h-3" />
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}