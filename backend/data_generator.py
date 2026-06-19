import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta
import random

def generate_incident_data():
    """Generate synthetic cyber incident disclosure data"""
    
    os.makedirs('data', exist_ok=True)
    
    # Companies by sector
    companies = {
        'Technology': ['Microsoft', 'Google', 'Apple', 'Meta', 'Amazon', 'Oracle', 'Salesforce', 'Adobe', 'IBM', 'Cisco'],
        'Finance': ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citigroup', 'Goldman Sachs', 'Morgan Stanley', 'Visa', 'Mastercard'],
        'Healthcare': ['UnitedHealth', 'CVS Health', 'Pfizer', 'Johnson & Johnson', 'Merck', 'AbbVie', 'Eli Lilly', 'Medtronic'],
        'Energy': ['ExxonMobil', 'Chevron', 'Shell', 'BP', 'ConocoPhillips', 'Schlumberger', 'Halliburton'],
        'Retail': ['Walmart', 'Target', 'Home Depot', 'Costco', 'Lowe\'s', 'Best Buy', 'Macy\'s'],
        'Telecom': ['AT&T', 'Verizon', 'T-Mobile', 'Comcast', 'Charter', 'Dish Network']
    }
    
    # Incident types
    incident_types = [
        'Data Breach', 'Ransomware Attack', 'Supply Chain Attack', 'Phishing Campaign',
        'Insider Threat', 'DDoS Attack', 'Zero-Day Exploit', 'System Intrusion',
        'Third-Party Breach', 'Misconfiguration', 'Credential Stuffing', 'Man-in-the-Middle'
    ]
    
    # Severity levels with weights
    severity_levels = ['Critical', 'High', 'Medium', 'Low']
    severity_weights = [0.15, 0.35, 0.35, 0.15]
    
    # Filing types
    filing_types = ['8-K', '10-K', '10-Q', '6-K', '20-F', 'Schedule 14A']
    
    # Generate incidents
    incidents = []
    start_date = datetime(2020, 1, 1)
    end_date = datetime.now()
    
    for i in range(500):  # 500 incidents
        # Random company selection
        sector = random.choice(list(companies.keys()))
        company = random.choice(companies[sector])
        
        # Random date between 2020 and now
        random_days = random.randint(0, (end_date - start_date).days)
        incident_date = start_date + timedelta(days=random_days)
        disclosure_date = incident_date + timedelta(days=random.randint(1, 30))
        
        # Severity selection
        severity = random.choices(severity_levels, weights=severity_weights)[0]
        
        # Calculate score based on severity
        severity_score = {
            'Critical': random.randint(85, 100),
            'High': random.randint(65, 84),
            'Medium': random.randint(35, 64),
            'Low': random.randint(0, 34)
        }[severity]
        
        # Calculate response time (days to disclose)
        response_time = (disclosure_date - incident_date).days
        
        # Affected records
        if severity in ['Critical', 'High']:
            affected_records = random.randint(100000, 50000000)
        else:
            affected_records = random.randint(100, 100000)
        
        # Generate realistic SEC EDGAR links (synthetic but properly formatted)
        cik = random.randint(100000, 999999)  # CIK number
        accession = random.randint(1000000000, 9999999999)  # Accession number
        filing_type = random.choice(filing_types)
        year = random.randint(2018, 2024)

        # Create a realistic SEC URL format
        filing_link = f"https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/{filing_type.lower()}_{year}.htm"

        # Add a note that this is synthetic in the description
        description = f"[SYNTHETIC DATA] {descriptions.get(incident_types[i % len(incident_types)], f'Security incident affecting {company}.')}"

        # Incident title
        title = f"{company} Reports {incident_types[i % len(incident_types)]}"
        
        # Description
        descriptions = {
            'Data Breach': f"Unauthorized access to customer databases exposed personal information of {affected_records:,} individuals.",
            'Ransomware Attack': f"Ransomware encryption disrupted operations for {random.randint(1, 14)} days. No ransom payment was disclosed.",
            'Supply Chain Attack': f"Third-party software vendor compromise led to data exposure across {random.randint(1, 10)} business units.",
            'Phishing Campaign': f"Spear-phishing campaign targeted executive accounts. Limited data access confirmed.",
            'Insider Threat': f"Former employee accessed systems after termination. Investigation ongoing.",
            'DDoS Attack': f"Distributed denial-of-service caused service degradation for {random.randint(2, 8)} hours.",
            'Zero-Day Exploit': f"Unknown vulnerability exploited in core systems. Patch deployed within {random.randint(1, 5)} days.",
            'System Intrusion': f"Advanced persistent threat detected in network. Forensic investigation initiated."
        }
        description = descriptions.get(incident_types[i % len(incident_types)], f"Security incident affecting {company}.")
        
        # Remediation status
        remediation_status = random.choice(['Completed', 'In Progress', 'Under Investigation', 'Pending Review'])
        
        # Response checklist items
        response_items = [
            'Incident identified and contained',
            'Forensic investigation initiated',
            'Regulatory notification submitted',
            'Affected parties notified',
            'Security patches deployed',
            'Access credentials rotated',
            'Third-party assessment engaged',
            'Remediation plan implemented'
        ]
        completed_items = random.sample(response_items, k=random.randint(3, len(response_items)))
        
        # GDELT mention count
        gdelt_mentions = random.randint(0, 500)
        
        incident = {
            'id': i + 1,
            'title': title,
            'company': company,
            'sector': sector,
            'incident_type': incident_types[i % len(incident_types)],
            'severity': severity,
            'severity_score': severity_score,
            'incident_date': incident_date.strftime('%Y-%m-%d'),
            'disclosure_date': disclosure_date.strftime('%Y-%m-%d'),
            'response_time_days': response_time,
            'affected_records': affected_records,
            'filing_type': filing_type,
            'filing_link': filing_link,
            'description': description,
            'remediation_status': remediation_status,
            'gdelt_mentions': gdelt_mentions,
            'response_completed': len(completed_items),
            'response_total': len(response_items),
            'response_items': response_items,
            'completed_items': completed_items
        }
        incidents.append(incident)
    
    # Sort by date (newest first)
    incidents.sort(key=lambda x: x['disclosure_date'], reverse=True)
    
    df = pd.DataFrame(incidents)
    df.to_csv('data/incidents.csv', index=False)
    
    # Generate metrics
    metrics = {
        'total_incidents': len(df),
        'critical_incidents': len(df[df['severity'] == 'Critical']),
        'high_incidents': len(df[df['severity'] == 'High']),
        'avg_response_time': round(df['response_time_days'].mean(), 1),
        'total_affected_records': int(df['affected_records'].sum()),
        'unique_companies': df['company'].nunique(),
        'unique_sectors': df['sector'].nunique(),
        'avg_gdelt_mentions': round(df['gdelt_mentions'].mean(), 1),
        'cyber_insurance_claims': int(df[df['severity'].isin(['Critical', 'High'])].shape[0] * 0.6),
        'regulatory_fines': int(df[df['response_time_days'] > 30].shape[0] * 5000000)
    }
    
    # Add monthly trend data
    df['disclosure_month'] = pd.to_datetime(df['disclosure_date']).dt.to_period('M')
    monthly_trend = df.groupby('disclosure_month').size().reset_index()
    monthly_trend.columns = ['month', 'count']
    monthly_trend['month'] = monthly_trend['month'].astype(str)
    
    metrics['monthly_trend'] = monthly_trend.to_dict('records')
    
    # Add sector breakdown
    sector_breakdown = df.groupby('sector').size().reset_index()
    sector_breakdown.columns = ['sector', 'incident_count']
    metrics['sector_breakdown'] = sector_breakdown.to_dict('records')
    
    # Add severity breakdown
    severity_breakdown = df.groupby('severity').size().reset_index()
    severity_breakdown.columns = ['severity', 'count']
    metrics['severity_breakdown'] = severity_breakdown.to_dict('records')
    
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✅ Generated {len(incidents)} cyber incidents")
    print(f"   Sectors: {df['sector'].nunique()}")
    print(f"   Companies: {df['company'].nunique()}")
    print(f"   Critical incidents: {len(df[df['severity'] == 'Critical'])}")
    
    return metrics

if __name__ == "__main__":
    generate_incident_data()