import { NextRequest, NextResponse } from 'next/server';
import { getReportById } from '@/lib/reports';
import { getRoleFromToken } from '@/lib/auth';
import { AISummary } from '@/types';

// Mock AI summaries per report — simulates real API response
const AI_SUMMARIES: Record<string, AISummary> = {
  '1': {
    summary: 'This report reveals a strong Q4 2024, with 23% revenue growth and expanding margins driven by enterprise momentum. The $45.2M revenue milestone and 94% renewal rate point to a well-retained customer base. Healthy cash reserves and a robust $62M pipeline signal continued growth heading into 2025.',
    keyPoints: [
      '23% YoY revenue growth reaching $45.2M',
      'EBITDA margin expanded 3.3 points to 18.5%',
      'Customer acquisition cost reduced by 12%',
      'Enterprise expansion driving growth, especially in APAC',
      '$62M qualified pipeline visible for Q1 2025',
    ],
    sentiment: 'positive',
    readingTime: 4,
  },
  '2': {
    summary: 'The supply chain initiative delivered measurable, compounding benefits across lead time, cost, and supplier reliability. The 34% reduction in lead times alongside $3.1M in annual inventory savings reflects a mature, well-executed transformation. Customer satisfaction improvements validate the end-to-end impact.',
    keyPoints: [
      'Lead times reduced 34% from 21 to 13.8 days',
      '$3.1M annual inventory holding cost reduction',
      'Supplier on-time delivery improved from 78% to 94%',
      'Per-unit handling cost down 19% via automation',
      'Projected 3-year savings of $14.7M',
    ],
    sentiment: 'positive',
    readingTime: 3,
  },
  '3': {
    summary: 'The Summer 2024 campaign successfully lifted brand recall and outperformed industry CTR benchmarks through efficient digital spend. While OOH drove measurable traffic uplift, email and YouTube underperformed, presenting clear reallocation opportunities for Q4. Overall ROI is solid given the $2.4M spend.',
    keyPoints: [
      '14% brand recall lift in target demographic',
      'Paid social CTR of 2.8% vs 1.1% industry average',
      '12M unique users reached via influencer partnerships',
      'ROAS of 3.2x across digital channels',
      'Email open rates at 21% — below target, needs optimization',
    ],
    sentiment: 'positive',
    readingTime: 4,
  },
  '4': {
    summary: 'Engineering H2 2024 shows a team executing at high velocity with strong reliability improvements. The dramatic MTTR drop from 47 to 12 minutes is particularly noteworthy, as is the halving of production bug escape rates. The Kubernetes migration trajectory suggests infrastructure modernization is well on track.',
    keyPoints: [
      'Sprint velocity up 12% to 78 story points',
      'Deployment frequency increased to 4.2x/day',
      'MTTR slashed from 47 minutes to 12 minutes',
      'Bug escape rate fell from 8.2% to 3.1%',
      'System uptime at 99.94% despite 3x traffic increase',
    ],
    sentiment: 'positive',
    readingTime: 3,
  },
  '5': {
    summary: 'Employee engagement has meaningfully improved in 2024, with the 6-point score increase and reduced voluntary attrition reflecting the effectiveness of leadership transparency and flexibility initiatives. Predictive churn modeling adds a proactive dimension to retention strategy. Compensation and cross-team collaboration remain lagging areas requiring focused investment.',
    keyPoints: [
      'Engagement score up to 74/100, above 71 industry benchmark',
      'Voluntary attrition fell from 15.8% to 11.2%',
      'High-performer retention at 94%',
      'Compensation competitiveness scores at 58/100 — at-risk area',
      '23 employees flagged via predictive churn model',
    ],
    sentiment: 'positive',
    readingTime: 4,
  },
  '6': {
    summary: 'The SEA expansion strategy is promising but requires careful sequencing and risk management. Singapore as the regulatory-friendly entry point is strategically sound, with Vietnam and Indonesia following in a phased approach. The 29-month break-even horizon and $5.8M investment commitment are reasonable given the $780M TAM potential.',
    keyPoints: [
      '$780M TAM projected across Singapore, Indonesia, Vietnam by 2027',
      'Phased entry: Singapore Q2 2025 → Vietnam Q4 2025 → Indonesia Q2 2026',
      '$5.8M investment over 24 months with break-even at month 29',
      'Mid-market whitespace identified despite 4 established competitors',
      'Vietnam data residency compliance requires further research',
    ],
    sentiment: 'neutral',
    readingTime: 5,
  },
  '7': {
    summary: 'The AWS audit identified $890K in annual savings through a structured three-horizon approach. The quick-win tier has already generated $78K in realized savings, validating the model. Reserved instance purchasing and Graviton migration represent the highest-leverage longer-term opportunities with favorable payback periods.',
    keyPoints: [
      '$890K total annualized savings identified',
      'Quick wins (rightsizing, cleanup) save $290K/yr',
      'Reserved instances and Aurora migration save $380K/yr',
      '$78K already realized since audit completion',
      '340 engineering hours required for full implementation',
    ],
    sentiment: 'positive',
    readingTime: 3,
  },
  '8': {
    summary: 'The 2024 compliance report demonstrates a strong regulatory posture with zero major GDPR findings and renewed SOC 2 Type II and PCI DSS certifications. Cybersecurity improvements are significant, though the zero-trust project remains 40% incomplete. The risk register is well-maintained and insurance coverage has been proactively updated.',
    keyPoints: [
      'GDPR audit passed with zero major findings',
      'SOC 2 Type II and PCI DSS Level 1 compliance maintained',
      'MFA deployed across all systems',
      'Zero-trust network architecture 60% complete',
      '18 new risks added to register with 14 mitigations assigned',
    ],
    sentiment: 'neutral',
    readingTime: 4,
  },
};

export async function POST(request: NextRequest) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('x-auth-token');
  const role = getRoleFromToken(token ?? null);

  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { reportId } = body;

  if (!reportId) {
    return NextResponse.json({ error: 'reportId is required' }, { status: 400 });
  }

  const report = getReportById(reportId);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Simulate AI processing delay (1.5–2.5s)
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
  );

  const summary = AI_SUMMARIES[reportId];

  if (!summary) {
    return NextResponse.json({ error: 'AI summary unavailable' }, { status: 500 });
  }

  return NextResponse.json(summary);
}
