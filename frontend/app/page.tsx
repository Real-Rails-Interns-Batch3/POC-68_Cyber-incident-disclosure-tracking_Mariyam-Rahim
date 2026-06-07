'use client';

import { useState, useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { FilterPanel } from './components/FilterPanel';
import { IncidentTable } from './components/IncidentTable';
import { SeverityTrendChart } from './components/SeverityTrendChart';
import { IncidentDetailModal } from './components/IncidentDetailModal';

export interface Filters {
  sector: string;
  severity: string;
  minScore: number;
  company: string;
  incidentType: string;
}

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const [metrics, setMetrics] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    sector: 'ALL',
    severity: 'ALL',
    minScore: 0,
    company: '',
    incidentType: 'ALL',
  });
  const [sectors, setSectors] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  // Fetch initial data
  useEffect(() => {
    fetch(`${API_BASE}/api/metrics`)
      .then(res => res.json())
      .then(setMetrics)
      .catch(console.error);
    
    fetch(`${API_BASE}/api/sectors`)
      .then(res => res.json())
      .then(setSectors)
      .catch(console.error);
    
    fetch(`${API_BASE}/api/companies`)
      .then(res => res.json())
      .then(setCompanies)
      .catch(console.error);
    
    fetch(`${API_BASE}/api/incident-types`)
      .then(res => res.json())
      .then(setIncidentTypes)
      .catch(console.error);
    
    fetch(`${API_BASE}/api/trend?period=month`)
      .then(res => res.json())
      .then(setTrendData)
      .catch(console.error);
  }, []);

  // Fetch incidents when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.sector !== 'ALL') params.append('sector', filters.sector);
    if (filters.severity !== 'ALL') params.append('severity', filters.severity);
    if (filters.minScore > 0) params.append('min_severity_score', filters.minScore.toString());
    if (filters.company) params.append('company', filters.company);
    if (filters.incidentType !== 'ALL') params.append('incident_type', filters.incidentType);
    
    fetch(`${API_BASE}/api/incidents?${params.toString()}`)
      .then(res => res.json())
      .then(setIncidents)
      .catch(console.error);
  }, [filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Topbar 
        totalIncidents={metrics?.total_incidents || 0}
        criticalIncidents={metrics?.critical_incidents || 0}
      />
      
      {/* Main 70/30 Layout */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* 70% Area - Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-5 gap-4">
          {/* Filter Panel - stays at top */}
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            sectors={sectors}
            companies={companies}
            incidentTypes={incidentTypes}
          />
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Severity Trend Chart */}
            <SeverityTrendChart 
              data={trendData}
              metrics={metrics}
              filters={filters}
            />
            
            {/* Incident Table */}
            <div className="glass-panel rounded-lg overflow-hidden">
              <div className="p-4 border-b border-cyber-border sticky top-0 bg-cyber-surface/95 backdrop-blur-sm z-10">
                <h2 className="text-sm font-semibold text-cyber-cyan">Incident Disclosure Registry</h2>
                <p className="text-xs text-cyber-tx2 mt-1">Publicly disclosed cyber incidents and SEC filings</p>
              </div>
              <div className="overflow-x-auto">
                <IncidentTable 
                  incidents={incidents} 
                  onSelectIncident={setSelectedIncident}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 30% Area - Sidebar */}
        <Sidebar 
          metrics={metrics}
          selectedIncident={selectedIncident}
          onExport={() => window.open(`${API_BASE}/api/export/csv`)}
        />
      </div>
      
      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal 
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}