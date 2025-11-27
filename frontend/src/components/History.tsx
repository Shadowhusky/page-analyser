import { Report } from '../App';
import { 
  ClipboardDocumentListIcon, 
  ArrowRightIcon,
  ChartBarIcon,
  PhotoIcon,
  CodeBracketIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface HistoryProps {
  history: Report[];
  onViewReport: (report: Report) => void;
}

function History({ history, onViewReport }: HistoryProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-300">
        <ClipboardDocumentListIcon className="w-20 h-20 mx-auto mb-5 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No History Yet</h2>
        <p className="text-lg text-gray-600">Analyze your first website to see it appear here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Analysis History</h2>
        <p className="text-gray-600">
          {history.length} report{history.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="space-y-5">
        {history.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex-1">
                {report.title || 'Untitled Page'}
              </h3>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {formatDate(report.createdAt)}
              </span>
            </div>

            <div className="mb-4 text-sm break-all">
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                {report.url}
              </a>
            </div>

            {report.description && (
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                {report.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 py-4 border-t border-b border-gray-200 mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                <ChartBarIcon className="w-4 h-4" />
                H1: {report.metrics.h1Count}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                <ChartBarIcon className="w-4 h-4" />
                H2: {report.metrics.h2Count}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                <PhotoIcon className="w-4 h-4" />
                Images: {report.metrics.imgCount}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                <CodeBracketIcon className="w-4 h-4" />
                Scripts: {report.metrics.scriptCount}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                <DocumentIcon className="w-4 h-4" />
                {(report.metrics.htmlLength / 1024).toFixed(1)} KB
              </span>
            </div>

            <button
              onClick={() => onViewReport(report)}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              View Full Report
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
