import { useState, FormEvent } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface InspectorFormProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

function InspectorForm({ onAnalyze, loading }: InspectorFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Website URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-5 py-3.5 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Enter any public website URL to get SEO and performance insights
        </p>
      </form>
    </div>
  );
}

export default InspectorForm;
