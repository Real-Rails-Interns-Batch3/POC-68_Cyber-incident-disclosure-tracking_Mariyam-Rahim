'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SeverityTrendChartProps {
  data: any[];
  metrics: any;
  filters?: any;
}

export function SeverityTrendChart({ data, metrics, filters }: SeverityTrendChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Updated colors - more distinct
  const severityColors = {
    Critical: '#EF4444',     // Bright Red
    High: '#8B5CF6',         // Purple
    Medium: '#06B6D4',       // Cyan
    Low: '#10B981'           // Green
  };

  useEffect(() => {
    const fetchTrendData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (filters?.sector && filters.sector !== 'ALL') {
          params.append('sector', filters.sector);
        }
        
        if (filters?.severity && filters.severity !== 'ALL') {
          params.append('severity', filters.severity);
        }
        
        if (filters?.minScore && filters.minScore > 0) {
          params.append('min_severity_score', filters.minScore.toString());
        }
        
        const response = await fetch(`${API_BASE}/api/incidents?${params.toString()}&limit=10000`);
        const incidents = await response.json();
        
        const monthlyData: Record<string, any> = {};
        
        incidents.forEach((incident: any) => {
          const date = new Date(incident.disclosure_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              month: monthLabel,
              Critical: 0,
              High: 0,
              Medium: 0,
              Low: 0,
              total: 0
            };
          }
          
          monthlyData[monthKey][incident.severity]++;
          monthlyData[monthKey].total++;
        });
        
        const sortedData = Object.entries(monthlyData)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([_, values]) => values)
          .slice(-12);
        
        setChartData(sortedData);
      } catch (error) {
        console.error('Error fetching trend data:', error);
        setChartData([
          { month: 'Jan 24', Critical: 1, High: 2, Medium: 1, Low: 0, total: 4 },
          { month: 'Feb 24', Critical: 0, High: 1, Medium: 2, Low: 0, total: 3 },
          { month: 'Mar 24', Critical: 1, High: 2, Medium: 1, Low: 1, total: 5 },
          { month: 'Apr 24', Critical: 1, High: 1, Medium: 2, Low: 0, total: 4 },
          { month: 'May 24', Critical: 2, High: 2, Medium: 1, Low: 1, total: 6 },
          { month: 'Jun 24', Critical: 1, High: 2, Medium: 1, Low: 1, total: 5 },
          { month: 'Jul 24', Critical: 2, High: 3, Medium: 1, Low: 1, total: 7 },
          { month: 'Aug 24', Critical: 1, High: 2, Medium: 2, Low: 1, total: 6 },
          { month: 'Sep 24', Critical: 1, High: 2, Medium: 1, Low: 1, total: 5 },
          { month: 'Oct 24', Critical: 2, High: 3, Medium: 1, Low: 1, total: 7 },
          { month: 'Nov 24', Critical: 1, High: 2, Medium: 2, Low: 1, total: 6 },
          { month: 'Dec 24', Critical: 2, High: 3, Medium: 1, Low: 1, total: 7 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendData();
  }, [filters]);

  const getActiveLines = () => {
    if (filters?.severity && filters.severity !== 'ALL') {
      return [filters.severity];
    }
    return ['Critical', 'High', 'Medium', 'Low'];
  };
  
  const activeLines = getActiveLines();
  
  const last3Months = chartData.slice(-3);
  const avgRate = last3Months.length > 0 
    ? (last3Months.reduce((sum, item) => sum + item.total, 0) / 3).toFixed(1)
    : '0';
  
  const totals = chartData.reduce((acc, item) => ({
    Critical: acc.Critical + (item.Critical || 0),
    High: acc.High + (item.High || 0),
    Medium: acc.Medium + (item.Medium || 0),
    Low: acc.Low + (item.Low || 0)
  }), { Critical: 0, High: 0, Medium: 0, Low: 0 });
  
  if (isLoading) {
    return (
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-cyber-tx3 animate-pulse">Loading chart data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-panel rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyber-cyan" />
          <h3 className="text-sm font-semibold text-cyber-cyan">Severity Trend Analysis</h3>
          {filters?.sector && filters.sector !== 'ALL' && (
            <span className="text-[9px] bg-cyber-cyan/20 px-2 py-0.5 rounded">
              Sector: {filters.sector}
            </span>
          )}
          {filters?.severity && filters.severity !== 'ALL' && (
            <span className="text-[9px] bg-cyber-cyan/20 px-2 py-0.5 rounded">
              Severity: {filters.severity} Only
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: severityColors.Critical }} />
            <span className="text-xs text-cyber-tx2">Critical: <span className="text-white">{totals.Critical}</span></span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: severityColors.High }} />
            <span className="text-xs text-cyber-tx2">High: <span className="text-white">{totals.High}</span></span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: severityColors.Medium }} />
            <span className="text-xs text-cyber-tx2">Medium: <span className="text-white">{totals.Medium}</span></span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: severityColors.Low }} />
            <span className="text-xs text-cyber-tx2">Low: <span className="text-white">{totals.Low}</span></span>
          </div>
        </div>
      </div>
      
      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
          <YAxis stroke="#94A3B8" fontSize={10} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0B1117', 
              border: '1px solid #1F2937',
              borderRadius: '8px',
              fontSize: '11px'
            }}
            labelStyle={{ color: '#38BDF8' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px' }}
          />
          {activeLines.includes('Critical') && (
            <Line 
              type="monotone" 
              dataKey="Critical" 
              stroke={severityColors.Critical}
              strokeWidth={2}
              dot={{ fill: severityColors.Critical, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {activeLines.includes('High') && (
            <Line 
              type="monotone" 
              dataKey="High" 
              stroke={severityColors.High}
              strokeWidth={2}
              dot={{ fill: severityColors.High, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {activeLines.includes('Medium') && (
            <Line 
              type="monotone" 
              dataKey="Medium" 
              stroke={severityColors.Medium}
              strokeWidth={2}
              dot={{ fill: severityColors.Medium, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {activeLines.includes('Low') && (
            <Line 
              type="monotone" 
              dataKey="Low" 
              stroke={severityColors.Low}
              strokeWidth={2}
              dot={{ fill: severityColors.Low, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Footer Stats */}
      <div className="pt-4 mt-2 border-t border-cyber-border">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[9px] text-cyber-tx3 uppercase tracking-wider font-mono">Incident Rate</p>
            <p className="text-xl font-bold text-cyber-cyan">{avgRate}<span className="text-sm">/mo</span></p>
          </div>
          <div>
            <p className="text-[9px] text-cyber-tx3 uppercase tracking-wider font-mono">Critical Trend</p>
            <p className="text-xl font-bold text-red-500">{totals.Critical}</p>
          </div>
          <div>
            <p className="text-[9px] text-cyber-tx3 uppercase tracking-wider font-mono">High Severity</p>
            <p className="text-xl font-bold text-purple-500">{totals.High}</p>
          </div>
        </div>
      </div>
    </div>
  );
}