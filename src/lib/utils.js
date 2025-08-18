import { formatDistanceToNow } from "date-fns";

// Daftar topik default
export const DEFAULT_TOPICS = [
  "Machine Learning",
  "LLMs",
  "Generative AI",
  "Robotics",
];

// Fungsi baru untuk format tanggal relatif
export function formatRelativeTime(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Mengembalikan format seperti "about 2 hours ago"
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Invalid date string:", dateString, error);
    return dateString; // Fallback ke string asli jika ada error
  }
}