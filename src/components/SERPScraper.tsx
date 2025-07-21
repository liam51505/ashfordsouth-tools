import React, { useState } from "react";

// Define the props type
type SERPScraperProps = {
    onSearch: (keyword: string) => void;
};

const SERPScraper: React.FC<SERPScraperProps> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState("");
    const [domain, setDomain] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [searchLocation, setSearchLocation] = useState(""); // <-- use 'searchLocation'
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string | null>(null);

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        setResults(`Fake results for "${keyword}"`);
        onSearch(keyword); // <-- This now matches the type
    };

    return (
        <div>
            <h2>SERP Scraper</h2>
            <form onSubmit={handleScrape}>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        Keyword:
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g. best coffee"
                            style={{ marginLeft: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        URL/Domain:
                        <input
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="e.g. example.com"
                            style={{ marginLeft: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        GBP Name:
                        <input
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. John's Coffee Shop"
                            style={{ marginLeft: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        Location:
                        <input
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            placeholder="e.g. New York, NY"
                            style={{ marginLeft: 8 }}
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Scraping..." : "Scrape"}
                </button>
            </form>

            {results && <pre>{results}</pre>}
        </div>
    );
};

export default SERPScraper;
