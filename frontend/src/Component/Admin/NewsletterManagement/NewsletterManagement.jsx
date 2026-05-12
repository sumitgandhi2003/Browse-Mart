import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/authContext";
import { useTheme } from "../../../Context/themeContext";
import { FaPaperPlane, FaUsers } from "react-icons/fa";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const NewsletterManagement = () => {
  const { authToken } = useAuth();
  const { theme } = useTheme();

  const [stats, setStats] = useState({ total: 0, totalAll: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/newsletter/subscribers`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (data.success) {
          setStats({ total: data.total, totalAll: data.totalAll });
        }
      } catch (error) {
        console.error("Failed to load subscriber stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (authToken) fetchSubscribers();
  }, [authToken]);

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    if (!window.confirm(`Are you sure you want to send this newsletter to ${stats.total} subscribers?`)) {
        return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/newsletter/send`,
        { subject, content },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success) {
        setResult({
          type: "success",
          message: response.data.message,
          details: `Sent: ${response.data.sent} | Failed: ${response.data.failed}`,
        });
        setSubject("");
        setContent("");
      }
    } catch (error) {
      setResult({
        type: "error",
        message: error.response?.data?.message || "Failed to send newsletter. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className={`text-3xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          Newsletter Management
        </h2>
        <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Send updates, promotions, and news to all your subscribers.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border flex items-center gap-6`}>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl shadow-inner bg-gradient-to-br from-purple-400 to-purple-600">
            <FaUsers />
          </div>
          <div>
            <p className={`text-sm font-bold uppercase tracking-wider mb-1 text-gray-400`}>
              Active Subscribers
            </p>
            <h3 className={`text-4xl font-black ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {loadingStats ? "..." : stats.total}
            </h3>
          </div>
        </div>

        <div className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 shadow-sm border flex items-center gap-6 opacity-75`}>
           <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl shadow-inner bg-gradient-to-br from-gray-400 to-gray-600">
            <FaUsers />
          </div>
          <div>
            <p className={`text-sm font-bold uppercase tracking-wider mb-1 text-gray-400`}>
              Total Ever Subscribed
            </p>
            <h3 className={`text-4xl font-black ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {loadingStats ? "..." : stats.totalAll}
            </h3>
          </div>
        </div>
      </div>

      {/* Compose Section */}
      <div className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl p-6 md:p-8 shadow-sm border`}>
        <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          Compose Newsletter
        </h3>
        
        {result && (
            <div className={`mb-6 p-4 rounded-lg border ${
                result.type === 'success' ? 'bg-green-50/10 border-green-500/50 text-green-600 dark:text-green-400' : 'bg-red-50/10 border-red-500/50 text-red-600 dark:text-red-400'
            }`}>
                <p className="font-semibold">{result.message}</p>
                {result.details && <p className="text-sm mt-1">{result.details}</p>}
            </div>
        )}

        <form onSubmit={handleSendNewsletter} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sending}
              placeholder="e.g. 🚀 Big Summer Sale Starts Today!"
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Message Content (HTML Supported)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={sending}
              placeholder="<h1>Hello!</h1><p>Here are the latest updates...</p>"
              className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all min-h-[250px] font-mono text-sm ${
                theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              required
            />
            <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Tip: You can use standard HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, and &lt;a&gt; to format your email. The content will be wrapped in Browse Mart's beautiful email template.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={sending || !subject.trim() || !content.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send to {stats.total} Subscribers
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsletterManagement;
