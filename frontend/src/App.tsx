import { useState, useEffect } from 'react';
import InspectorForm from './components/InspectorForm';
import ReportDisplay from './components/ReportDisplay';
import History from './components/History';

export interface AIAnalysis {
  scores: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
  findings: Array<{
    type: 'positive' | 'warning' | 'critical';
    category: 'seo' | 'performance' | 'accessibility' | 'best-practices';
    title: string;
    description: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
  }>;
  coreWebVitals: {
    lcp: {
      status: 'good' | 'needs-improvement' | 'poor' | 'unavailable';
      value: string;
      score?: number;
    };
    fid: {
      status: 'good' | 'needs-improvement' | 'poor' | 'unavailable';
      value: string;
      score?: number;
    };
    cls: {
      status: 'good' | 'needs-improvement' | 'poor' | 'unavailable';
      value: string;
      score?: number;
    };
    fcp?: {
      status: 'good' | 'needs-improvement' | 'poor' | 'unavailable';
      value: string;
      score?: number;
    };
    ttfb?: {
      status: 'good' | 'needs-improvement' | 'poor' | 'unavailable';
      value: string;
      score?: number;
    };
    speedIndex?: number;
    performanceScore?: number;
    source: 'pagespeed' | 'estimated' | 'unavailable';
  };
  summary: string;
}

export interface Report {
  id: string;
  url: string;
  title: string;
  description: string;
  reportText: string; // JSON string of AIAnalysis
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

function App() {
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'inspector' | 'history'>('inspector');

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) throw new Error('Failed to load history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const handleAnalyze = async (url: string) => {
    setLoading(true);
    setError(null);
    setCurrentReport(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const report: Report = await response.json();
      setCurrentReport(report);

      // Reload history to show the new report
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: Report) => {
    setCurrentReport(report);
    setView('inspector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3"> AI Website Inspector</h1>
          <p className="text-lg md:text-xl text-indigo-100">
            Analyze any website for SEO, Performance, and Core Web Vitals
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 py-4">
            <button
              onClick={() => setView('inspector')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                view === 'inspector'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inspector
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                view === 'history'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              History ({history.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {view === 'inspector' ? (
            <>
              <InspectorForm onAnalyze={handleAnalyze} loading={loading} />

              {error && (
                <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-5 text-red-700">
                  <strong className="font-semibold">Error:</strong> {error}
                </div>
              )}

              {loading && (
                <div className="mt-6 bg-white rounded-xl p-16 text-center border-2 border-gray-200 shadow-lg">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-5"></div>
                  <p className="text-gray-600 text-lg">
                    Analyzing website... This may take a moment.
                  </p>
                </div>
              )}

              {currentReport && !loading && <ReportDisplay report={currentReport} />}
            </>
          ) : (
            <History history={history} onViewReport={handleViewReport} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Developed By Richard with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
