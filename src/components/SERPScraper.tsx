// src/components/SERPScraper.tsx
import React, { useState } from "react";

// Mirror your Java Result DTO (add/remove fields to match your actual Result.java)
interface Result {
  id: number;
  keyword: string;
  domain: string;
  rank: number;
  location?: string;
  businessName?: string;
  timestamp: string;
}

type SERPScraperProps = {
  onSearch: (keyword: string) => void;
};

const SERPScraper: React.FC<SERPScraperProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [domain, setDomain] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  // This gets replaced at build time by your .env (must start with NEXT_PUBLIC_)
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) Build the URL with query parameters
      const url = new URL(`${API}/api/results/scrape`);
      url.searchParams.set("keyword", keyword);
      url.searchParams.set("domain", domain);
      if (location)     url.searchParams.set("location", location);
      if (businessName) url.searchParams.set("businessName", businessName);

      // 2) Fetch from your Spring Boot service
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }
      const data: Result = await res.json();

      // 3) Update the UI and history
      setResult(data);
      onSearch(keyword);
    } catch (err: any) {
      console.error("Scrape failed:", err);
      setError(err.message || "Unknown error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>SERP Scraper</h2>
      <form onSubmit={handleScrape} style={{ marginBottom: 16 }}>
        <div>
          <label>
            Keyword:
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. best coffee"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Domain:
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. example.com"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location:
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY"
            />
          </label>
        </div>
        <div>
          <label>
            GBP Name:
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. John's Coffee Shop"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Scraping…" : "Scrape"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {result && (
        <div style={{ textAlign: "left" }}>
          <h3>Result</h3>
          <ul>
            <li><strong>Keyword:</strong> {result.keyword}</li>
            <li><strong>Domain:</strong> {result.domain}</li>
            <li><strong>Rank:</strong> {result.rank}</li>
            {result.location && <li><strong>Location:</strong> {result.location}</li>}
            {result.businessName && <li><strong>Business:</strong> {result.businessName}</li>}
            <li><strong>Checked at:</strong> {new Date(result.timestamp).toLocaleString()}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SERPScraper;
