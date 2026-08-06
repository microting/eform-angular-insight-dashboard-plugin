import {
  TSV_BOM,
  TsvSection,
  buildTsv,
  escapeTsvField,
  tsvFileName,
} from './tsv-export.helper';

describe('tsv-export.helper', () => {
  describe('escapeTsvField', () => {
    it('leaves a plain value untouched', () => {
      expect(escapeTsvField('Kantine')).toBe('Kantine');
    });

    it('turns null and undefined into an empty field', () => {
      expect(escapeTsvField(null)).toBe('');
      expect(escapeTsvField(undefined)).toBe('');
    });

    it('keeps a zero rather than dropping it as falsy', () => {
      expect(escapeTsvField(0)).toBe('0');
    });

    it('quotes a value containing the delimiter', () => {
      expect(escapeTsvField('a\tb')).toBe('"a\tb"');
    });

    it('quotes a value containing a newline', () => {
      expect(escapeTsvField('line one\nline two')).toBe('"line one\nline two"');
      expect(escapeTsvField('line one\r\nline two')).toBe('"line one\r\nline two"');
    });

    it('quotes a value containing a quote and doubles the inner quotes', () => {
      expect(escapeTsvField('he said "no"')).toBe('"he said ""no"""');
    });
  });

  describe('buildTsv', () => {
    const singleSection: TsvSection[] = [
      {headers: ['Date', 'Tag'], rows: [['2026-03-02', 'Location 1']]},
    ];

    it('starts with a byte order mark exactly once', () => {
      const tsv = buildTsv(singleSection);
      expect(tsv.startsWith(TSV_BOM)).toBe(true);
      expect(tsv.slice(1)).not.toContain(TSV_BOM);
    });

    it('separates fields with a tab', () => {
      const tsv = buildTsv(singleSection);
      expect(tsv.slice(TSV_BOM.length).split('\r\n')[0]).toBe('Date\tTag');
    });

    it('separates records with CRLF and terminates the last one', () => {
      const tsv = buildTsv(singleSection);
      expect(tsv).toBe(`${TSV_BOM}Date\tTag\r\n2026-03-02\tLocation 1\r\n`);
    });

    it('separates sections with one blank record', () => {
      const tsv = buildTsv([
        {headers: ['', 'Jan'], rows: [['Glad', '82%']]},
        {headers: ['', 'Jan'], rows: [['Glad', '41']]},
      ]);
      expect(tsv).toBe(
        `${TSV_BOM}\tJan\r\nGlad\t82%\r\n\r\n\tJan\r\nGlad\t41\r\n`
      );
    });

    it('allows a section without headers', () => {
      expect(buildTsv([{rows: [['a', 'b']]}])).toBe(`${TSV_BOM}a\tb\r\n`);
    });

    it('escapes every field it writes, headers included', () => {
      const tsv = buildTsv([
        {headers: ['a\tb'], rows: [['he said "no"']]},
      ]);
      expect(tsv).toBe(`${TSV_BOM}"a\tb"\r\n"he said ""no"""\r\n`);
    });

    it('produces just the marker when there is nothing to write', () => {
      expect(buildTsv([])).toBe(TSV_BOM);
      expect(buildTsv([{rows: []}])).toBe(TSV_BOM);
    });
  });

  describe('tsvFileName', () => {
    it('joins the dashboard name, position and suffix', () => {
      expect(tsvFileName('Raw data', 2, 'raw_data')).toBe('Raw data_2_raw_data.csv');
    });

    it('replaces characters a file system will not take', () => {
      expect(tsvFileName('a/b:c*d?e"f<g>h|i\\j', 1, 'interviews')).toBe(
        'a_b_c_d_e_f_g_h_i_j_1_interviews.csv'
      );
    });

    it('falls back when the name is empty or entirely illegal', () => {
      expect(tsvFileName('', 1, 'chart_data')).toBe('dashboard_1_chart_data.csv');
      expect(tsvFileName('   ', 1, 'chart_data')).toBe('dashboard_1_chart_data.csv');
      expect(tsvFileName('///', 1, 'chart_data')).toBe('dashboard_1_chart_data.csv');
      expect(tsvFileName(null, 1, 'chart_data')).toBe('dashboard_1_chart_data.csv');
    });
  });
});
