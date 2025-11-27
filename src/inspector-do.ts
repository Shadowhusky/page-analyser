/**
 * InspectorDO - Durable Object for storing user's website inspection history
 */

export interface Report {
  id: string;
  url: string;
  title: string;
  description: string;
  reportText: string;
  metrics: {
    url: string;
    title: string;
    description: string;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    imgCount: number;
    imgWithAltCount: number;
    scriptCount: number;
    stylesheetCount: number;
    inlineStyleCount: number;
    htmlLength: number;
    hasViewport: boolean;
    hasLang: boolean;
    hasCanonical: boolean;
    hasRobots: boolean;
    hasOpenGraph: boolean;
    hasStructuredData: boolean;
    hasCharset: boolean;
    isHttps: boolean;
    linkCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
    hasH1: boolean;
    uniqueH1: boolean;
    textToHtmlRatio: number;
  };
  createdAt: string;
}

export class InspectorDO {
  private state: DurableObjectState;
  private reports: Report[] = [];

  constructor(state: DurableObjectState) {
    this.state = state;
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<Report[]>('reports');
      this.reports = stored || [];
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/add' && request.method === 'POST') {
        return await this.addReport(request);
      } else if (path === '/list' && request.method === 'GET') {
        return this.listReports();
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  private async addReport(request: Request): Promise<Response> {
    const report: Report = await request.json();
    
    // Add to beginning of array (most recent first)
    this.reports.unshift(report);
    
    // Keep only last 50 reports to prevent unbounded growth
    if (this.reports.length > 50) {
      this.reports = this.reports.slice(0, 50);
    }
    
    await this.state.storage.put('reports', this.reports);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private listReports(): Response {
    return new Response(JSON.stringify(this.reports), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
