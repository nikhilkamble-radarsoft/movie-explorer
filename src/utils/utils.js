import dayjs from "dayjs";
import * as XLSX from "xlsx";

/**
 * Flexible date formatter
 * @param {string|Date|number} date - Input date
 * @param {object} options - Options
 * @param {string} options.inputFormat - Format of the input date (optional)
 * @param {string} options.outputFormat - Desired output format (default: "DD/MM/YYYY")
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  const { inputFormat, outputFormat = "DD/MM/YYYY" } = options;
  if (!date) return "";

  return inputFormat
    ? dayjs(date, inputFormat).format(outputFormat)
    : dayjs(date).format(outputFormat);
};

/**
 * Flexible time formatter
 * @param {number} seconds - Total time in seconds
 * @param {object} options - Options
 * @param {boolean} [options.showHours=false] - Whether to include hours if available
 * @returns {string} Formatted time string (e.g. "05:23" or "01:05:23")
 */
export const formatTime = (seconds, { showHours = false } = {}) => {
  if (seconds == null || isNaN(seconds)) return "00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formatted = [
    showHours ? hrs.toString().padStart(2, "0") : null,
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");

  return formatted;
};

/**
 * Get remaining time between now and a target date.
 * @param {string|Date|number} targetDate - Target future date.
 * @param {object} [options] - Options.
 * @param {string} [options.format="auto"] - Format pattern ("auto" or e.g. "{d}d {h}h {m}m").
 * @returns {{
 *   ended: boolean,
 *   days: number,
 *   hours: number,
 *   minutes: number,
 *   totalMs: number,
 *   formatted: string
 * }}
 */
export const getRemainingTime = (targetDate, { format = "auto" } = {}) => {
  if (!targetDate) {
    return {
      ended: true,
      days: 0,
      hours: 0,
      minutes: 0,
      totalMs: 0,
      formatted: "",
    };
  }

  const now = dayjs();
  const future = dayjs(targetDate);
  const diffMs = future.diff(now);

  const ended = diffMs <= 0;

  const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let formatted = "";
  if (format === "auto") {
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    formatted = parts.join(", ") || "0m";
  } else {
    formatted = format.replace("{d}", days).replace("{h}", hours).replace("{m}", minutes);
  }

  return { ended, days, hours, minutes, totalMs: diffMs, formatted };
};

/**
 * Generic Excel export function for any dataset.
 *
 * @param {Array|Object} data - Your dataset (array or nested object)
 * @param {Function} mapRow - A function that converts each item into a flat row object
 * @param {String} fileName - Name of the resulting Excel file
 * @param {String} sheetName - Name of the Excel sheet
 */
export const exportToExcel = ({ data, mapRow, fileName = "export.xlsx", sheetName = "Sheet1" }) => {
  if (!data) {
    console.error("exportToExcel: No data provided.");
    return;
  }

  // Ensure it's an array
  let arrayData = Array.isArray(data) ? data : [data];

  // Apply row mapping if provided
  const rows = mapRow ? arrayData.flatMap((item) => mapRow(item)) : arrayData;

  // Ensure it's an array of objects
  if (!Array.isArray(rows) || typeof rows[0] !== "object") {
    console.error("exportToExcel: mapRow must return an array of objects.");
    return;
  }

  // Create the worksheet & workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Download file
  XLSX.writeFile(workbook, fileName);
};
