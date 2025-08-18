import { motion } from "framer-motion";
import { formatRelativeTime } from "../lib/utils";
import { useState } from "react";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  },
  exit: { y: -20, opacity: 0 }
};

const sourceStyles = {
  newsapi: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  guardian: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  mediastack: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  gnews: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  mock: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
};

export default function NewsCard({ item }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.a
      variants={itemVariants}
      layout
      whileHover={{ y: -6, scale: 1.03 }}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {item.topic}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${sourceStyles[item.origin] || sourceStyles.mock}`}>
            {item.origin}
          </span>
        </div>

        <div className="mb-3 overflow-hidden rounded-xl">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-40 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-500 text-sm">No Image</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <h3 className="text-lg font-semibold leading-tight mb-2 text-zinc-900 dark:text-zinc-100">
          {item.title}
        </h3>
        {item.description && (
          // --- PERBAIKAN DI SINI: Diberi tinggi tetap h-20 (5rem) ---
          // Ini setara dengan 4 baris teks (line-height 1.25rem * 4)
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-4 h-20">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="text-xs text-zinc-500">{formatRelativeTime(item.publishedAt)}</div>
        <button
          onClick={handleCopyLink}
          className="relative px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
          title="Copy link"
        >
          {copied ? (
            "Link Copied!"
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186ZM16.5 7.5a2.25 2.25 0 1 0-3.933-2.185 2.25 2.25 0 0 0 3.933 2.185Z" />
            </svg>
          )}
        </button>
      </div>
    </motion.a>
  );
}