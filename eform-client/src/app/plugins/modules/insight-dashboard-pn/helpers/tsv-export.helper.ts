import {saveAs} from 'file-saver';

/**
 * The dashboard tables export as tab-separated text carrying a .csv extension.
 * The contradiction is deliberate: users ask for "CSV", but Excel on a Danish
 * locale opens tab-delimited text without a wizard, and a tab practically never
 * occurs inside survey text.
 */
const FIELD_SEPARATOR = '\t';
const RECORD_SEPARATOR = '\r\n';

/** Without it Excel guesses the code page and mangles æ, ø and å. */
export const TSV_BOM = '﻿';

const NEEDS_QUOTING = /[\t\r\n"]/;
const ILLEGAL_IN_FILE_NAME = /[\\/:*?"<>|\x00-\x1f]/g;

/**
 * One block of records. The chart data table is really two stacked tables -
 * percentages then amounts - so an export is a list of these, not a single
 * header/rows pair.
 */
export interface TsvSection {
  headers?: string[];
  rows: string[][];
}

export function escapeTsvField(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const text = String(value);
  // RFC 4180 quoting, with the tab standing in for the comma.
  return NEEDS_QUOTING.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
}

export function buildTsv(sections: TsvSection[]): string {
  const records: string[] = [];

  sections.forEach((section, index) => {
    if (index > 0) {
      records.push('');
    }
    if (section.headers) {
      records.push(toRecord(section.headers));
    }
    section.rows.forEach((row) => records.push(toRecord(row)));
  });

  if (!records.length) {
    return TSV_BOM;
  }
  return TSV_BOM + records.join(RECORD_SEPARATOR) + RECORD_SEPARATOR;
}

export function tsvFileName(
  dashboardName: string,
  position: number,
  suffix: string
): string {
  const sanitized = (dashboardName || '').replace(ILLEGAL_IN_FILE_NAME, '_');
  // A name made only of separators and whitespace carries no information, and
  // leading underscores read as a broken export.
  const name = /[^_\s]/.test(sanitized) ? sanitized.trim() : 'dashboard';
  return `${name}_${position}_${suffix}.csv`;
}

export function downloadTsv(fileName: string, tsv: string): void {
  saveAs(
    new Blob([tsv], {type: 'text/tab-separated-values;charset=utf-8'}),
    fileName
  );
}

function toRecord(fields: string[]): string {
  return fields.map(escapeTsvField).join(FIELD_SEPARATOR);
}
