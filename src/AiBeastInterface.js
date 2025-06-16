import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AiBeastInterface() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('meta-llama/llama-3.3-8b-instruct:free');
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);

  // API key for OpenRouter
  const defaultApiKey = "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";

  // Fetch available models from OpenRouter API on component mount
  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true);
      try {
        const response = await axios.get(
          'https://openrouter.ai/api/v1/models',
          {
            headers: {
              'Authorization': `Bearer ${defaultApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Extract model IDs from the response
        const modelList = response.data.data.map(model => model.id);
        setModels(modelList);
        setModelsLoading(false);
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback to a default list if API call fails
        setModels([
          "meta-llama/llama-3.3-8b-instruct:free",
          "microsoft/phi-4-reasoning:free",
          "gpt-4o",
          "llama3",
          "claude-3"
        ]);
        setModelsLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            'Authorization': `Bearer ${defaultApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setOutput(response.data.choices[0].message.content);
    } catch (error) {
      setOutput('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white font-sans flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header with Logo and Branding */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-6 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg"><span className="text-yellow-300">⚡</span></div>
          <h1 className="text-3xl font-extrabold tracking-wider">AiBeast <span className="text-purple-400">CyberStrike</span></h1>
        </div>
        <div className="text-lg font-black text-purple-200 tracking-tight" style={{ textShadow: '0 0 5px #a855f7, 0 0 10px #a855f7, 0 0 15px #9333ea, 2px 2px 2px rgba(0,0,0,0.5), -1px -1px 2px rgba(255,255,255,0.2)' }}>Powered by Mirza Usman, Tech Titan ⚡💻</div>
      </header>

      {/* Main Content Area (Chat Window) */}
      <main className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden mb-6 border border-purple-700/30">
        {/* Chat Header */}
        <div className="p-4 border-b border-purple-700/50 bg-gradient-to-r from-purple-800/30 to-indigo-800/30">
          <h2 className="text-xl font-semibold flex items-center gap-2"><span className="text-2xl">💬</span> AI Conversation</h2>
          <p className="text-xs text-purple-300 mt-1">Interact with powerful AI models</p>
        </div>

        {/* Chat Messages Area */}
        <div className="h-[50vh] sm:h-[60vh] overflow-y-auto p-6 flex flex-col gap-6 bg-black/20">
          {output ? (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="self-start max-w-[80%] bg-purple-700/50 border border-purple-600 rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">⚡</div>
                  <span className="text-sm text-purple-200">You</span>
                </div>
                <pre className="whitespace-pre-wrap text-white text-sm">{input}</pre>
              </div>
              <div className="self-end max-w-[80%] bg-indigo-800/50 border border-indigo-700 rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm">AI</div>
                  <span className="text-sm text-indigo-200">AiBeast ({model.split('/')[1] || model})</span>
                </div>
                <pre className="whitespace-pre-wrap text-white text-sm">{output}</pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-purple-300 text-center animate-pulseSlow">
              <div className="w-24 h-24 bg-purple-500/30 rounded-full flex items-center justify-center mb-4"><span className="text-4xl">⚡</span></div>
              <p className="text-lg">{loading ? 'AI is thinking... 🤔' : 'Your AI companion awaits. Ask anything!'}</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-purple-700/50 bg-black/30">
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
            <select 
              value={model} 
              onChange={e => setModel(e.target.value)}
              disabled={modelsLoading}
              className="w-full sm:w-1/5 bg-black/70 p-3 rounded-lg text-white border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              {modelsLoading ? (
                <option>Loading models...</option>
              ) : (
                models.map(m => <option key={m} value={m}>{m.split('/')[1] || m}</option>)
              )}
            </select>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full sm:flex-1 bg-black/70 p-3 rounded-lg text-white border border-purple-600 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="🤔 Type your question or prompt here..."
            />
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm"
              disabled={loading || !input.trim()}
            >
              {loading ? '⚙️ Processing...' : '⚡ Send Prompt'}
            </button>
          </div>
          <div className="mt-2 text-xs text-purple-400 text-center">Your queries are processed securely with advanced AI models.</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center text-purple-400 text-sm p-4 bg-white/5 backdrop-blur-md rounded-xl border border-purple-800/30">
        <p>© 2025 AiBeast CyberStrike | Forged with ⚡ by Mirza Usman, Master of Code & AI</p>
        <div className="flex justify-center gap-3 mt-2 text-xs">
          <a href="https://github.com/professorAidark" target='blank' className="hover:text-purple-300 transition-colors">GitHub</a>
          <a href="#" className="hover:text-purple-300 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-purple-300 transition-colors">Portfolio</a>
        </div>
      </footer>
    </div>
  );
}
