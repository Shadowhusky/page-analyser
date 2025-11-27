import { Report, AIAnalysis } from '../App';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  BoltIcon,
  EyeIcon,
  SparklesIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Radar, Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ReportDisplayProps {
  report: Report;
}

function ReportDisplay({ report }: ReportDisplayProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  // Parse AI analysis from JSON string
  let analysis: AIAnalysis;
  try {
    analysis = JSON.parse(report.reportText);
  } catch (e) {
    console.error('Failed to parse AI analysis:', e);
    // Fallback if parsing fails
    analysis = {
      scores: { seo: 0, performance: 0, accessibility: 0, bestPractices: 0 },
      findings: [],
      recommendations: [],
      coreWebVitals: {
        lcp: { status: 'unavailable', value: 'N/A' },
        fid: { status: 'unavailable', value: 'N/A' },
        cls: { status: 'unavailable', value: 'N/A' },
        source: 'unavailable'
      },
      summary: 'Analysis data unavailable'
    };
  }

  const getAltTextPercentage = () => {
    if (report.metrics.imgCount === 0) return 100;
    return Math.round((report.metrics.imgWithAltCount / report.metrics.imgCount) * 100);
  };

  // Radar Chart Data - Overall Scores
  const radarData = {
    labels: ['SEO', 'Performance', 'Accessibility', 'Best Practices'],
    datasets: [
      {
        label: 'Scores',
        data: [
          analysis.scores.seo,
          analysis.scores.performance,
          analysis.scores.accessibility,
          analysis.scores.bestPractices
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Doughnut Chart - Image Alt Text Coverage
  const imageData = {
    labels: ['With Alt Text', 'Missing Alt Text'],
    datasets: [
      {
        data: [report.metrics.imgWithAltCount, report.metrics.imgCount - report.metrics.imgWithAltCount],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  // Bar Chart - Content Metrics
  const contentData = {
    labels: ['H1', 'H2', 'H3', 'Images', 'Links', 'Scripts'],
    datasets: [
      {
        label: 'Count',
        data: [
          report.metrics.h1Count,
          report.metrics.h2Count,
          report.metrics.h3Count,
          report.metrics.imgCount,
          report.metrics.linkCount,
          report.metrics.scriptCount
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Get status color and icon for Core Web Vitals
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircleIcon className="w-6 h-6" />;
      case 'needs-improvement': return <ExclamationTriangleIcon className="w-6 h-6" />;
      case 'poor': return <XCircleIcon className="w-6 h-6" />;
      default: return <QuestionMarkCircleIcon className="w-6 h-6" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const cwvSource = analysis.coreWebVitals?.source || 'unavailable';

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">Analysis Report</h2>
          <p className="text-gray-600">{formatDate(report.createdAt)}</p>
        </div>

        <div className="mt-5 p-4 bg-gray-50 rounded-lg break-all">
          <strong className="text-gray-700">Analyzed URL:</strong>{' '}
          <a 
            href={report.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {report.url}
          </a>
        </div>

        {/* Summary */}
        <div className="mt-5 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded">
          <p className="text-gray-800 leading-relaxed">{analysis.summary}</p>
        </div>
      </div>

      {/* Overall Scores & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Scores</h3>
          
          <div className={`${getScoreBg(analysis.scores.seo)} rounded-xl p-5 border-2 border-opacity-50`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-8 h-8 text-indigo-600" />
                <div>
                  <div className="text-sm font-semibold text-gray-600 uppercase">SEO</div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.seo)}`}>
                    {analysis.scores.seo}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${getScoreBg(analysis.scores.performance)} rounded-xl p-5 border-2 border-opacity-50`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BoltIcon className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-sm font-semibold text-gray-600 uppercase">Performance</div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.performance)}`}>
                    {analysis.scores.performance}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${getScoreBg(analysis.scores.accessibility)} rounded-xl p-5 border-2 border-opacity-50`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EyeIcon className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-sm font-semibold text-gray-600 uppercase">Accessibility</div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.accessibility)}`}>
                    {analysis.scores.accessibility}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${getScoreBg(analysis.scores.bestPractices)} rounded-xl p-5 border-2 border-opacity-50`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-sm font-semibold text-gray-600 uppercase">Best Practices</div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.bestPractices)}`}>
                    {analysis.scores.bestPractices}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Overview</h3>
          <div className="flex items-center justify-center" style={{ height: '320px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-gray-900">Core Web Vitals</h3>
          {cwvSource === 'pagespeed' && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              ✓ Real Data from Google PageSpeed
            </span>
          )}
          {cwvSource === 'unavailable' && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
              ⚠ API Key Required
            </span>
          )}
        </div>
        
        {cwvSource === 'unavailable' && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> To get real Core Web Vitals data, add a <code className="bg-yellow-100 px-2 py-0.5 rounded">PAGESPEED_API_KEY</code> environment variable in your Wrangler configuration. 
              <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                Get API Key →
              </a>
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${getStatusColor(analysis.coreWebVitals.lcp.status)} rounded-xl p-5 border-2`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(analysis.coreWebVitals.lcp.status)}
              <h4 className="font-bold text-lg">LCP</h4>
            </div>
            <div className="text-sm font-medium">Largest Contentful Paint</div>
            <div className="text-2xl font-bold mt-2">{analysis.coreWebVitals.lcp.value}</div>
            <div className="text-sm mt-1 capitalize">{analysis.coreWebVitals.lcp.status.replace('-', ' ')}</div>
          </div>

          <div className={`${getStatusColor(analysis.coreWebVitals.fid.status)} rounded-xl p-5 border-2`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(analysis.coreWebVitals.fid.status)}
              <h4 className="font-bold text-lg">FID</h4>
            </div>
            <div className="text-sm font-medium">First Input Delay</div>
            <div className="text-2xl font-bold mt-2">{analysis.coreWebVitals.fid.value}</div>
            <div className="text-sm mt-1 capitalize">{analysis.coreWebVitals.fid.status.replace('-', ' ')}</div>
          </div>

          <div className={`${getStatusColor(analysis.coreWebVitals.cls.status)} rounded-xl p-5 border-2`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(analysis.coreWebVitals.cls.status)}
              <h4 className="font-bold text-lg">CLS</h4>
            </div>
            <div className="text-sm font-medium">Cumulative Layout Shift</div>
            <div className="text-2xl font-bold mt-2">{analysis.coreWebVitals.cls.value}</div>
            <div className="text-sm mt-1 capitalize">{analysis.coreWebVitals.cls.status.replace('-', ' ')}</div>
          </div>
        </div>

        {/* Additional metrics if available */}
        {analysis.coreWebVitals.fcp && analysis.coreWebVitals.ttfb && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className={`${getStatusColor(analysis.coreWebVitals.fcp.status)} rounded-xl p-4 border-2`}>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(analysis.coreWebVitals.fcp.status)}
                <h4 className="font-bold">FCP</h4>
              </div>
              <div className="text-xs font-medium">First Contentful Paint</div>
              <div className="text-xl font-bold mt-1">{analysis.coreWebVitals.fcp.value}</div>
            </div>

            <div className={`${getStatusColor(analysis.coreWebVitals.ttfb.status)} rounded-xl p-4 border-2`}>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(analysis.coreWebVitals.ttfb.status)}
                <h4 className="font-bold">TTFB</h4>
              </div>
              <div className="text-xs font-medium">Time to First Byte</div>
              <div className="text-xl font-bold mt-1">{analysis.coreWebVitals.ttfb.value}</div>
            </div>
          </div>
        )}
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Metrics Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Content Metrics</h3>
          <Bar data={contentData} options={barOptions} />
        </div>

        {/* Image Alt Text Doughnut */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Image Accessibility</h3>
          <div className="flex items-center justify-center">
            <div style={{ maxWidth: '300px' }}>
              <Doughnut data={imageData} options={doughnutOptions} />
            </div>
          </div>
          <div className="text-center mt-4">
            <div className="text-3xl font-bold text-gray-900">{getAltTextPercentage()}%</div>
            <div className="text-sm text-gray-600">Images with alt text</div>
          </div>
        </div>
      </div>

      {/* Findings */}
      {analysis.findings.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Findings</h3>
          <div className="space-y-3">
            {analysis.findings.map((finding, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  finding.type === 'positive'
                    ? 'bg-green-50 border-green-500'
                    : finding.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {finding.type === 'positive' ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : finding.type === 'warning' ? (
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{finding.title}</h4>
                      <span className="text-xs px-2 py-0.5 bg-white rounded-full border">
                        {finding.category}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{finding.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Recommendations</h3>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0 ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{rec.title}</h4>
                    <p className="text-gray-700 text-sm mb-2">{rec.description}</p>
                    <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded inline-block">
                      <strong>Impact:</strong> {rec.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-5">Technical Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{report.metrics.linkCount}</div>
            <div className="text-sm text-gray-600">Total Links</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{report.metrics.internalLinkCount}</div>
            <div className="text-sm text-gray-600">Internal Links</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{report.metrics.externalLinkCount}</div>
            <div className="text-sm text-gray-600">External Links</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{(report.metrics.htmlLength / 1024).toFixed(1)} KB</div>
            <div className="text-sm text-gray-600">HTML Size</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{report.metrics.textToHtmlRatio}%</div>
            <div className="text-sm text-gray-600">Text/HTML Ratio</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{report.metrics.stylesheetCount}</div>
            <div className="text-sm text-gray-600">Stylesheets</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${report.metrics.isHttps ? 'text-green-600' : 'text-red-600'}`}>
              {report.metrics.isHttps ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">HTTPS</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${report.metrics.hasViewport ? 'text-green-600' : 'text-red-600'}`}>
              {report.metrics.hasViewport ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">Viewport Meta</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDisplay;
