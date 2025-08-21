import { useEffect, useMemo, useState, useCallback } from "react";
import Header from "./components/header";
import HeroSlider from "./components/heroslider";
import TopicChips from "./components/topicchips";
import NewsCard from "./components/newscard";
import SkeletonCard from "./components/skeletoncard";
import EmptyState from "./components/emptystate";
import PopularList from "./components/popularlist";
import SortControls from "./components/sortcontrols";
import { DEFAULT_TOPICS } from "./lib/utils";
import { fetchCombined, fetchPopularAI } from "./lib/api";
import { motion, AnimatePresence } from "framer-motion";

function deduplicateArticles(articles) {
  const seenUrls = new Set();
  return articles.filter((article) => {
    if (!article.url || seenUrls.has(article.url)) return false;
    else { seenUrls.add(article.url); return true; }
  });
}

const TOPICS_WITH_ALL = ["All News", ...DEFAULT_TOPICS];
const INITIAL_TOPIC = "All News";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  const [isHomeView, setIsHomeView] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState(INITIAL_TOPIC);
  const [topicCache, setTopicCache] = useState(new Map());
  const [articles, setArticles] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const gridCols = useMemo(() => `grid gap-6 sm:grid-cols-2 ${isHomeView ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`, [isHomeView]);

  // FUNGSI INI DIPERBARUI untuk menerima nomor halaman
  const fetchInitialNews = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      // Hanya fetch popular news di halaman pertama saja
      if (pageNum === 1) {
        const popularNews = await fetchPopularAI(5);
        setPopular(popularNews);
      }

      // Gunakan pageNum untuk mengambil halaman data yang benar
      const initialArticles = await fetchCombined("AI OR technology", 15, 'newest', pageNum);
      const uniqueInitialArticles = deduplicateArticles(initialArticles);
      uniqueInitialArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      
      // Jika halaman 1, ganti total artikel. Jika lebih, tambahkan ke yang sudah ada.
      if (pageNum === 1) {
        setArticles(uniqueInitialArticles);
        setTopicCache(prevCache => new Map(prevCache).set("All News_newest", uniqueInitialArticles));
      } else {
        setArticles(prev => deduplicateArticles([...prev, ...uniqueInitialArticles]));
      }
      setPage(pageNum);

    } catch (e) {
      setError("Failed to fetch initial headlines.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialNews(1);
  }, [fetchInitialNews]);

  const handleTopicFilter = useCallback(async (topic, sort = 'newest') => {
    setIsHomeView(false);
    setActiveTopic(topic);
    setQuery("");
    setSortBy(sort);
    setPage(1);
    
    const cacheKey = `${topic}_${sort}`;
    if (topicCache.has(cacheKey)) {
      setArticles(topicCache.get(cacheKey));
      return;
    }

    setArticles([]);
    setLoading(true);
    setError("");
    try {
      const newArticles = await fetchCombined(topic, 20, sort);
      const uniqueArticles = deduplicateArticles(newArticles);
      if (sort === 'newest') {
        uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }
      setArticles(uniqueArticles);
      setTopicCache(prevCache => new Map(prevCache).set(cacheKey, uniqueArticles));
    } catch (e) {
      setError("Failed to fetch this topic.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [topicCache]);

  const runSearch = useCallback(async (q, sort = 'newest') => {
    const keyword = q?.trim();
    if (!keyword) return;

    setIsHomeView(false);
    setActiveTopic('');
    setQuery(keyword);
    setSortBy(sort);
    setPage(1);
    setArticles([]);
    setLoading(true);
    setError("");

    try {
      const searchResult = await fetchCombined(keyword, 25, sort);
      const uniqueArticles = deduplicateArticles(searchResult);
      if (sort === 'newest') {
        uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }
      setArticles(uniqueArticles);
    } catch (e) {
      setError("Failed to fetch news.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGoHome = () => {
    setIsHomeView(true);
    setActiveTopic(INITIAL_TOPIC);
    setQuery("");
    setSortBy('newest');
    setPage(1);
    fetchInitialNews(1); // Selalu fetch ulang halaman pertama saat ke home
  };
  
  const handleSortChange = (newSortOrder) => {
    if (query) {
      runSearch(query, newSortOrder);
    } else if (activeTopic) {
      handleTopicFilter(activeTopic, newSortOrder);
    }
  };
  
  // FUNGSI INI DIPERBARUI agar bisa memanggil API baru di homepage
  const handleLoadMore = () => {
    const nextPage = page + 1;
    // Jika di halaman utama, panggil API untuk halaman selanjutnya
    if (isHomeView) {
      fetchInitialNews(nextPage);
    } else {
      // Jika di halaman search/filter, lakukan client-side pagination
      setPage(nextPage);
    }
  };

  const articlesToShow = articles.slice(0, page * pageSize);
  const hasMoreArticles = articles.length > articlesToShow.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:bg-[length:400%_400%] dark:animate-gradient">
      <Header
        searchQuery={query}
        onSearchChange={setQuery}
        onSearch={() => runSearch(query)}
        loading={loading}
        onGoHome={handleGoHome}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      {isHomeView && (
        <section className="max-w-7xl mx-auto px-4 pt-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">⚡ Trending Today</h2>
          <HeroSlider trendingNews={popular} />
        </section>
      )}

      <main className={`max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 ${isHomeView ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-6`}>
        <div className={isHomeView ? 'lg:col-span-3 space-y-6' : 'col-span-full space-y-6'}>
          <div className="my-8">
            <TopicChips topics={TOPICS_WITH_ALL} active={activeTopic} onPick={handleTopicFilter} />
          </div>
          
          {!isHomeView && (
            <div>
              <h2 className="text-2xl font-bold pl-4 border-l-4 border-indigo-500">
                {query ? `Search Results for "${query}"` : `Results for "${activeTopic}"`}
              </h2>
              <SortControls sortBy={sortBy} onSortChange={handleSortChange} />
            </div>
          )}
          
          {isHomeView && (
            <h2 className="text-2xl font-bold pt-4 border-t border-zinc-200 dark:border-zinc-800 pl-4 border-l-4 border-indigo-500">Latest News</h2>
          )}

          {error && (<div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">{error}</div>)}
          
          {loading && articles.length === 0 ? (
            isHomeView ? (
              <motion.section className={gridCols}>
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={`skel-load-${i}`} />)}
              </motion.section>
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4 animate-pulse">🛰️</div>
                <h3 className="text-lg font-semibold mb-1">Searching for relevant news...</h3>
                <p className="text-zinc-500">Please wait a moment.</p>
              </div>
            )
          ) : (
            <motion.section
              className={gridCols}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {articlesToShow.length > 0
                  ? articlesToShow.map((item) => <NewsCard key={item.url} item={item} />)
                  : !loading && (<EmptyState message="No results found." />)}
              </AnimatePresence>
            </motion.section>
          )}

          {hasMoreArticles && (
            <div className="flex justify-center pt-8">
              <button onClick={handleLoadMore} disabled={loading} className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 disabled:opacity-60 transition-transform active:scale-95">
                {loading ? "Loading More..." : "Load More"}
              </button>
            </div>
          )}
        </div>
        
        {isHomeView && (
          <aside className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold pt-4 lg:pt-0 pl-3 border-l-4 border-indigo-500">🔥 Popular Today</h2>
            <PopularList items={popular} />
          </aside>
        )}
      </main>

      <footer className="mt-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-zinc-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AI News Portal</p>
          <p>Sources: NewsAPI · The Guardian · GNews · NewsData · Currents</p>
        </div>
      </footer>
    </div>
  );
}