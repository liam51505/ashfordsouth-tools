// src/components/SERPScraper.tsx
'use client';

import React, { useState } from 'react';

interface Result {
  id: number;
  keyword: string;
  domain: string;
  organicPosition: number | null;
  mapsPosition: number | null;
  location?: string;
  businessName?: string;
  timestamp: string;
}

type SERPScraperProps = {
  onSearch: (keyword: string) => void;
};

const SERPScraper: React.FC<SERPScraperProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If NEXT_PUBLIC_API_BASE_URL is unset, fetch will be relative to current host
  const API = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || '';

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build query string
      const params = new URLSearchParams({
        keyword,
        domain,
        ...(businessName ? { businessName } : {}),
        ...(location     ? { location }     : {}),
      });

      // Full URL (absolute if API set, otherwise relative)
      const fetchUrl = API
        ? `${API}/api/results/scrape?${params}`
        : `/api/results/scrape?${params}`;

      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: Result = await res.json();
      setResult(data);
      onSearch(keyword);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">SERP Scraper</h2>

      <form onSubmit={handleScrape} className="space-y-3 mb-4">
        {/** Keyword **/}
        <div>
          <label className="block text-sm font-medium">Keyword</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded p-2"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. best coffee"
            required
          />
        </div>

        {/** Domain **/}
        <div>
          <label className="block text-sm font-medium">Domain / URL</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded p-2"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. example.com"
            required
          />
        </div>

        {/** Business Name **/}
        <div>
          <label className="block text-sm font-medium">Business (GBP) Name</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded p-2"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Optional"
          />
        </div>

        {/** Location **/}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Scraping…' : 'Run Scrape'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {result && (
        <div className="bg-gray-50 border rounded p-4">
          <h3 className="font-medium mb-2">Result</h3>
          <ul className="list-disc list-inside">
            <li><strong>Keyword:</strong> {result.keyword}</li>
            <li><strong>Domain:</strong> {result.domain}</li>
            <li><strong>Organic Rank:</strong> {result.organicPosition ?? 'N/A'}</li>
            <li><strong>Maps Rank:</strong>    {result.mapsPosition  ?? 'N/A'}</li>
            {result.location && <li><strong>Location:</strong> {result.location}</li>}
            {result.businessName && <li><strong>Business:</strong> {result.businessName}</li>}
            <li>
              <strong>Checked at:</strong>{' '}
              {new Date(result.timestamp).toLocaleString()}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SERPScraper;
