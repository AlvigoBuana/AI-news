import { MOCK_ARTICLES, MOCK_TRENDING } from "./mock-data";

const NEWSAPI_KEY      = import.meta.env.VITE_NEWSAPI_KEY;
const GUARDIAN_KEY     = import.meta.env.VITE_GUARDIAN_KEY;
const GNEWS_KEY        = import.meta.env.VITE_GNEWS_KEY;
const NEWSDATA_KEY     = import.meta.env.VITE_NEWSDATA_KEY; 
const CURRENTSAPI_KEY  = import.meta.env.VITE_CURRENTSAPI_KEY;
const USE_MOCK_DATA    = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function safeJson(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} :: ${text}`);
  }
  return res.json();
}

export async function fetchFromNewsAPI(q, pageSize = 10, opts = {}) {
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", q || "AI");
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("sortBy", opts.sortBy || "publishedAt");
  url.searchParams.set("apiKey", NEWSAPI_KEY);
  if (opts.from) { url.searchParams.set("from", opts.from); }
  if (opts.page && opts.page > 1) { url.searchParams.set("page", String(opts.page)); }
  const data = await safeJson(await fetch(url));
  const arr = data?.articles || [];
  return arr.map((a) => ({ source: a.source?.name || "NewsAPI", title: a.title, description: a.description || "", url: a.url, image: a.urlToImage || "", publishedAt: a.publishedAt, topic: q, origin: "newsapi" }));
}

export async function fetchFromGuardian(q, pageSize = 10, opts = {}) {
  const url = new URL("https://content.guardianapis.com/search");
  url.searchParams.set("q", q || "AI");
  url.searchParams.set("api-key", GUARDIAN_KEY);
  url.searchParams.set("page-size", String(pageSize));
  url.searchParams.set("order-by", opts.orderBy || "newest");
  url.searchParams.set("show-fields", "trailText,webPublicationDate,thumbnail");
  if (opts.from) { url.searchParams.set("from-date", opts.from); }
  if (opts.page && opts.page > 1) { url.searchParams.set("page", String(opts.page)); }
  const data = await safeJson(await fetch(url));
  const arr = data?.response?.results || [];
  return arr.map((a) => ({ source: "The Guardian", title: a.webTitle, description: a.fields?.trailText || "", url: a.webUrl, image: a.fields?.thumbnail || "", publishedAt: a.webPublicationDate, topic: q, origin: "guardian" }));
}

export async function fetchFromGNews(q, max = 10, opts = {}) {
  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", q || "AI");
  url.searchParams.set("apikey", GNEWS_KEY);
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", String(max));
  if (opts.sortBy === 'popularity') { url.searchParams.set("sortby", "relevance"); }
  if (opts.from) { url.searchParams.set("from", opts.from); }
  if (opts.page && opts.page > 1) { url.searchParams.set("page", String(opts.page)); }
  const data = await safeJson(await fetch(url));
  const arr = data?.articles || [];
  return arr.map((a) => ({ source: a.source?.name || "GNews", title: a.title, description: a.description || "", url: a.url, image: a.image || "", publishedAt: a.publishedAt, topic: q, origin: "gnews" }));
}

export async function fetchFromNewsData(q, pageSize = 10, opts = {}) {
  const url = new URL("https://newsdata.io/api/1/news");
  url.searchParams.set("apikey", NEWSDATA_KEY);
  url.searchParams.set("language", "en");
  url.searchParams.set("q", q || "AI");
  if (opts.page && opts.page > 1) { url.searchParams.set("page", opts.page); }
  const data = await safeJson(await fetch(url));
  const arr = data?.results || [];
  return arr.map((a) => ({ source: a.source_id || "NewsData.io", title: a.title, description: a.description || "", url: a.link, image: a.image_url || "", publishedAt: a.pubDate, topic: q, origin: "newsdata" }));
}

export async function fetchFromCurrents(q, pageSize = 10, opts = {}) {
  const url = new URL("https://api.currentsapi.services/v1/search");
  url.searchParams.set("apiKey", CURRENTSAPI_KEY);
  url.searchParams.set("keywords", q || "AI");
  url.searchParams.set("language", "en");
  if (opts.page && opts.page > 1) { url.searchParams.set("page_number", String(opts.page)); }
  if (opts.from) { url.searchParams.set("start_date", new Date(opts.from).toISOString()); }
  const data = await safeJson(await fetch(url));
  const arr = data?.news || [];
  return arr.map((a) => ({ source: a.author || "Currents API", title: a.title, description: a.description || "", url: a.url, image: a.image || "", publishedAt: a.published, topic: q, origin: "currents" }));
}

// FUNGSI INI KEMBALI MENJADI FUNGSI UTAMA UNTUK SEARCH DAN FILTER TOPIK
export async function fetchCombined(q = "AI", limitPerSource = 10, sortBy = 'newest', page = 1) {
  if (USE_MOCK_DATA) {
    return Promise.resolve(MOCK_ARTICLES);
  }
  const opts = {
    sortBy: sortBy === 'popularity' ? 'popularity' : 'publishedAt',
    orderBy: sortBy === 'popularity' ? 'relevance' : 'newest',
    page: page,
  };
  const tasks = [
    fetchFromNewsAPI(q, limitPerSource, opts),
    fetchFromGuardian(q, limitPerSource, opts),
    fetchFromNewsData(q, limitPerSource, opts),
    fetchFromGNews(q, limitPerSource, opts),
    fetchFromCurrents(q, limitPerSource, opts),
  ];
  const settled = await Promise.allSettled(tasks);
  settled.forEach(result => {
    if (result.status === 'rejected') {
      console.warn("Satu sumber API gagal:", result.reason.message);
    }
  });
  return settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));
}

export async function fetchPopularAI(limit = 5) {
  if (USE_MOCK_DATA) {
    return Promise.resolve(MOCK_TRENDING);
  }
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const commonParams = { from: twentyFourHoursAgo, page: 1 };
  const tasks = [
    fetchFromNewsAPI("AI", limit, { ...commonParams, sortBy: "popularity" }),
    fetchFromGuardian("AI", limit, { ...commonParams, orderBy: "relevance" }),
    fetchFromGNews("AI", limit, { ...commonParams, sortBy: "popularity" }),
    fetchFromCurrents("AI", limit, commonParams),
    fetchFromNewsData("AI", limit, commonParams),
  ];
  const settled = await Promise.allSettled(tasks);
  let combinedResults = settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));
  const seenUrls = new Set();
  const uniqueResults = combinedResults.filter(article => {
    if (!article.url || seenUrls.has(article.url)) return false;
    seenUrls.add(article.url);
    return true;
  });
  return uniqueResults.slice(0, limit);
}