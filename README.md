# Cyber Incident Disclosure Tracker

A production-grade intelligence dashboard for tracking publicly disclosed cyber incidents, SEC filings, and sector-specific risk patterns.

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python data_generator.py
uvicorn main:app --reload --port 8000
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Features

- Incident Registry - Searchable/filterable table of all incidents
- SEC EDGAR Links - Direct links to official filings
- Severity Trend Chart - Line chart showing incident patterns
- Sector Filters - Technology, Finance, Healthcare, Energy, Retail, Telecom
- Severity Scoring - 0-100 severity scoring system
- Response Checklist - Track incident remediation steps
- CSV Export - Download data for offline analysis

## Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Recharts, Lucide React

**Backend:** FastAPI, Pandas, Python, Uvicorn

## License

MIT

## Environment Variables

Create `.env.local` in the `frontend` directory:
NEXT_PUBLIC_API_URL=http://localhost:8000

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| /api/incidents | Get filtered incidents |
| /api/metrics | Get aggregated metrics |
| /api/sectors | Get all sectors |
| /api/trend | Get severity trend data |
| /api/export/csv | Download CSV data |

## Dashboard Sections

**70% Area (Main Content)**
- Filter Panel - Sector, severity, and score filters
- Severity Trend Chart - Line chart with severity breakdown
- Incident Registry - Table with SEC filing links

**30% Area (Sidebar)**
- Section A - Intelligence metrics
- Section B - Why This Matters
- Section C - Who Controls the Rail
- Section D - Response metrics
- Section E - Export controls

## Color Scheme

| Severity | Color |
|----------|-------|
| Critical | Red |
| High | Purple |
| Medium | Cyan |
| Low | Green |

## Filter Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| sector | string | Filter by sector (Technology, Finance, etc.) |
| severity | string | Filter by severity (Critical, High, Medium, Low) |
| min_severity_score | int | Minimum severity score (0-100) |
| company | string | Filter by company name |
| incident_type | string | Filter by incident type |

## Data Sources

### Current Data (Synthetic)
The dashboard currently uses **synthetic data** for demonstration purposes. This allows you to:
- Test the dashboard immediately without API keys
- See realistic incident patterns
- Understand the full feature set

### Real Data Sources (Optional)

#### SEC EDGAR
The SEC EDGAR database provides real corporate filings including 8-K, 10-K, and 10-Q reports that disclose cyber incidents.

**To enable SEC EDGAR:**
1. Get an API key from https://www.sec.gov/edgar/searchedgar/access
2. Add to `.env.local`:
   SEC_EDGAR_API_KEY=your_api_key_here

#### GDELT
The GDELT Project monitors global news media for cyber incident mentions.

**To enable GDELT:**
1. Access GDELT API at https://www.gdeltproject.org/data.html
2. Add to `.env.local`:GDELT_API_KEY=your_api_key_here


### Switching to Real Data

1. Uncomment the API key lines in `.env.example`
2. Rename `.env.example` to `.env.local`
3. Add your actual API keys
4. Modify `backend/data_generator.py` to fetch from APIs instead of generating synthetic data

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 8000
- Check that frontend is running on port 3000
- Verify CORS middleware in `backend/main.py`

### Data Not Loading
- Run `python data_generator.py` to regenerate data
- Check that `backend/data/incidents.csv` exists
- Verify file paths in `backend/main.py`

### Chart Not Displaying
- Install recharts: `npm install recharts`
- Check browser console for errors
- Verify trend data is being fetched from API

### Filters Not Working
- Open browser console (F12) to check for errors
- Verify API endpoints are responding
- Check that filter parameters are being sent correctly

### Module Not Found Errors
- Backend: `pip install -r requirements.txt`
- Frontend: `npm install`

### Port Already in Use
- Change backend port: `uvicorn main:app --reload --port 8001`
- Update `.env.local` with new port

## Project Structure
```
cyber-incident-tracker/
├── backend/
│ ├── main.py
│ ├── data_generator.py
│ ├── requirements.txt
│ └── data/
│ ├── incidents.csv
│ └── metrics.json
├── frontend/
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── globals.css
│ │ └── components/
│ │ ├── Topbar.tsx
│ │ ├── Sidebar.tsx
│ │ ├── FilterPanel.tsx
│ │ ├── IncidentTable.tsx
│ │ ├── SeverityTrendChart.tsx
│ │ └── IncidentDetailModal.tsx
│ ├── package.json
│ ├── tsconfig.json
│ └── tailwind.config.js
├── .gitignore
└── README.md
```

