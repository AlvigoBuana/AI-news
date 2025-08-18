import { MOCK_ARTICLES, MOCK_TRENDING } from "./mock-data";

const MEDIASTACK_KEY = import.meta.env.VITE_MEDIASTACK_KEY;
const NEWSAPI_KEY    = import.meta.env.VITE_NEWSAPI_KEY;
const GUARDIAN_KEY   = import.meta.env.VITE_GUARDIAN_KEY;
const GNEWS_KEY      = import.meta.env.VITE_GNEWS_KEY;
const USE_MOCK_DATA  = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function safeJson(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} :: ${text}`);
  }
  return res.json();
}

export async function fetchFromMediastack(q, limit = 10, options = {}) {
  const url = new URL("https://api.mediastack.com/v1/news");
  url.searchParams.set("access_key", MEDIASTACK_KEY);
  url.searchParams.set("languages", "en");
  url.searchParams.set("keywords", q);
  url.searchParams.set("limit", String(limit));
  if (options.from) {
    url.searchParams.set("date", options.from.split('T')[0]);
  }
  if (options.page && options.page > 1) {
    const offset = (options.page - 1) * limit;
    url.searchParams.set("offset", String(offset));
  }
  const data = await safeJson(await fetch(url));
  const arr = data?.data || [];
  return arr.map((a) => ({ source: a.source || "Mediastack", title: a.title, description: a.description || "", url: a.url, image: a.image || "", publishedAt: a.published_at, topic: q, origin: "mediastack" }));
}

export async function fetchFromNewsAPI(q, pageSize = 10, opts = {}) {
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", q || "AI");
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("sortBy", opts.sortBy || "publishedAt");
  url.searchParams.set("apiKey", NEWSAPI_KEY);
  if (opts.from) {
    url.searchParams.set("from", opts.from);
  }
  if (opts.page && opts.page > 1) {
    url.searchParams.set("page", String(opts.page));
  }
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
  if (opts.from) {
    url.searchParams.set("from-date", opts.from);
  }
  if (opts.page && opts.page > 1) {
    url.searchParams.set("page", String(opts.page));
  }
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
  if (opts.sortBy === 'popularity') {
    url.searchParams.set("sortby", "relevance");
  }
  if (opts.page && opts.page > 1) {
    url.searchParams.set("page", String(opts.page));
  }
  const data = await safeJson(await fetch(url));
  const arr = data?.articles || [];
  return arr.map((a) => ({
    source: a.source?.name || "GNews",
    title: a.title,
    description: a.description || "",
    url: a.url,
    image: a.image || "",
    publishedAt: a.publishedAt,
    topic: q,
    origin: "gnews",
  }));
}

export async function fetchCombined(q = "AI", limitPerSource = 10, sortBy = 'newest', page = 1) {
  if (USE_MOCK_DATA) {
    return Promise.resolve(MOCK_ARTICLES);
  } else {
    const opts = {
      sortBy: sortBy === 'popularity' ? 'popularity' : 'publishedAt',
      orderBy: sortBy === 'popularity' ? 'relevance' : 'newest',
      page: page,
      from: page === 1 ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() : null,
    };
    const tasks = [
      fetchFromNewsAPI(q, limitPerSource, opts),
      fetchFromGuardian(q, limitPerSource, opts),
      fetchFromMediastack(q, limitPerSource, opts),
      fetchFromGNews(q, limitPerSource, opts),
    ];
    const settled = await Promise.allSettled(tasks);
    return settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));
  }
}

export async function fetchPopularAI(limit = 5) {
  if (USE_MOCK_DATA) {
    console.log("🔥 Menggunakan Mock Data untuk 'fetchPopularAI'");
    await sleep(300);
    return Promise.resolve(MOCK_TRENDING);
  } else {
    console.log("🚀 Menggunakan API Asli untuk 'fetchPopularAI' (Trending 24 Jam)");
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const newsApiParams = { sortBy: "popularity", from: twentyFourHoursAgo };
    const guardianParams = { orderBy: "relevance", "from-date": twentyFourHoursAgo };
    const gnewsParams = { sortBy: "popularity" };
    const tasks = [
      fetchFromNewsAPI("AI", limit, newsApiParams), 
      fetchFromGuardian("AI", limit, guardianParams),
      fetchFromGNews("AI", limit, gnewsParams)
    ];
    const settled = await Promise.allSettled(tasks);
    let combinedResults = settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));
    const seenUrls = new Set();
    const uniqueResults = combinedResults.filter(article => {
      if (!article.url || seenUrls.has(article.url)) {
        return false;
      } else {
        seenUrls.add(article.url);
        return true;
      }
    });
    return uniqueResults.slice(0, limit);
  }
}