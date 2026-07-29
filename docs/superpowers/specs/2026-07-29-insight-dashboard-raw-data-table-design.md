# Raw data table for Insight Dashboard chart items

Date: 2026-07-29
Status: design approved, not implemented

## Problem

Every chart in a dashboard view already renders an aggregated table beneath it
(`DashboardChartDataViewComponent`, fed by `chartData.rawData`). That table shows
percentages and counts per answer option per period — it never shows an individual
answer.

Users need the underlying data: one row per `Answer`, carrying every field the
answer holds in the database plus the `AnswerValue`s belonging to it.

## Scope

Plugin repo only: `eform-angular-insight-dashboard-plugin`.

No `-base` change, no EF migration, no SDK change. The feature is read-only over
existing SDK tables.

Because the session is in **base dev mode**, edits are made inside the host app
(`eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn` and
`eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn`)
and synced back with `devgetchanges.sh`.

## Shape of the table

### Rows

One row per `Answer` that fed the chart item the table sits under. An answer
qualifies when all of the following hold:

- `Answer.QuestionSetId == Dashboard.SurveyId`
- `Answer.FinishedAt` within the dashboard's `DateFrom`/`DateTo` (or, when
  `Dashboard.Today`, up to today 23:59:59)
- location/tag matches: the dashboard's `LocationId`/`TagId` when the item has
  `CompareEnabled == false`; otherwise the item's `CompareLocationsTags` set
- when the item sets both `FilterQuestionId` and `FilterAnswerId`, the answer has
  an `AnswerValue` with that question and option
- the answer's value for `DashboardItem.FirstQuestionId` is not among the item's
  `IgnoredAnswerValues` options
- the answer has at least one `AnswerValue` for `FirstQuestionId`
- `WorkflowState != "removed"` on the answer, its values, and every joined
  question/option/translation row

Default order: `FinishedAt` descending.

### Columns

**Answer group** — fixed, from `Answer : PnBase : BaseEntity`:

| Field | Source | Default |
|---|---|---|
| Id | `Answers.Id` | shown |
| Microting UID | `Answers.MicrotingUid` | shown |
| Finished at | `Answers.FinishedAt` | shown |
| Duration | `Answers.AnswerDuration` (seconds in DB, `mm:ss` in UI) | shown |
| Site | `Answers.SiteId` → `Sites.Name` | shown |
| Tags | `SiteTags` → `Tags.Name`, joined | shown |
| Unit | `Answers.UnitId` → `Units.MicrotingUid` | shown |
| Language | `Answers.LanguageId` → `Languages.Name` | shown |
| Survey config | `Answers.SurveyConfigurationId` → `.Name` | shown |
| Survey | `Answers.QuestionSetId` → `.Name` | hidden |
| Time zone | `Answers.TimeZone` | hidden |
| UTC adjusted | `Answers.UtcAdjusted` | hidden |
| Created at | `Answers.CreatedAt` | hidden |
| Updated at | `Answers.UpdatedAt` | hidden |
| Version | `Answers.Version` | hidden |
| Workflow state | `Answers.WorkflowState` | hidden |
| Site id / Unit id / Language id | raw FKs | hidden |

`Tags` is not a column on `Answer`, but it is what dashboards group by, so it
belongs in the default set.

Hidden columns are reachable through the mtx-grid column picker and are always
present in the Excel export.

**Answer-value group** — dynamic, built from the survey's questions:

- every non-removed `Question` with `QuestionSetId == Dashboard.SurveyId`,
  ordered by `QuestionIndex`, labelled `"{index} – {question text}"` starting at 1
  (matching `DictionaryService`'s existing numbering)
- `multi` questions expand to one column per non-removed `Option`, ordered by
  `OptionIndex`, labelled `"{question label} › {option text}"`
- every other question type gets exactly one column

Cell content by question type:

| Type | Cell |
|---|---|
| smiley (`smiley`…`smiley10`) | `"{label} ({WeightValue})"`, e.g. `Glad (75)`; `999` → `Ved ikke (999)` |
| `buttons`, `list` | the chosen option's translated name |
| `multi` | in the chosen option's own column, that option's translated name; blank in the options not chosen |
| `text`, `text_email`, `zipcode`, `number` | `AnswerValue.Value` |
| `picture`, `info_text` | blank |
| not answered (option named `na`) | `—`; for a `multi` question, `—` in *every* one of its option columns, so "skipped" stays distinct from "offered and not picked" |

Smiley labels come from the same source the chart uses, so the two agree. Where
the item has `CalculateByWeight`, that is `OptionTranslations` for the option;
otherwise it is the hardcoded Danish ladder in `ChartDataHelpers`. Reproducing
that split is deliberate — the raw table must not disagree with the chart above it.

### Placement and interaction

Rendered in `dashboard-block-view.component.html` immediately after
`<app-dashboard-chart-data-view>`, collapsed behind a disclosure reading
`▸ Raw data`. Data loads on first expand, not with the dashboard view — so the
label carries no count until it is opened, after which it reads
`▾ Raw data — 300 answers`. Collapsing again keeps the loaded page in memory;
re-expanding does not refetch.

Server-side paging and sorting. Excel export of the full unpaged result.

## Architecture

### Backend — `InsightDashboard.Pn`

New files:

| File | Role |
|---|---|
| `Controllers/RawDataController.cs` | the two routes below |
| `Services/RawDataService/IRawDataService.cs` | interface |
| `Services/RawDataService/RawDataService.cs` | orchestration |
| `Infrastructure/Helpers/AnswerFilterHelper.cs` | single source of truth for "which answers feed this item" |
| `Infrastructure/Helpers/RawDataColumnBuilder.cs` | builds the column list from the survey |
| `Infrastructure/Models/RawData/RawDataRequestModel.cs` | request |
| `Infrastructure/Models/RawData/RawDataListModel.cs` | response |
| `Infrastructure/Models/RawData/RawDataColumnModel.cs` | column descriptor |
| `Services/RawDataExcelService/IRawDataExcelService.cs` | interface |
| `Services/RawDataExcelService/RawDataExcelService.cs` | dynamic-width OpenXML writer |

Services registered in `EformInsightDashboardPlugin.ConfigureServices`:
`RawDataService` scoped, `RawDataExcelService` transient — matching how
`InterviewsService` and `InterviewsExcelService` are registered.

`InterviewsExcelService` is not reusable: it is hardcoded to `ColCount = 6` and
driven by a fixed `InterviewsExport` enum, while this export's column count
depends on the survey.

Routes:

```
POST api/insight-dashboard-pn/dashboard-items/raw-data
  → OperationDataResult<RawDataListModel>

GET  api/insight-dashboard-pn/dashboard-items/raw-data/export?dashboardId=&dashboardItemId=
  → xlsx stream
```

Both `[Authorize]`, guarded by the existing `insight-dashboard_access` claim, on a
plain `Controller` with hardcoded routes — the convention every other controller
in this plugin follows.

Contracts:

```csharp
public class RawDataRequestModel
{
    public int DashboardId { get; set; }
    public int DashboardItemId { get; set; }
    public int Offset { get; set; }
    public int PageSize { get; set; } = 25;
    public string Sort { get; set; } = "FinishedAt";
    public bool IsSortDsc { get; set; } = true;
}

public class RawDataListModel
{
    public int Total { get; set; }
    public List<RawDataColumnModel> Columns { get; set; } = new();
    public List<Dictionary<string, object>> Rows { get; set; } = new();
}

public class RawDataColumnModel
{
    public string Field { get; set; }         // "finishedAt" | "q17" | "q23_o104"
    public string Header { get; set; }        // "Finished at" | "2 – …" | "2 – … › Kantine"
    public string Kind { get; set; }          // answer | smiley | single | multiOption | number | text
    public bool DefaultHidden { get; set; }
    public bool Sortable { get; set; }        // true for answer columns, false for value columns
    public int? QuestionId { get; set; }
    public int? OptionId { get; set; }
}
```

Rows are dictionaries keyed by `Column.Field` because the column set varies per
survey. The frontend maps `Columns` straight onto `MtxGridColumn[]`.

Sorting is offered on the answer columns only. Sorting by a pivoted question value
would mean sorting on a correlated subquery per column; it is not worth the query
cost for a table whose purpose is export.

### Frontend — plugin `eform-client`

New files under
`src/app/plugins/modules/insight-dashboard-pn/`:

| File | Role |
|---|---|
| `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.{ts,html,scss}` | the component |
| `models/dashboard/raw-data/raw-data-list.model.ts` | mirrors `RawDataListModel` |
| `models/dashboard/raw-data/raw-data-column.model.ts` | mirrors `RawDataColumnModel` |
| `models/dashboard/raw-data/raw-data-request.model.ts` | mirrors `RawDataRequestModel` |
| `models/dashboard/raw-data/index.ts` | barrel |
| `services/insight-dashboard-pn-raw-data.service.ts` | the two calls |

Declared in `insight-dashboard-pn.module.ts` alongside the other view components.
Rendered from `dashboard-block-view.component.html` after
`<app-dashboard-chart-data-view>`, inside the same
`*ngIf="itemModel.firstQuestionType !== questionType.Text"` guard — text-type items
show the interviews grid instead and have no chart to reconcile against.

The component holds `@Input() dashboardId` and `@Input() itemModel`, and keeps
`expanded`, `loading`, `total`, `columns`, `rows`, and pagination in local
component state. Pagination is deliberately **not** in NgRx: it is transient
per-item view state, and a dashboard renders many items.

Column construction on the frontend:

```ts
this.tableHeaders = model.columns.map(c => ({
  header: c.kind === 'answer' ? this.translateService.stream(c.header) : of(c.header),
  field: c.field,
  hide: c.defaultHidden,
  sortable: c.sortable,
  sortProp: c.sortable ? {id: c.field} : undefined,
}));
```

Answer-column headers go through `translateService.stream(...)` like every other
grid in the plugin. Question and option headers are already resolved text from the
database and are passed through as-is.

Export button calls the export endpoint and hands the blob to `saveAs`, following
`DashboardInterviewsViewComponent.exportToCsv`.

New i18n keys in `i18n/en-US.ts` and `i18n/da.ts`: `Raw data`, `answers`,
`No raw data found`, `Export raw data`, and the fixed answer-column headers.

## Data flow

1. User expands `▸ Raw data` under item N.
2. Component POSTs `{dashboardId, dashboardItemId, offset: 0, pageSize: 25, sort: 'FinishedAt', isSortDsc: true}`.
3. `RawDataService` loads the `Dashboard` and `DashboardItem` from
   `InsightDashboardPnDbContext`, verifies the item belongs to the dashboard, then
   opens the SDK context via `core.DbContextHelper.GetDbContext()`.
4. `AnswerFilterHelper` produces an `IQueryable<Answer>` applying the rules in
   *Rows* above.
5. `Total` = `CountAsync()` on that query. The page is an ordered `Skip`/`Take`
   slice projecting only answer ids and the fixed answer fields.
6. For that page's answer ids only, load the `AnswerValue`s with their
   `Question`, `Option` and the translations for the resolved language.
7. `RawDataColumnBuilder` builds the column list from the survey's questions and
   options — independent of the page, so column order is stable across pages.
8. Values are pivoted into one dictionary per answer.

Only the current page's answer values are loaded, so the response size is bounded
by `PageSize × questions`, not by the size of the date range. This matters: the
existing chart path pulls every `AnswerValue` in range into memory before
grouping, and the raw table must not repeat that.

## Language resolution

Question and option text live only in `QuestionTranslations` and
`OptionTranslations`, keyed by `LanguageId`.

Resolution order:

1. the logged-in user's language, from the BasePn user service
2. any language the survey is deployed in, via `LanguageQuestionSet`
3. any non-removed translation

Explicitly **not** `Answer.LanguageId` — `Core.SaveAnswer` hardcodes it to the
Danish row, so it does not describe the answer's actual language. The `Language`
column still displays it, because the task is to show what the database holds.

This is also a deliberate divergence from the existing chart code, which calls
`OptionTranslations.FirstOrDefault()` with no language filter and therefore
renders whichever row the database returns first.

## Consistency with the chart

The invariant users will check first: **the raw table's row count equals the
chart's Total amount for the same item.**

It holds for every question type except `multi`. When the item's first question is
`multi`, one answer contributes several `AnswerValue`s, so the chart's total
legitimately exceeds the answer count. The expanded disclosure label names the
unit explicitly — `Raw data — 300 answers`, not a bare number — so it is never
read as a count of the same thing the chart totals.

`AnswerFilterHelper` is the only place the filter rules live for this feature.
`ChartDataHelpers` is **not** refactored to use it in this change: it is 4274 lines
containing two near-identical ~2100-line methods, and changing it risks every chart
on every dashboard. `AnswerFilterHelper` mirrors its rules, with each rule's source
line referenced in a comment. Refactoring `ChartDataHelpers` onto the shared helper
is a follow-up, tracked separately.

`AnswerHelper` is not reused either. It has two defects that would corrupt this
table: it joins `AnswerValue.QuestionId` to `QuestionTranslation.Id` instead of
`.QuestionId`, and its inner join on `Units` drops every answer with a null
`UnitId`.

## Error handling

| Case | Behaviour |
|---|---|
| Dashboard or item not found | `OperationResult` false, localized message |
| Item does not belong to the dashboard | `OperationResult` false — do not silently return the other dashboard's data |
| Item's first question type is `text` | endpoint returns false; the component is not rendered for those items anyway |
| Survey has no non-removed questions | empty column set beyond the answer group, grid shows `No raw data found` |
| Zero matching answers | `Total = 0`, empty rows, grid shows `No raw data found` |
| Export exceeding 100 000 rows | `OperationResult` false with a message naming the limit and suggesting a narrower date range, rather than exhausting memory |

The 100 000 cap is new; the existing interviews export has none.

## Testing

The plugin repo has no C# test project, so verification is Playwright, in the
existing `eform-client/playwright/e2e/plugins/insight-dashboard-pn/` suite:

1. expand `Raw data` on a smiley item and assert the row count matches the amount
   block's Total in the aggregated table above it
2. assert a known multi-select answer places each chosen option's name in that
   option's column and leaves the unchosen ones blank
3. assert a skipped question renders `—` across all of its option columns
4. assert the column picker reveals a hidden column (`Time zone`)
5. assert paging changes the rows and preserves the column set
6. assert the export button produces a file

Page objects follow the existing `InsightDashboard-DashboardView.page.ts`
conventions, with stable ids on the new elements
(`dashboardRawData{position}`, `dashboardRawDataToggle{position}`,
`dashboardRawDataExport{position}`).

## Follow-ups, explicitly out of scope

- refactoring `ChartDataHelpers` to share `AnswerFilterHelper`
- fixing the `AnswerHelper` join and inner-join defects
- fixing `InterviewsExport`'s `ColCount = 6` dropping the `Comments` column
- localizing the hardcoded Danish smiley labels
- sorting by question value columns
