from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
import json
from pathlib import Path
from typing import Optional
import io

app = FastAPI(title="Cyber Incident Disclosure Tracker")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path("data")
INCIDENTS_PATH = DATA_DIR / "incidents.csv"
METRICS_PATH = DATA_DIR / "metrics.json"

def load_data():
    global incidents_df, metrics
    if INCIDENTS_PATH.exists():
        incidents_df = pd.read_csv(INCIDENTS_PATH)
        print(f"✅ Loaded {len(incidents_df)} incidents")
    else:
        incidents_df = pd.DataFrame()
    
    if METRICS_PATH.exists():
        with open(METRICS_PATH, 'r') as f:
            metrics = json.load(f)
    else:
        metrics = {}

load_data()

@app.get("/api/incidents")
def get_incidents(
    sector: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    min_severity_score: int = Query(0),
    company: Optional[str] = Query(None),
    incident_type: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: int = Query(100)
):
    df = incidents_df.copy()
    
    if sector and sector != 'ALL':
        df = df[df['sector'] == sector]
    
    if severity and severity != 'ALL':
        df = df[df['severity'] == severity]
    
    if min_severity_score > 0:
        df = df[df['severity_score'] >= min_severity_score]
    
    if company:
        df = df[df['company'].str.contains(company, case=False, na=False)]
    
    if incident_type and incident_type != 'ALL':
        df = df[df['incident_type'] == incident_type]
    
    if start_date:
        df = df[df['disclosure_date'] >= start_date]
    
    if end_date:
        df = df[df['disclosure_date'] <= end_date]
    
    df = df.head(limit)
    
    return df.to_dict('records')

@app.get("/api/incidents/{incident_id}")
def get_incident(incident_id: int):
    df = incidents_df[incidents_df['id'] == incident_id]
    if df.empty:
        return {"error": "Incident not found"}
    return df.iloc[0].to_dict()

@app.get("/api/metrics")
def get_metrics():
    return metrics

@app.get("/api/sectors")
def get_sectors():
    sectors = incidents_df['sector'].unique().tolist()
    return [{"id": s, "name": s} for s in sectors]

@app.get("/api/companies")
def get_companies():
    companies = incidents_df['company'].unique().tolist()
    return [{"id": c, "name": c} for c in companies]

@app.get("/api/incident-types")
def get_incident_types():
    types = incidents_df['incident_type'].unique().tolist()
    return [{"id": t, "name": t} for t in types]

@app.get("/api/severity-breakdown")
def get_severity_breakdown():
    df = incidents_df.copy()
    breakdown = df.groupby('severity').agg({
        'id': 'count',
        'affected_records': 'sum'
    }).reset_index()
    breakdown.columns = ['severity', 'count', 'total_affected']
    return breakdown.to_dict('records')

@app.get("/api/trend")
def get_trend(
    period: str = Query("month"),
    sector: Optional[str] = Query(None)
):
    df = incidents_df.copy()
    
    if sector and sector != 'ALL':
        df = df[df['sector'] == sector]
    
    df['disclosure_date'] = pd.to_datetime(df['disclosure_date'])
    
    if period == 'month':
        df['period'] = df['disclosure_date'].dt.to_period('M').astype(str)
    else:
        df['period'] = df['disclosure_date'].dt.to_period('Q').astype(str)
    
    trend = df.groupby('period').size().reset_index()
    trend.columns = ['period', 'count']
    
    return trend.to_dict('records')

@app.get("/api/export/csv")
def export_csv():
    csv_data = incidents_df.to_csv(index=False)
    return StreamingResponse(
        io.StringIO(csv_data),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=cyber_incidents.csv"}
    )

@app.get("/api/export/sample")
def export_sample():
    return incidents_df.head(10).to_dict('records')
