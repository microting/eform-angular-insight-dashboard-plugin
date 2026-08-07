# Tab-separated CSV export for every Insight Dashboard table

Date: 2026-08-06
Status: design approved

## Problem

A dashboard view renders up to three tables per item and none of them can be
copied out as a data file:

| Table | Component | Data source | Export today |
|---|---|---|---|
| Aggregated chart data | `DashboardChartDataViewComponent` | `itemModel.chartData.rawData`, already in the browser | none |
| Raw data | `DashboardRawDataViewComponent` | server-paged endpoint, 25 rows in the browser | server-side `.xlsx` |
| Interviews | `DashboardInterviewsViewComponent` | `itemModel.textQuestionData`, already in the browser | a commented-out button calling a server-side `.xlsx` endpoint |

Users need every table as a delimited text file they can open in Excel.

## Scope

Plugin repo only: `eform-angular-insight-dashboard-plugin`.

No backend change, no `-base` change, no EF migration, no core-frontend change.
Every export is built and downloaded **in the browser**.

The session is in **base dev mode**, so edits are made inside the host app
(`eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn`)
and synced back with `devgetchanges.sh`.

## Format

The file extension is `.csv` and the delimiter is a tab. That contradiction is
deliberate and requested: users say "CSV", Excel on a Danish locale opens
tab-delimited text far more reliably than comma-delimited, and a tab almost never
occurs inside survey text.

- Fields joined by `\t`, records by `\r\n`, trailing `\r\n` after the last record.
- A field containing a tab, `\r`, `\n` or `"` is wrapped in `"` with internal
  quotes doubled — RFC 4180 quoting with tab as the delimiter. Every other field
  is emitted raw, so the common case stays free of quote noise.
- `null` and `undefined` become the empty string.
- The payload is prefixed with a UTF-8 BOM (`﻿`). Without it Excel guesses
  the code page and mangles `æ ø å` in Danish survey text.
- Blob MIME type `text/tab-separated-values;charset=utf-8`, handed to `saveAs`
  from `file-saver` — the same download path the plugin's existing `.xlsx`
  exports use.

### Filenames

`{dashboardName}_{position}_chart_data.csv`, `_raw_data.csv`, `_interviews.csv`,
where `position` is `itemModel.position`. Characters illegal in a filename
(`\ / : * ? " < > |`) and control characters are replaced with `_`; an empty or
all-illegal dashboard name falls back to `dashboard`.

## Architecture

### New: `helpers/tsv-export.helper.ts`

```ts
export function escapeTsvField(value: unknown): string;
export function buildTsv(sections: TsvSection[]): string;
export function tsvFileName(dashboardName: string, position: number, suffix: string): string;
export function downloadTsv(fileName: string, tsv: string): void;
```

```ts
export interface TsvSection {
  headers?: string[];
  rows: string[][];
}
```

A `TsvSection[]` rather than a single `(headers, rows)` pair because the
chart-data table is genuinely two stacked tables (percent block, amount block)
that must stay visually separated in the file. Sections are joined by one blank
record. A single-section export — raw data, interviews — is just an array of one.

This helper is the only place the delimiter, the quoting rule and the BOM live.
All three components call it; none of them format anything themselves.

It lives in the plugin, not in `src/app/common/helpers`, because a core-frontend
helper would mean committing to a second repository for a plugin-only feature.

### Changed components

**`DashboardChartDataViewComponent`**

Gains `@Input() dashboardViewModel` (it currently only receives `itemModel`, and
the filename needs the dashboard name — `dashboard-block-view.component.html`
already has both to hand) and an `exportToCsv()` method.

The rendered table has two shapes and the export mirrors both.

*Non grouped chart types.* For each `rawData` block, two sections:

```
                  <rawHeaders[0]>   <rawHeaders[1]>   …
<valueName>       82%               74%
<valueName>       18%               26%
                                                        <- blank record
                  <rawHeaders[0]>   <rawHeaders[1]>   …
<valueName>       41                33
<valueName>       9                 12
```

The leading header cell is empty, matching the empty `<th>` above the value-name
column on screen. Percent cells carry the `%` suffix exactly as displayed, unless
`itemModel.calculateAverage` is set, in which case the screen shows a bare number
and so does the file. **The file reproduces the table, including its units.**

*`HorizontalBarStackedGrouped`.* **One** section per block, not two. This chart
renders percentages and amounts side by side in a single row, under a single
header row whose `rawHeaders` already name both halves — verified against live
data, where a six-cell header sits above rows of three percentages followed by
three amounts. Splitting it would misalign the headers, not fix them. So the
record is `[rawValueName, valueName, ...percents, ...amounts]` under headers
`['', '', ...rawHeaders]`, with `rawValueName` promoted from the on-screen
`rowSpan` cell to a leading column repeated on every row.

When `chartData.rawData` holds several blocks, each block's sections follow the
previous block's, separated by the same blank record.

`calculateAverage` drops the percent sign in both variants. The grouped template
appends `%` unconditionally, which is an oversight: writing `4.2%` for an average
of 4.2 would be actively wrong in a data file, so the export does not reproduce
it.

**`DashboardRawDataViewComponent`**

Gains `exportToCsv()` beside the existing `exportToExcel()`.

The grid holds one page. The export issues one more call to the same
`getRawData` endpoint with `offset: 0`, `pageSize: total` and the currently
active `sort`/`isSortDsc`, then builds the file from that response. No new
endpoint, and the server-side ordering guarantees the file matches the grid's
order.

Columns exported are the ones **currently visible in the grid**, i.e.
`tableHeaders.filter(c => !c.hide)`. `mtx-grid`'s column menu toggles `hide` on
the objects the component passes in, so the column picker controls the CSV. This
is a deliberate split from the `.xlsx` export, which keeps exporting every column
including the hidden ones: the CSV is "what I am looking at", the xlsx is
"everything".

Header text comes from the already-resolved `MtxGridColumn.header`. For answer
columns that is a `TranslateService.stream(...)` observable, so the component
holds the raw `RawDataColumnModel[]` alongside `tableHeaders` and resolves answer
headers with `translateService.instant(...)` at export time. Question and option
headers are database text and are used as-is.

The button is disabled while `loading` or when `total === 0`.

Cell values are written exactly as the grid renders them, `Finished at` included
— which today means a full `Date.toString()`, `Mon Jun 29 2026 20:37:00 GMT+0200
(Central European Summer Time)`. That is what the grid shows, so that is what the
file carries. Formatting it is a change to the raw data table, listed as a
follow-up rather than smuggled in here, because a CSV that disagreed with the
screen would be worse than an ugly date.

**`DashboardInterviewsViewComponent`**

The commented-out button block is replaced by a working CSV button. Data is
`itemModel.textQuestionData`, entirely client-side, so the export is a pure
transform: headers `Date`/`Tag`/`Comments` resolved through
`translateService.instant`, and one row per entry with `date` formatted
`dd.MM.y HH:mm:ss` through Angular's `DatePipe` — the same format the grid
column declares. The button is hidden when there is no data.

The existing `exportToCsv()` method — which despite its name downloads a
server-side `.xlsx` — is renamed `exportToExcel()` for honesty and left otherwise
untouched; it has no caller today.

### Buttons and ids

| Table | Placement | Element id |
|---|---|---|
| Chart data | icon button in a right-aligned bar above the table | `dashboardChartDataExportCsv{position}` |
| Raw data | second icon button in the existing `toolbarTpl` | `dashboardRawDataExportCsv{position}` |
| Interviews | icon button in a right-aligned bar above the grid | `dashboardInterviewsExportCsv{position}` |

All three use `<mat-icon>file_download</mat-icon>` with a `matTooltip` of
`'Export to CSV' | translate`, matching the existing raw-data export button.

### i18n

One new key in `i18n/en-US.ts` and `i18n/da.ts`:

```
'Export to CSV': 'Export to CSV'      // en-US
'Export to CSV': 'Eksportér til CSV'  // da
```

`Date`, `Tag` and `Comments` already exist — the interviews grid uses them.

## Error handling

| Case | Behaviour |
|---|---|
| Chart data has no `rawData` blocks | button not rendered |
| Interviews has no rows | button not rendered |
| Raw data `total === 0`, or still loading | button rendered but disabled |
| Raw data refetch fails or returns `success: false` | no file written, `loading` cleared; the grid's own error surface already covers the request |
| Dashboard name empty or all-illegal characters | filename falls back to `dashboard_{position}_…` |

There is no row cap on the raw-data CSV. The server-side `.xlsx` export refuses
above 100 000 rows because it builds an OpenXML document in server memory; the
CSV is a string built in the browser from a response the same endpoint already
serves, so the constraint does not transfer.

## Testing

Two layers, both already wired up in this repo.

### Jest unit tests (`npm run test:unit`)

- `helpers/tsv-export.helper.spec.ts` — tab delimiter; CRLF records; BOM present
  exactly once and only at the start; a field containing a tab / a newline / a
  quote is quoted and its quotes doubled; a plain field is not quoted; `null` and
  `undefined` become empty; sections separated by one blank record; filename
  sanitising and the empty-name fallback.
- `dashboard-chart-data-view.component.spec.ts` — standard variant emits percent
  and amount sections with the right headers and `%` suffix; `calculateAverage`
  drops the suffix; `HorizontalBarStackedGrouped` emits the group column and
  aligned headers; multiple `rawData` blocks concatenate; button hidden with no
  data.
- `dashboard-raw-data-view.component.spec.ts` — export calls `getRawData` with
  `offset: 0`, `pageSize: total` and the active sort; only non-hidden columns
  reach the file; answer headers are translated and question headers are not;
  export is a no-op on `success: false`.
- `dashboard-interviews-view.component.spec.ts` — header row, date formatting,
  a comment containing a tab is quoted, button hidden when empty.

Component specs assert on the string handed to the download step rather than on
the browser download, by spying on the helper's `downloadTsv`.

### Playwright e2e (`playwright/e2e/plugins/insight-dashboard-pn/`)

These live only in the plugin repo — neither `devinstall.sh` nor
`devgetchanges.sh` touches the `playwright/` tree, so they are authored there
directly and copied into the host app to run.

New `c/insight-dashboard-csv-export.spec.ts`, following the structure of
`c/insight-dashboard-raw-data.spec.ts` (one page in `beforeAll`, a dashboard
built from a new `ChartData/DashboardCsvExport.data.ts`). That data carries a
`Linje` item and a `Vandret Bjælke Stablet Grupperet` item so both export shapes
are covered, plus a third item on the survey's text question (id 14, `Enter you
opinion about the question`) for the interviews table. A text first question
hides the period and chart type controls, so it is filled through a new
`fillTextQuestionItem` rather than `fillItem`.

Each test clicks an export button, captures the Playwright download, reads the
file off disk and asserts against its records:

- BOM present, tab-delimited fields, CRLF records, no stray LF
- filenames `{dashboard}_{position}_{table}.csv`
- non grouped chart: sections pair up as percentages then amounts, sharing a
  header, the first carrying `%` and the second not
- grouped chart: every section keeps both halves on one row, with the group name
  in the leading column
- raw data: one record per answer in the whole result — more than the page on
  screen — and headers equal to the grid's visible headers, `Tidszone` excluded
- interviews: three columns and `dd.MM.yyyy HH:mm:ss` dates

New locators are added to `InsightDashboard-DashboardView.page.ts` alongside the
existing `rawDataExportButton`.

The suite logs in as `admin@admin.com` against the `420_SDK.sql` seed, so it runs
in CI rather than against a developer's own database.

### Regression guard

The existing raw-data Playwright suite — including its `.xlsx` export test — and
the existing chart-data assertions in the `*.multi.spec.ts` suites run unchanged.
The chart-data component gains an input and a button above the table; the
existing specs locate the table by
`#dashboardViewChartData{position}_{index}` and its rows by id, none of which
move.

## Follow-ups, explicitly out of scope

- formatting `Finished at` in the raw data grid, which would also fix its export
- exporting a whole dashboard (all items, all tables) as one file
- a user preference for the delimiter
- exporting the chart itself as an image
- the `InterviewsExport` `ColCount = 6` defect that drops the `Comments` column
  from the server-side interviews `.xlsx`
- the 18 plugin jest suites that fail to compile on the removed
  `async` import from `@angular/core/testing`; the four suites this change
  touches were migrated to `waitForAsync`, the rest were left alone
