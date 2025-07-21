import React, { useState } from "react";

// Define the props type
type SEOKeywordGPTProps = {
    onSearch: (keyword: string) => void;
};

const SEOKeywordGPT: React.FC<SEOKeywordGPTProps> = ({ onSearch }) => {
    const [input, setInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);

    const handleFindKeywords = async (e: React.FormEvent) => {
        e.preventDefault();
        setKeywords(["keyword1", "keyword2", "keyword3"]);
        onSearch(input); // <-- This now matches the type
    };

    return (
        <div>
            <h2>SEO Keyword GPT</h2>
            <form onSubmit={handleFindKeywords}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Client Info"
                />
                <button type="submit">Find Keywords</button>
            </form>
            <ul>
                {keywords.map((kw, i) => (
                    <li key={i}>{kw}</li>
                ))}
            </ul>
        </div>
    );
};

export default SEOKeywordGPT;
