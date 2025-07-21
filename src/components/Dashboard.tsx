import React, { useState } from "react";
import SERPScraper from "./SERPScraper";
import SEOKeywordGPT from "./SEOKeywordGPT";

// Type for search history entries
type HistoryEntry = {
    id: number;
    tool: "SERP Scraper" | "SEO Keyword GPT";
    keyword: string;
    date: string; // ISO string
};

const ITEMS_PER_PAGE = 10;

const Dashboard: React.FC = () => {
    // Demo: You’d probably fetch/save this from/to a backend in a real app
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // These handlers simulate saving a search (pass to your tool components as props)
    const addHistory = (tool: "SERP Scraper" | "SEO Keyword GPT", keyword: string) => {
        setHistory((prev) => [
            { id: Date.now(), tool, keyword, date: new Date().toISOString() },
            ...prev,
        ]);
        setCurrentPage(1); // go to first page when new entry added
    };

    // Pagination logic
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
    const displayedHistory = history.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Pass addHistory to tool components as a prop
    return (
        <div style={{ padding: 32, fontFamily: "sans-serif" }}>
            <h1>Internal Tools Dashboard</h1>
            <div
                style={{
                    display: "flex",
                    gap: 24,
                    alignItems: "flex-start",
                    marginBottom: 32,
                }}
            >
                <div
                    style={{
                        flex: 1,
                        background: "#f9f9f9",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        padding: 24,
                        minWidth: 320,
                    }}
                >
                    <SERPScraper onSearch={(keyword) => addHistory("SERP Scraper", keyword)} />
                </div>
                <div
                    style={{
                        flex: 1,
                        background: "#f9f9f9",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        padding: 24,
                        minWidth: 320,
                    }}
                >
                    <SEOKeywordGPT onSearch={(keyword) => addHistory("SEO Keyword GPT", keyword)} />
                </div>
            </div>

            {/* Search history with pagination */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 10,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.04)",
                    padding: 24,
                    maxWidth: 700,
                    margin: "0 auto",
                }}
            >
                <h2 style={{ marginBottom: 16 }}>Search History</h2>
                {history.length === 0 ? (
                    <p style={{ color: "#999" }}>No search history yet.</p>
                ) : (
                    <>
                        <table style={{ width: "100%", marginBottom: 16 }}>
                            <thead>
                            <tr>
                                <th style={{ textAlign: "left" }}>Tool</th>
                                <th style={{ textAlign: "left" }}>Keyword</th>
                                <th style={{ textAlign: "left" }}>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedHistory.map((entry) => (
                                <tr key={entry.id}>
                                    <td>{entry.tool}</td>
                                    <td>{entry.keyword}</td>
                                    <td>
                                        {new Date(entry.date).toLocaleString(undefined, {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        })}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div style={{ textAlign: "center" }}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                style={{ marginRight: 12 }}
                            >
                                Previous
                            </button>
                            <span>
                Page {currentPage} of {totalPages}
              </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                style={{ marginLeft: 12 }}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
