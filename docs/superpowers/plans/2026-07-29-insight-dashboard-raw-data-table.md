# Raw Data Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a collapsible, server-paged table under each dashboard chart showing one row per `Answer`, with every Answer database field and its `AnswerValue`s pivoted into one column per question.

**Architecture:** A new `RawDataController` exposes a paged JSON endpoint and an xlsx export. A new `AnswerFilterHelper` reproduces the exact answer-membership rules `ChartDataHelpers` uses, so the table reconciles with the chart above it. A new `RawDataColumnBuilder` derives the dynamic column set from the survey's questions and options. The Angular side maps the returned column descriptors onto `MtxGridColumn[]`, so the grid is entirely data-driven.

**Tech Stack:** C# / .NET 10 / EF Core / ASP.NET Core `Controller`; Angular 20 / NgRx / `@ng-matero/extensions` mtx-grid / `@swimlane/ngx-charts`; DocumentFormat.OpenXml 3.5.1; Playwright + jest.

## Global Constraints

- **Dev mode is BASE DEV MODE.** All edits go in the host app: `/home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/` and `/home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn/`. **Never** edit the plugin source repo directly during implementation.
- **Never** run `devinstall.sh` — it destroys dev-mode state.
- **Never** `git add .` or `git commit -a`. Stage files by name.
- **No** `-base` repo changes and **no** EF migrations. This feature is read-only over existing SDK tables.
- **No** `.csproj` or `.sln` edits. Every package the code needs is already available transitively: `DocumentFormat.OpenXml` 3.5.1. **ClosedXML is NOT available** — do not reference it.
- Target framework `net10.0`. C# file-scoped namespaces, `namespace X;` form, matching surrounding files.
- Every new C# file starts with the same MIT license header block used by its neighbours (copy verbatim from `Infrastructure/Models/Dashboards/ChartDataItem.cs`, updating nothing).
- Controllers: `[Authorize]`, plain `Controller` base class, hardcoded `[Route("api/insight-dashboard-pn/...")]` per action. No `[ApiController]`.
- Soft deletes: filter `WorkflowState != Constants.WorkflowStates.Removed` on every SDK table touched.
- Commits go in the **host app** during implementation only if the change belongs to core frontend; plugin code is committed in the **source repo** after `devgetchanges.sh` (Task 9).

## Testing approach — read this before Task 1

The plugin repo has **no C# test project**, and this plan does not add one (the approved spec scopes verification to Playwright). The existing 71 jest specs in the plugin are **already broken** — they import `async` from `@angular/core/testing`, which no longer exists — so `npx jest` on the plugin directory is red before any change. Do not treat that as a regression you caused, and do not attempt to fix those stubs.

Consequently:
- Backend logic is verified by `dotnet build` plus the Playwright reconciliation test in Task 8. There are no backend unit tests. This is a known gap; the highest-risk logic (multi-select column placement, skipped-question rendering, row-count reconciliation) is covered end-to-end in Task 8.
- The one new jest spec (Task 7) is written correctly with `waitForAsync` and must pass on its own.

**Verification commands used throughout:**

```bash
# Backend build
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn && dotnet build -v q --nologo

# Frontend typecheck/build
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client && npx ng build

# The single new jest spec
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client && npx jest src/app/plugins/modules/insight-dashboard-pn/components/dashboards/view/dashboard-raw-data-view
```

A clean `dotnet build` baseline was confirmed before this plan was written: `Build succeeded. 0 Warning(s) 0 Error(s)`.

## File Structure

Backend, all under `.../Plugins/InsightDashboard.Pn/InsightDashboard.Pn/`:

| File | Responsibility |
|---|---|
| `Infrastructure/Models/RawData/RawDataRequestModel.cs` | Request: which item, paging, sorting |
| `Infrastructure/Models/RawData/RawDataColumnModel.cs` | One column descriptor |
| `Infrastructure/Models/RawData/RawDataColumnKinds.cs` | String constants for `Kind` |
| `Infrastructure/Models/RawData/RawDataFields.cs` | String constants for fixed answer field keys |
| `Infrastructure/Models/RawData/RawDataListModel.cs` | Response: total + columns + rows |
| `Infrastructure/Models/RawData/RawDataExportRequestModel.cs` | Export request |
| `Infrastructure/Helpers/AnswerFilterHelper.cs` | Answer membership — the reconciliation contract |
| `Infrastructure/Helpers/RawDataTranslations.cs` | Language preference order + translation picking |
| `Infrastructure/Models/RawData/RawDataSchema.cs` | Columns + per-question pivot metadata |
| `Infrastructure/Helpers/RawDataColumnBuilder.cs` | Survey questions/options → `RawDataSchema` |
| `Services/RawDataService/IRawDataService.cs` | Interface |
| `Services/RawDataService/RawDataService.cs` | Orchestration |
| `Services/RawDataExcelService/IRawDataExcelService.cs` | Interface |
| `Services/RawDataExcelService/RawDataExcelService.cs` | Dynamic-width OpenXML writer |
| `Controllers/RawDataController.cs` | Two routes |

Modified: `EformInsightDashboardPlugin.cs` (DI), `Resources/localization.json` (error strings).

Frontend, all under `.../eform-client/src/app/plugins/modules/insight-dashboard-pn/`:

| File | Responsibility |
|---|---|
| `models/dashboard/raw-data/raw-data-column.model.ts` | Mirrors `RawDataColumnModel` |
| `models/dashboard/raw-data/raw-data-list.model.ts` | Mirrors `RawDataListModel` |
| `models/dashboard/raw-data/raw-data-request.model.ts` | Mirrors `RawDataRequestModel` |
| `models/dashboard/raw-data/index.ts` | Barrel |
| `services/insight-dashboard-pn-raw-data.service.ts` | Two HTTP calls |
| `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.ts` | Component logic |
| `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.html` | Disclosure + grid |
| `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.scss` | Minimal styling |
| `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.spec.ts` | jest spec |

Modified: `insight-dashboard-pn.module.ts`, `components/dashboards/view/dashboard-block-view/dashboard-block-view.component.html`, `components/dashboards/view/index.ts`, `services/index.ts`, `models/dashboard/index.ts`, `i18n/en-US.ts`, `i18n/da.ts`.

Playwright, in the **plugin source repo** (`/home/rene/Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/playwright/`) — see Task 8 for why.

---

### Task 1: Raw data DTOs and constants

**Files:**
- Create: `Infrastructure/Models/RawData/RawDataRequestModel.cs`
- Create: `Infrastructure/Models/RawData/RawDataExportRequestModel.cs`
- Create: `Infrastructure/Models/RawData/RawDataColumnModel.cs`
- Create: `Infrastructure/Models/RawData/RawDataColumnKinds.cs`
- Create: `Infrastructure/Models/RawData/RawDataFields.cs`
- Create: `Infrastructure/Models/RawData/RawDataListModel.cs`

**Interfaces:**
- Consumes: nothing.
- Produces: `RawDataRequestModel{DashboardId,DashboardItemId,PageSize,Offset,Sort,IsSortDsc}`, `RawDataExportRequestModel{DashboardId,DashboardItemId}`, `RawDataColumnModel{Field,Header,Kind,DefaultHidden,Sortable,QuestionId,OptionId}`, `RawDataListModel{Total,Columns,Rows}` where `Rows` is `List<Dictionary<string,object>>`, plus the `RawDataColumnKinds` and `RawDataFields` constant classes. Every later backend task depends on these exact names.

- [ ] **Step 1: Create the request models**

`Infrastructure/Models/RawData/RawDataRequestModel.cs` (prefix with the MIT header copied from `Infrastructure/Models/Dashboards/ChartDataItem.cs`):

```csharp
namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

using Microting.eFormApi.BasePn.Infrastructure.Interfaces;

public class RawDataRequestModel : ICommonSort, ICommonPagination
{
    public int DashboardId { get; set; }
    public int DashboardItemId { get; set; }
    public int PageSize { get; set; }
    public int Offset { get; set; }
    public string Sort { get; set; }
    public bool IsSortDsc { get; set; }
}
```

`Infrastructure/Models/RawData/RawDataExportRequestModel.cs`:

```csharp
namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

public class RawDataExportRequestModel
{
    public int DashboardId { get; set; }
    public int DashboardItemId { get; set; }
}
```

- [ ] **Step 2: Create the constant classes**

`Infrastructure/Models/RawData/RawDataColumnKinds.cs`:

```csharp
namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

public static class RawDataColumnKinds
{
    public const string Answer = "answer";
    public const string Smiley = "smiley";
    public const string Single = "single";
    public const string MultiOption = "multiOption";
    public const string Number = "number";
    public const string Text = "text";
    public const string Other = "other";
}
```

`Infrastructure/Models/RawData/RawDataFields.cs`. These strings are simultaneously the JSON row keys, the mtx-grid `field` values, and the `Sort` values the client sends back:

```csharp
namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

public static class RawDataFields
{
    public const string Id = "id";
    public const string MicrotingUid = "microtingUid";
    public const string FinishedAt = "finishedAt";
    public const string AnswerDuration = "answerDuration";
    public const string SiteName = "siteName";
    public const string TagNames = "tagNames";
    public const string UnitMicrotingUid = "unitMicrotingUid";
    public const string LanguageName = "languageName";
    public const string SurveyConfigurationName = "surveyConfigurationName";
    public const string QuestionSetName = "questionSetName";
    public const string TimeZone = "timeZone";
    public const string UtcAdjusted = "utcAdjusted";
    public const string CreatedAt = "createdAt";
    public const string UpdatedAt = "updatedAt";
    public const string Version = "version";
    public const string WorkflowState = "workflowState";
    public const string SiteId = "siteId";
    public const string UnitId = "unitId";
    public const string LanguageId = "languageId";
}
```

- [ ] **Step 3: Create the response models**

`Infrastructure/Models/RawData/RawDataColumnModel.cs`:

```csharp
namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

public class RawDataColumnModel
{
    public string Field { get; set; }
    public string Header { get; set; }
    public string Kind { get; set; }
    public bool DefaultHidden { get; set; }
    public bool Sortable { get; set; }
    public int? QuestionId { get; set; }
    public int? OptionId { get; set; }
}
```

`Infrastructure/Models/RawData/RawDataListModel.cs`:

```csharp
namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

using System.Collections.Generic;

public class RawDataListModel
{
    public int Total { get; set; }
    public List<RawDataColumnModel> Columns { get; set; } = new();
    public List<Dictionary<string, object>> Rows { get; set; } = new();
}
```

- [ ] **Step 4: Build**

Run: `cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn && dotnet build -v q --nologo`
Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`

- [ ] **Step 5: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Infrastructure/Models/RawData
git commit -m "feat(insight-dashboard): add raw data DTOs"
```

Note: this commit is in the host app purely to keep the work bisectable during implementation. The authoritative commit happens in the plugin source repo in Task 9.

---

### Task 2: AnswerFilterHelper — the reconciliation contract

This is the highest-risk file in the plan. Its only job is to select **exactly** the answers that fed the chart above the table. Every predicate below is copied from `Infrastructure/Helpers/ChartDataHelpers.cs`, with the source line numbers in comments so a future reader can diff them.

**Files:**
- Create: `Infrastructure/Helpers/AnswerFilterHelper.cs`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `AnswerFilterHelper.BuildAnswerQuery(MicrotingDbContext sdkContext, DashboardItem dashboardItem, int dashboardSurveyId, int? dashboardLocationId, int? dashboardLocationTagId, DashboardEditAnswerDates answerDates)` returning `IQueryable<Answer>`. Task 4 and Task 6 both call this.

- [ ] **Step 1: Write the helper**

`Infrastructure/Helpers/AnswerFilterHelper.cs` (prefix with the MIT header):

```csharp
namespace InsightDashboard.Pn.Infrastructure.Helpers;

using System;
using System.Linq;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
using Microting.InsightDashboardBase.Infrastructure.Enums;
using Models.Dashboards;

/// <summary>
/// Selects the answers that feed a single dashboard item.
///
/// This MUST stay behaviourally identical to the answer-selection half of
/// ChartDataHelpers.CalculateDashboardItem, otherwise the raw data table will
/// disagree with the chart it sits under. Line references below point at
/// ChartDataHelpers.cs as of the commit that introduced this file.
///
/// Two deliberate deviations, both documented in
/// docs/superpowers/specs/2026-07-29-insight-dashboard-raw-data-table-design.md:
///   1. Answer.WorkflowState is also filtered (ChartDataHelpers filters only
///      AnswerValue.WorkflowState). The delete path sets both together, so this
///      does not change counts in practice.
///   2. The filter-question step uses a correlated subquery instead of
///      materialising answer ids with ToList(). Semantically identical, one
///      fewer round trip.
/// </summary>
public static class AnswerFilterHelper
{
    public static IQueryable<Answer> BuildAnswerQuery(
        MicrotingDbContext sdkContext,
        DashboardItem dashboardItem,
        int dashboardSurveyId,
        int? dashboardLocationId,
        int? dashboardLocationTagId,
        DashboardEditAnswerDates answerDates)
    {
        // ChartDataHelpers.cs:135-142
        var answerValues = sdkContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.Answer.WorkflowState != Constants.WorkflowStates.Removed)
            .AsQueryable();

        // ChartDataHelpers.cs:144-154
        if (answerDates.Today)
        {
            var dateTimeNow = DateTime.Now;
            answerDates.DateTo = new DateTime(
                dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day, 23, 59, 59);
        }

        // ChartDataHelpers.cs:156-166
        if (answerDates.DateFrom != null)
        {
            answerValues = answerValues.Where(x => x.Answer.FinishedAt >= answerDates.DateFrom);
        }

        if (answerDates.DateTo != null)
        {
            answerValues = answerValues.Where(x => x.Answer.FinishedAt <= answerDates.DateTo);
        }

        // ChartDataHelpers.cs:170-171
        answerValues = answerValues.Where(x => x.Answer.QuestionSetId == dashboardSurveyId);

        // ChartDataHelpers.cs:173-190
        if (dashboardItem.FilterQuestionId != null && dashboardItem.FilterAnswerId != null)
        {
            var filterScope = answerValues;
            answerValues = answerValues
                .Where(x => filterScope.Any(y =>
                    y.AnswerId == x.AnswerId
                    && y.QuestionId == dashboardItem.FilterQuestionId
                    && y.OptionId == dashboardItem.FilterAnswerId))
                .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
        }
        else
        {
            answerValues = answerValues.Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
        }

        // ChartDataHelpers.cs:223-236 — note this block only runs when compare is OFF
        if (!dashboardItem.CompareEnabled)
        {
            if (dashboardLocationId != null)
            {
                answerValues = answerValues.Where(x => x.Answer.SiteId == dashboardLocationId);
            }
            else if (dashboardLocationTagId != null)
            {
                answerValues = answerValues.Where(x =>
                    x.Answer.Site.SiteTags.Any(y => y.TagId == dashboardLocationTagId));
            }
        }

        // ChartDataHelpers.cs:240-252 — ignored answer OPTIONS (the column is
        // misleadingly named AnswerId but holds options.Id)
        var ignoredOptionIds = dashboardItem.IgnoredAnswerValues
            .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
            .Select(x => x.AnswerId)
            .ToArray();

        if (ignoredOptionIds.Length > 0)
        {
            answerValues = answerValues.Where(x => !ignoredOptionIds.Contains(x.OptionId));
        }

        var answerIds = IsComparedData(dashboardItem)
            ? ComparedAnswerIds(answerValues, dashboardItem, dashboardLocationId, dashboardLocationTagId)
            : NonComparedAnswerIds(answerValues, dashboardLocationId, dashboardLocationTagId);

        return sdkContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => answerIds.Contains(x.Id));
    }

    // ChartDataHelpers.cs:121-133
    private static bool IsComparedData(DashboardItem dashboardItem)
    {
        if (dashboardItem.ChartType != DashboardChartTypes.GroupedStackedBarChart
            && dashboardItem.ChartType != DashboardChartTypes.Line)
        {
            return false;
        }

        if (dashboardItem.CompareEnabled)
        {
            return true;
        }

        return dashboardItem.ChartType == DashboardChartTypes.Line && dashboardItem.CalculateAverage;
    }

    // ChartDataHelpers.cs:255-390 — the union of the per-tag queries and the site query
    private static IQueryable<int> ComparedAnswerIds(
        IQueryable<AnswerValue> answerValues,
        DashboardItem dashboardItem,
        int? dashboardLocationId,
        int? dashboardLocationTagId)
    {
        var tagIds = dashboardItem.CompareEnabled
            ? dashboardItem.CompareLocationsTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.TagId != null)
                .Select(x => (int)x.TagId)
                .ToList()
            : dashboardLocationTagId != null
                ? new List<int> { (int)dashboardLocationTagId }
                : new List<int>();

        var siteIds = dashboardItem.CompareEnabled
            ? dashboardItem.CompareLocationsTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.LocationId != null)
                .Select(x => (int)x.LocationId)
                .ToList()
            : dashboardLocationId != null
                ? new List<int> { (int)dashboardLocationId }
                : new List<int>();

        var byTag = answerValues
            .Where(x => x.Answer.Site.SiteTags.Any(y => y.TagId != null && tagIds.Contains((int)y.TagId)))
            .Select(x => x.AnswerId);

        var bySite = answerValues
            .Where(x => siteIds.Contains(x.Answer.SiteId))
            .Select(x => x.AnswerId);

        return byTag.Union(bySite).Distinct();
    }

    // ChartDataHelpers.cs:392-490 — when neither location nor tag is set the
    // chart renders nothing, so the raw table must be empty too.
    private static IQueryable<int> NonComparedAnswerIds(
        IQueryable<AnswerValue> answerValues,
        int? dashboardLocationId,
        int? dashboardLocationTagId)
    {
        if (dashboardLocationId == null && dashboardLocationTagId == null)
        {
            return answerValues.Where(x => false).Select(x => x.AnswerId);
        }

        return answerValues.Select(x => x.AnswerId).Distinct();
    }
}
```

Add `using System.Collections.Generic;` to the using block — `List<int>` is used in `ComparedAnswerIds`.

- [ ] **Step 2: Build**

Run: `cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn && dotnet build -v q --nologo`
Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`

If the build reports that `DashboardEditAnswerDates` is not found, its namespace is `InsightDashboard.Pn.Infrastructure.Models.Dashboards` — the `using Models.Dashboards;` line above resolves it relative to `InsightDashboard.Pn.Infrastructure`.

- [ ] **Step 3: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Infrastructure/Helpers/AnswerFilterHelper.cs
git commit -m "feat(insight-dashboard): add AnswerFilterHelper mirroring chart answer selection"
```

---

### Task 3: Translation picking and the column/schema builder

**Files:**
- Create: `Infrastructure/Helpers/RawDataTranslations.cs`
- Create: `Infrastructure/Models/RawData/RawDataSchema.cs`
- Create: `Infrastructure/Helpers/RawDataColumnBuilder.cs`

**Interfaces:**
- Consumes: `RawDataColumnModel`, `RawDataColumnKinds`, `RawDataFields` (Task 1).
- Produces:
  - `RawDataTranslations.GetPreferredLanguageIdsAsync(MicrotingDbContext, int questionSetId, int userLanguageId)` → `Task<List<int>>`
  - `RawDataTranslations.Pick(IReadOnlyList<(int LanguageId, string Name)>, IReadOnlyList<int> preferred)` → `string`
  - `RawDataQuestionMeta` with `QuestionId`, `IsSmiley`, `IsMulti`, `Field`, `OptionNameByOptionId`, `OptionFieldByOptionId`, `WeightValueByOptionId`, `OptionFields`
  - `RawDataSchema` with `Columns` and `Questions`
  - `RawDataColumnBuilder.BuildAsync(MicrotingDbContext, int questionSetId, IReadOnlyList<int> preferredLanguageIds)` → `Task<RawDataSchema>`

Task 4 calls `BuildAsync` and pivots using `RawDataQuestionMeta`.

- [ ] **Step 1: Write the translation picker**

`Infrastructure/Helpers/RawDataTranslations.cs` (MIT header first):

```csharp
namespace InsightDashboard.Pn.Infrastructure.Helpers;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;

/// <summary>
/// Question and option text lives only in QuestionTranslations / OptionTranslations,
/// keyed by LanguageId. Answer.LanguageId is NOT usable for this — Core.SaveAnswer
/// hardcodes it to the Danish row — so the raw data table resolves text by the
/// logged-in user's language instead, then the survey's deployed languages, then
/// anything non-removed.
/// </summary>
public static class RawDataTranslations
{
    public static async Task<List<int>> GetPreferredLanguageIdsAsync(
        MicrotingDbContext sdkContext,
        int questionSetId,
        int userLanguageId)
    {
        var surveyLanguageIds = await sdkContext.LanguageQuestionSets
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.QuestionSetId == questionSetId)
            .Select(x => x.LanguageId)
            .ToListAsync();

        var preferred = new List<int> { userLanguageId };
        preferred.AddRange(surveyLanguageIds.Where(x => x != userLanguageId));
        return preferred;
    }

    public static string Pick(
        IReadOnlyList<(int LanguageId, string Name)> translations,
        IReadOnlyList<int> preferredLanguageIds)
    {
        foreach (var languageId in preferredLanguageIds)
        {
            var match = translations.FirstOrDefault(x => x.LanguageId == languageId);
            if (!string.IsNullOrEmpty(match.Name))
            {
                return match.Name;
            }
        }

        return translations
            .Select(x => x.Name)
            .FirstOrDefault(x => !string.IsNullOrEmpty(x));
    }
}
```

- [ ] **Step 2: Write the schema model**

`Infrastructure/Models/RawData/RawDataSchema.cs`:

```csharp
namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

using System.Collections.Generic;

public class RawDataQuestionMeta
{
    public int QuestionId { get; set; }
    public bool IsSmiley { get; set; }
    public bool IsMulti { get; set; }

    /// <summary>Row-dictionary key for a single-value question. Null when IsMulti.</summary>
    public string Field { get; set; }

    /// <summary>Row-dictionary key per option. Populated only when IsMulti.</summary>
    public Dictionary<int, string> OptionFieldByOptionId { get; set; } = new();

    public Dictionary<int, string> OptionNameByOptionId { get; set; } = new();
    public Dictionary<int, int> WeightValueByOptionId { get; set; } = new();

    /// <summary>All option field keys for this question, used to fill "—" when skipped.</summary>
    public List<string> OptionFields { get; set; } = new();
}

public class RawDataSchema
{
    public List<RawDataColumnModel> Columns { get; set; } = new();
    public List<RawDataQuestionMeta> Questions { get; set; } = new();
}
```

- [ ] **Step 3: Write the column builder**

`Infrastructure/Helpers/RawDataColumnBuilder.cs`. Note it loads translations into memory rather than projecting them in the EF query — the question count per survey is small (tens), and in-memory resolution avoids depending on EF translating a nested fallback expression.

```csharp
namespace InsightDashboard.Pn.Infrastructure.Helpers;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Models.RawData;

public static class RawDataColumnBuilder
{
    /// <summary>
    /// Fallback smiley labels, used only when a smiley option has no translation
    /// of its own. Mirrors ChartDataHelpers.cs:60-68. 999 means "don't know".
    /// </summary>
    private static readonly Dictionary<int, string> SmileyFallbackLabels = new()
    {
        { 100, "Meget glad" },
        { 75, "Glad" },
        { 50, "Neutral" },
        { 25, "Sur" },
        { 0, "Meget sur" },
        { 999, "Ved ikke" },
    };

    public static string SmileyFallbackLabel(int weightValue) =>
        SmileyFallbackLabels.TryGetValue(weightValue, out var label) ? label : null;

    public static List<RawDataColumnModel> BuildAnswerColumns() =>
    [
        Answer(RawDataFields.Id, "Id", sortable: true),
        Answer(RawDataFields.MicrotingUid, "Microting UID", sortable: true),
        Answer(RawDataFields.FinishedAt, "Finished at", sortable: true),
        Answer(RawDataFields.AnswerDuration, "Duration", sortable: true),
        Answer(RawDataFields.SiteName, "Site", sortable: true),
        Answer(RawDataFields.TagNames, "Tags", sortable: false),
        Answer(RawDataFields.UnitMicrotingUid, "Unit", sortable: true),
        Answer(RawDataFields.LanguageName, "Language", sortable: true),
        Answer(RawDataFields.SurveyConfigurationName, "Survey config", sortable: true),
        Answer(RawDataFields.QuestionSetName, "Survey", sortable: false, hidden: true),
        Answer(RawDataFields.TimeZone, "Time zone", sortable: false, hidden: true),
        Answer(RawDataFields.UtcAdjusted, "UTC adjusted", sortable: false, hidden: true),
        Answer(RawDataFields.CreatedAt, "Created at", sortable: true, hidden: true),
        Answer(RawDataFields.UpdatedAt, "Updated at", sortable: true, hidden: true),
        Answer(RawDataFields.Version, "Version", sortable: false, hidden: true),
        Answer(RawDataFields.WorkflowState, "Workflow state", sortable: true, hidden: true),
        Answer(RawDataFields.SiteId, "Site id", sortable: false, hidden: true),
        Answer(RawDataFields.UnitId, "Unit id", sortable: false, hidden: true),
        Answer(RawDataFields.LanguageId, "Language id", sortable: false, hidden: true),
    ];

    private static RawDataColumnModel Answer(
        string field, string header, bool sortable, bool hidden = false) =>
        new()
        {
            Field = field,
            Header = header,
            Kind = RawDataColumnKinds.Answer,
            Sortable = sortable,
            DefaultHidden = hidden,
        };

    public static async Task<RawDataSchema> BuildAsync(
        MicrotingDbContext sdkContext,
        int questionSetId,
        IReadOnlyList<int> preferredLanguageIds)
    {
        var schema = new RawDataSchema { Columns = BuildAnswerColumns() };

        var questions = await sdkContext.Questions
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.QuestionSetId == questionSetId)
            .OrderBy(x => x.QuestionIndex)
            .Select(x => new { x.Id, x.QuestionType })
            .ToListAsync();

        if (questions.Count == 0)
        {
            return schema;
        }

        var questionIds = questions.Select(x => x.Id).ToList();

        var questionTranslations = await sdkContext.QuestionTranslations
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => questionIds.Contains(x.QuestionId))
            .Select(x => new { x.QuestionId, x.LanguageId, x.Name })
            .ToListAsync();

        var options = await sdkContext.Options
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => questionIds.Contains(x.QuestionId))
            .OrderBy(x => x.OptionIndex)
            .Select(x => new { x.Id, x.QuestionId, x.WeightValue })
            .ToListAsync();

        var optionIds = options.Select(x => x.Id).ToList();

        var optionTranslations = await sdkContext.OptionTranslations
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => optionIds.Contains(x.OptionId))
            .Select(x => new { x.OptionId, x.LanguageId, x.Name })
            .ToListAsync();

        var questionIndex = 0;
        foreach (var question in questions)
        {
            questionIndex++;

            var questionName = RawDataTranslations.Pick(
                questionTranslations
                    .Where(t => t.QuestionId == question.Id)
                    .Select(t => (t.LanguageId, t.Name))
                    .ToList(),
                preferredLanguageIds);

            var questionLabel = $"{questionIndex} – {questionName}";
            var questionOptions = options.Where(o => o.QuestionId == question.Id).ToList();

            var isSmiley = IsSmileyType(question.QuestionType);
            var isMulti = question.QuestionType == Constants.QuestionTypes.Multi;

            var meta = new RawDataQuestionMeta
            {
                QuestionId = question.Id,
                IsSmiley = isSmiley,
                IsMulti = isMulti,
            };

            foreach (var option in questionOptions)
            {
                meta.WeightValueByOptionId[option.Id] = option.WeightValue;
                meta.OptionNameByOptionId[option.Id] = RawDataTranslations.Pick(
                    optionTranslations
                        .Where(t => t.OptionId == option.Id)
                        .Select(t => (t.LanguageId, t.Name))
                        .ToList(),
                    preferredLanguageIds);
            }

            if (isMulti)
            {
                foreach (var option in questionOptions)
                {
                    var field = $"q{question.Id}_o{option.Id}";
                    meta.OptionFieldByOptionId[option.Id] = field;
                    meta.OptionFields.Add(field);

                    schema.Columns.Add(new RawDataColumnModel
                    {
                        Field = field,
                        Header = $"{questionLabel} › {meta.OptionNameByOptionId[option.Id]}",
                        Kind = RawDataColumnKinds.MultiOption,
                        Sortable = false,
                        DefaultHidden = false,
                        QuestionId = question.Id,
                        OptionId = option.Id,
                    });
                }
            }
            else
            {
                meta.Field = $"q{question.Id}";
                meta.OptionFields.Add(meta.Field);

                schema.Columns.Add(new RawDataColumnModel
                {
                    Field = meta.Field,
                    Header = questionLabel,
                    Kind = KindFor(question.QuestionType, isSmiley),
                    Sortable = false,
                    DefaultHidden = false,
                    QuestionId = question.Id,
                });
            }

            schema.Questions.Add(meta);
        }

        return schema;
    }

    private static string KindFor(string questionType, bool isSmiley)
    {
        if (isSmiley)
        {
            return RawDataColumnKinds.Smiley;
        }

        return questionType switch
        {
            Constants.QuestionTypes.List => RawDataColumnKinds.Single,
            Constants.QuestionTypes.Buttons => RawDataColumnKinds.Single,
            Constants.QuestionTypes.Number => RawDataColumnKinds.Number,
            Constants.QuestionTypes.Text => RawDataColumnKinds.Text,
            Constants.QuestionTypes.TextEamil => RawDataColumnKinds.Text,
            Constants.QuestionTypes.ZipCode => RawDataColumnKinds.Text,
            _ => RawDataColumnKinds.Other,
        };
    }

    /// <summary>
    /// Mirrors Question.IsSmiley() without needing a Question entity instance.
    /// </summary>
    private static bool IsSmileyType(string questionType) => questionType switch
    {
        Constants.QuestionTypes.Smiley => true,
        Constants.QuestionTypes.Smiley2 => true,
        Constants.QuestionTypes.Smiley3 => true,
        Constants.QuestionTypes.Smiley4 => true,
        Constants.QuestionTypes.Smiley5 => true,
        Constants.QuestionTypes.Smiley6 => true,
        Constants.QuestionTypes.Smiley7 => true,
        Constants.QuestionTypes.Smiley8 => true,
        Constants.QuestionTypes.Smiley9 => true,
        Constants.QuestionTypes.Smiley10 => true,
        _ => false,
    };
}
```

- [ ] **Step 4: Build**

Run: `cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn && dotnet build -v q --nologo`
Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`

If the collection-expression syntax `=> [ ... ]` on `BuildAnswerColumns` is rejected, replace it with `=> new List<RawDataColumnModel> { ... };` — the rest is unchanged.

- [ ] **Step 5: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Infrastructure/Helpers/RawDataTranslations.cs \
        eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Infrastructure/Helpers/RawDataColumnBuilder.cs \
        eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Infrastructure/Models/RawData/RawDataSchema.cs
git commit -m "feat(insight-dashboard): add raw data column builder and translation picking"
```

---

### Task 4: RawDataService — query, pivot, page

**Files:**
- Create: `Services/RawDataService/IRawDataService.cs`
- Create: `Services/RawDataService/RawDataService.cs`

**Interfaces:**
- Consumes: `AnswerFilterHelper.BuildAnswerQuery` (Task 2), `RawDataColumnBuilder.BuildAsync` / `RawDataQuestionMeta` / `RawDataSchema` (Task 3), `RawDataRequestModel` / `RawDataListModel` / `RawDataFields` (Task 1).
- Produces: `IRawDataService.GetRawData(RawDataRequestModel)` → `Task<OperationDataResult<RawDataListModel>>` and `IRawDataService.GetAllRawData(int dashboardId, int dashboardItemId)` → `Task<OperationDataResult<RawDataListModel>>`. Task 5 injects this; Task 6 uses `GetAllRawData` for the export.

- [ ] **Step 1: Write the interface**

`Services/RawDataService/IRawDataService.cs`:

```csharp
namespace InsightDashboard.Pn.Services.RawDataService;

using System.Threading.Tasks;
using Infrastructure.Models.RawData;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

public interface IRawDataService
{
    Task<OperationDataResult<RawDataListModel>> GetRawData(RawDataRequestModel requestModel);

    Task<OperationDataResult<RawDataListModel>> GetAllRawData(int dashboardId, int dashboardItemId);
}
```

- [ ] **Step 2: Write the service**

`Services/RawDataService/RawDataService.cs`:

```csharp
namespace InsightDashboard.Pn.Services.RawDataService;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Common.InsightDashboardLocalizationService;
using Infrastructure.Helpers;
using Infrastructure.Models.Dashboards;
using Infrastructure.Models.RawData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.InsightDashboardBase.Infrastructure.Data;

public class RawDataService : IRawDataService
{
    /// <summary>Hard ceiling for the unpaged export, to fail loudly instead of exhausting memory.</summary>
    public const int ExportRowLimit = 100000;

    private readonly ILogger<RawDataService> _logger;
    private readonly IInsightDashboardLocalizationService _localizationService;
    private readonly IEFormCoreService _coreHelper;
    private readonly InsightDashboardPnDbContext _dbContext;
    private readonly IUserService _userService;

    public RawDataService(
        ILogger<RawDataService> logger,
        IInsightDashboardLocalizationService localizationService,
        IEFormCoreService coreHelper,
        InsightDashboardPnDbContext dbContext,
        IUserService userService)
    {
        _logger = logger;
        _localizationService = localizationService;
        _coreHelper = coreHelper;
        _dbContext = dbContext;
        _userService = userService;
    }

    public Task<OperationDataResult<RawDataListModel>> GetRawData(RawDataRequestModel requestModel) =>
        Build(requestModel.DashboardId, requestModel.DashboardItemId, requestModel, applyPaging: true);

    public Task<OperationDataResult<RawDataListModel>> GetAllRawData(int dashboardId, int dashboardItemId) =>
        Build(dashboardId, dashboardItemId, null, applyPaging: false);

    private async Task<OperationDataResult<RawDataListModel>> Build(
        int dashboardId,
        int dashboardItemId,
        RawDataRequestModel requestModel,
        bool applyPaging)
    {
        try
        {
            var dashboard = await _dbContext.Dashboards
                .Include(x => x.DashboardItems)
                .ThenInclude(x => x.IgnoredAnswerValues)
                .Include(x => x.DashboardItems)
                .ThenInclude(x => x.CompareLocationsTags)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .FirstOrDefaultAsync(x => x.Id == dashboardId);

            if (dashboard == null)
            {
                return new OperationDataResult<RawDataListModel>(
                    false, _localizationService.GetString("DashboardNotFound"));
            }

            var dashboardItem = dashboard.DashboardItems
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .FirstOrDefault(x => x.Id == dashboardItemId);

            if (dashboardItem == null)
            {
                return new OperationDataResult<RawDataListModel>(
                    false, _localizationService.GetString("DashboardItemNotFound"));
            }

            if (dashboard.Today)
            {
                var dateTimeNow = DateTime.Now;
                dashboard.DateTo = new DateTime(
                    dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day, 23, 59, 59);
            }

            var answerDates = new DashboardEditAnswerDates
            {
                Today = dashboard.Today,
                DateFrom = dashboard.DateFrom,
                DateTo = dashboard.DateTo,
            };

            var core = await _coreHelper.GetCore();
            var userLanguage = await _userService.GetCurrentUserLanguage();

            await using var sdkContext = core.DbContextHelper.GetDbContext();

            var preferredLanguageIds = await RawDataTranslations.GetPreferredLanguageIdsAsync(
                sdkContext, dashboard.SurveyId, userLanguage.Id);

            var schema = await RawDataColumnBuilder.BuildAsync(
                sdkContext, dashboard.SurveyId, preferredLanguageIds);

            var answerQuery = AnswerFilterHelper.BuildAnswerQuery(
                sdkContext,
                dashboardItem,
                dashboard.SurveyId,
                dashboard.LocationId,
                dashboard.TagId,
                answerDates);

            var result = new RawDataListModel
            {
                Columns = schema.Columns,
                Total = await answerQuery.CountAsync(),
            };

            if (!applyPaging && result.Total > ExportRowLimit)
            {
                return new OperationDataResult<RawDataListModel>(
                    false,
                    string.Format(
                        _localizationService.GetString("RawDataExportTooLarge"),
                        result.Total,
                        ExportRowLimit));
            }

            var sort = requestModel?.Sort;
            var isSortDsc = requestModel?.IsSortDsc ?? true;
            var ordered = ApplySort(answerQuery, sort, isSortDsc);

            if (applyPaging)
            {
                ordered = ordered.Skip(requestModel.Offset).Take(requestModel.PageSize);
            }

            var answers = await ordered
                .Select(x => new AnswerRow
                {
                    Id = x.Id,
                    MicrotingUid = x.MicrotingUid,
                    FinishedAt = x.FinishedAt,
                    AnswerDuration = x.AnswerDuration,
                    SiteId = x.SiteId,
                    SiteName = x.Site.Name,
                    TagNames = x.Site.SiteTags
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(y => y.Tag.Name)
                        .ToList(),
                    UnitId = x.UnitId,
                    UnitMicrotingUid = x.Unit.MicrotingUid,
                    LanguageId = x.LanguageId,
                    LanguageName = x.Language.Name,
                    SurveyConfigurationName = x.SurveyConfiguration.Name,
                    QuestionSetName = x.QuestionSet.Name,
                    TimeZone = x.TimeZone,
                    UtcAdjusted = x.UtcAdjusted,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                })
                .ToListAsync();

            var answerIds = answers.Select(x => x.Id).ToList();

            var values = await sdkContext.AnswerValues
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => answerIds.Contains(x.AnswerId))
                .Select(x => new { x.AnswerId, x.QuestionId, x.OptionId, x.Value })
                .ToListAsync();

            var metaByQuestionId = schema.Questions.ToDictionary(x => x.QuestionId);
            var valuesByAnswerId = values.GroupBy(x => x.AnswerId)
                .ToDictionary(x => x.Key, x => x.ToList());

            foreach (var answer in answers)
            {
                var row = ToRowDictionary(answer);

                // Every question column starts as "not answered"; real values overwrite it.
                foreach (var meta in schema.Questions)
                {
                    foreach (var field in meta.OptionFields)
                    {
                        row[field] = NotAnswered;
                    }
                }

                if (valuesByAnswerId.TryGetValue(answer.Id, out var answerValues))
                {
                    foreach (var answerValue in answerValues)
                    {
                        if (!metaByQuestionId.TryGetValue(answerValue.QuestionId, out var meta))
                        {
                            continue;
                        }

                        var optionName = meta.OptionNameByOptionId.GetValueOrDefault(answerValue.OptionId);
                        var skipped = string.Equals(optionName, NaOptionName, StringComparison.OrdinalIgnoreCase);

                        if (meta.IsMulti)
                        {
                            // A skipped multi question leaves every option column as "—".
                            if (skipped)
                            {
                                continue;
                            }

                            foreach (var field in meta.OptionFields)
                            {
                                if (Equals(row[field], NotAnswered))
                                {
                                    row[field] = string.Empty;
                                }
                            }

                            var optionField = meta.OptionFieldByOptionId.GetValueOrDefault(answerValue.OptionId);
                            if (optionField != null)
                            {
                                row[optionField] = optionName;
                            }

                            continue;
                        }

                        row[meta.Field] = skipped
                            ? NotAnswered
                            : ResolveSingleValue(meta, answerValue.OptionId, answerValue.Value, optionName);
                    }
                }

                result.Rows.Add(row);
            }

            return new OperationDataResult<RawDataListModel>(true, result);
        }
        catch (Exception e)
        {
            Trace.TraceError(e.Message);
            _logger.LogError(e, e.Message);
            return new OperationDataResult<RawDataListModel>(
                false, _localizationService.GetString("ErrorWhileObtainingRawData"));
        }
    }

    private const string NotAnswered = "—";
    private const string NaOptionName = "na";

    private static string ResolveSingleValue(
        RawDataQuestionMeta meta, int optionId, string value, string optionName)
    {
        if (meta.IsSmiley)
        {
            var weightValue = meta.WeightValueByOptionId.GetValueOrDefault(optionId);
            var label = !string.IsNullOrEmpty(optionName)
                ? optionName
                : RawDataColumnBuilder.SmileyFallbackLabel(weightValue);

            return string.IsNullOrEmpty(label)
                ? weightValue.ToString()
                : $"{label} ({weightValue})";
        }

        return !string.IsNullOrEmpty(optionName) ? optionName : value;
    }

    private static Dictionary<string, object> ToRowDictionary(AnswerRow answer) => new()
    {
        [RawDataFields.Id] = answer.Id,
        [RawDataFields.MicrotingUid] = answer.MicrotingUid,
        [RawDataFields.FinishedAt] = answer.FinishedAt,
        [RawDataFields.AnswerDuration] = FormatDuration(answer.AnswerDuration),
        [RawDataFields.SiteName] = answer.SiteName,
        [RawDataFields.TagNames] = string.Join(", ", answer.TagNames),
        [RawDataFields.UnitMicrotingUid] = answer.UnitMicrotingUid,
        [RawDataFields.LanguageName] = answer.LanguageName,
        [RawDataFields.SurveyConfigurationName] = answer.SurveyConfigurationName,
        [RawDataFields.QuestionSetName] = answer.QuestionSetName,
        [RawDataFields.TimeZone] = answer.TimeZone,
        [RawDataFields.UtcAdjusted] = answer.UtcAdjusted,
        [RawDataFields.CreatedAt] = answer.CreatedAt,
        [RawDataFields.UpdatedAt] = answer.UpdatedAt,
        [RawDataFields.Version] = answer.Version,
        [RawDataFields.WorkflowState] = answer.WorkflowState,
        [RawDataFields.SiteId] = answer.SiteId,
        [RawDataFields.UnitId] = answer.UnitId,
        [RawDataFields.LanguageId] = answer.LanguageId,
    };

    /// <summary>AnswerDuration is stored in seconds; the UI shows mm:ss.</summary>
    private static string FormatDuration(int seconds) =>
        $"{seconds / 60:D2}:{seconds % 60:D2}";

    private static IQueryable<Answer> ApplySort(IQueryable<Answer> query, string sort, bool isSortDsc) =>
        sort switch
        {
            RawDataFields.Id => Order(query, x => x.Id, isSortDsc),
            RawDataFields.MicrotingUid => Order(query, x => x.MicrotingUid, isSortDsc),
            RawDataFields.AnswerDuration => Order(query, x => x.AnswerDuration, isSortDsc),
            RawDataFields.SiteName => Order(query, x => x.Site.Name, isSortDsc),
            RawDataFields.UnitMicrotingUid => Order(query, x => x.Unit.MicrotingUid, isSortDsc),
            RawDataFields.LanguageName => Order(query, x => x.Language.Name, isSortDsc),
            RawDataFields.SurveyConfigurationName => Order(query, x => x.SurveyConfiguration.Name, isSortDsc),
            RawDataFields.CreatedAt => Order(query, x => x.CreatedAt, isSortDsc),
            RawDataFields.UpdatedAt => Order(query, x => x.UpdatedAt, isSortDsc),
            RawDataFields.WorkflowState => Order(query, x => x.WorkflowState, isSortDsc),
            _ => Order(query, x => x.FinishedAt, isSortDsc),
        };

    private static IQueryable<Answer> Order<TKey>(
        IQueryable<Answer> query, Expression<Func<Answer, TKey>> keySelector, bool isSortDsc) =>
        isSortDsc ? query.OrderByDescending(keySelector) : query.OrderBy(keySelector);

    private class AnswerRow
    {
        public int Id { get; init; }
        public int? MicrotingUid { get; init; }
        public DateTime FinishedAt { get; init; }
        public int AnswerDuration { get; init; }
        public int SiteId { get; init; }
        public string SiteName { get; init; }
        public List<string> TagNames { get; init; } = new();
        public int? UnitId { get; init; }
        public int? UnitMicrotingUid { get; init; }
        public int LanguageId { get; init; }
        public string LanguageName { get; init; }
        public string SurveyConfigurationName { get; init; }
        public string QuestionSetName { get; init; }
        public string TimeZone { get; init; }
        public bool UtcAdjusted { get; init; }
        public DateTime? CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        public int? Version { get; init; }
        public string WorkflowState { get; init; }
    }
}
```

- [ ] **Step 3: Build**

Run: `cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn && dotnet build -v q --nologo`
Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`

Two likely compile issues and their fixes:
- If `.ThenInclude(x => x.IgnoredAnswerValues)` is ambiguous, use the explicit generic form `DashboardService.cs` uses: `.ThenInclude<Dashboard, DashboardItem, List<DashboardItemIgnoredAnswer>>(x => x.IgnoredAnswerValues)` and the matching `List<DashboardItemCompare>` form, adding `using Microting.InsightDashboardBase.Infrastructure.Data.Entities;`.
- `Site.SiteTags` has no `WorkflowState` filter available if `SiteTag` does not expose it — it derives from `PnBase`, so it does; if the compiler disagrees, drop that `.Where` clause.

- [ ] **Step 4: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Services/RawDataService
git commit -m "feat(insight-dashboard): add RawDataService with answer pivot and paging"
```

---

### Task 5: Controller, DI registration, localization strings

**Files:**
- Create: `Controllers/RawDataController.cs`
- Modify: `EformInsightDashboardPlugin.cs` (ConfigureServices + usings)
- Modify: `Resources/localization.json`

**Interfaces:**
- Consumes: `IRawDataService` (Task 4).
- Produces: `POST api/insight-dashboard-pn/dashboard-items/raw-data`. Task 7's Angular service calls it.

- [ ] **Step 1: Write the controller**

`Controllers/RawDataController.cs` (the export action is added in Task 6):

```csharp
namespace InsightDashboard.Pn.Controllers;

using System.Threading.Tasks;
using Infrastructure.Models.RawData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Services.RawDataService;

[Authorize]
public class RawDataController : Controller
{
    private readonly IRawDataService _rawDataService;

    public RawDataController(IRawDataService rawDataService)
    {
        _rawDataService = rawDataService;
    }

    [HttpPost]
    [Route("api/insight-dashboard-pn/dashboard-items/raw-data")]
    public async Task<OperationDataResult<RawDataListModel>> GetRawData(
        [FromBody] RawDataRequestModel requestModel)
    {
        return await _rawDataService.GetRawData(requestModel);
    }
}
```

- [ ] **Step 2: Register the service**

In `EformInsightDashboardPlugin.cs`, add to the usings block (alongside the other `Services.*` usings):

```csharp
using Services.RawDataService;
```

and add this line to `ConfigureServices`, after `services.AddScoped<IAnswersService, AnswersService>();`:

```csharp
        services.AddScoped<IRawDataService, RawDataService>();
```

- [ ] **Step 3: Add localization strings**

`Resources/localization.json` is a UTF-8-**with-BOM** JSON array of `{"Key": "...", "LocalizedValue": {"da": "...", "en-US": "..."}}`. Preserve the BOM when saving. Append these three entries before the closing `]`:

```json
  {
    "Key": "DashboardItemNotFound",
    "LocalizedValue": {
      "da": "Dashboard-blokken blev ikke fundet",
      "en-US": "Dashboard block not found"
    }
  },
  {
    "Key": "ErrorWhileObtainingRawData",
    "LocalizedValue": {
      "da": "Der opstod en fejl under hentning af rådata",
      "en-US": "Error while obtaining raw data"
    }
  },
  {
    "Key": "RawDataExportTooLarge",
    "LocalizedValue": {
      "da": "Eksporten indeholder {0} svar, hvilket overstiger grænsen på {1}. Vælg en kortere periode.",
      "en-US": "The export contains {0} answers, which exceeds the limit of {1}. Choose a shorter period."
    }
  }
```

First check whether `DashboardItemNotFound` already exists — `InterviewsService` references it. If it is already present, add only the other two.

- [ ] **Step 4: Build and verify the JSON is still valid**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn
python3 -c "import json;d=json.load(open('Resources/localization.json',encoding='utf-8-sig'));print(len(d),'keys')"
dotnet build -v q --nologo
```
Expected: a key count that is 2 or 3 higher than before, then `Build succeeded. 0 Warning(s) 0 Error(s)`

- [ ] **Step 5: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Controllers/RawDataController.cs \
        eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/EformInsightDashboardPlugin.cs \
        eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Resources/localization.json
git commit -m "feat(insight-dashboard): expose raw data endpoint"
```

---

### Task 6: Excel export

`InterviewsExcelService` cannot be reused — it is driven by a fixed 7-member enum with `ColCount = 6`. Note also that it copies an xlsx template and then immediately overwrites it with `SpreadsheetDocument.Create`, making the template copy pointless; the new service skips the template entirely.

**Files:**
- Create: `Services/RawDataExcelService/IRawDataExcelService.cs`
- Create: `Services/RawDataExcelService/RawDataExcelService.cs`
- Modify: `Controllers/RawDataController.cs` (add the export action)
- Modify: `EformInsightDashboardPlugin.cs` (register the service)

**Interfaces:**
- Consumes: `RawDataListModel` (Task 1), `IRawDataService.GetAllRawData` (Task 4).
- Produces: `IRawDataExcelService.WriteRawDataToExcelFile(RawDataListModel, string destFile)` → `bool` and `CreateFilePath()` → `string`; `GET api/insight-dashboard-pn/dashboard-items/raw-data/export`.

- [ ] **Step 1: Write the interface**

`Services/RawDataExcelService/IRawDataExcelService.cs`:

```csharp
namespace InsightDashboard.Pn.Services.RawDataExcelService;

using Infrastructure.Models.RawData;

public interface IRawDataExcelService
{
    string CreateFilePath();

    bool WriteRawDataToExcelFile(RawDataListModel model, string destFile);
}
```

- [ ] **Step 2: Write the service**

`Services/RawDataExcelService/RawDataExcelService.cs`:

```csharp
namespace InsightDashboard.Pn.Services.RawDataExcelService;

using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Claims;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Infrastructure.Models.RawData;
using Microsoft.AspNetCore.Http;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

public class RawDataExcelService(IHttpContextAccessor httpAccessor) : IRawDataExcelService
{
    public string CreateFilePath()
    {
        var path = Path.Combine(PathHelper.GetStoragePath(), "excel-storage");
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        return Path.Combine(path, $"raw-data-{UserId}-{DateTime.UtcNow.Ticks}.xlsx");
    }

    public bool WriteRawDataToExcelFile(RawDataListModel model, string destFile)
    {
        using var spreadsheetDocument =
            SpreadsheetDocument.Create(destFile, SpreadsheetDocumentType.Workbook);

        var workbookPart = spreadsheetDocument.AddWorkbookPart();
        workbookPart.Workbook = new Workbook();

        var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
        worksheetPart.Worksheet = new Worksheet(new SheetData());

        var sheets = spreadsheetDocument.WorkbookPart!.Workbook.AppendChild(new Sheets());
        sheets.Append(new Sheet
        {
            Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart),
            SheetId = 1,
            Name = "Raw data",
        });

        var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();
        var columns = model.Columns;

        // Header row. Hidden columns are exported too — the export is the full record.
        var headerRow = new Row { RowIndex = 1U };
        for (var col = 0; col < columns.Count; col++)
        {
            headerRow.Append(new Cell
            {
                CellReference = GetCellReference(1, col + 1),
                DataType = CellValues.String,
                CellValue = new CellValue(columns[col].Header ?? string.Empty),
            });
        }

        sheetData!.Append(headerRow);

        var rowIndex = 2;
        foreach (var modelRow in model.Rows)
        {
            var row = new Row { RowIndex = (uint)rowIndex };

            for (var col = 0; col < columns.Count; col++)
            {
                var value = modelRow.GetValueOrDefault(columns[col].Field);
                if (value == null)
                {
                    continue;
                }

                var cell = new Cell { CellReference = GetCellReference(rowIndex, col + 1) };

                switch (value)
                {
                    case DateTime dateTime:
                        cell.DataType = CellValues.String;
                        cell.CellValue = new CellValue(
                            dateTime.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture));
                        break;
                    case int intValue:
                        cell.DataType = CellValues.Number;
                        cell.CellValue = new CellValue(intValue.ToString(CultureInfo.InvariantCulture));
                        break;
                    case bool boolValue:
                        cell.DataType = CellValues.String;
                        cell.CellValue = new CellValue(boolValue ? "true" : "false");
                        break;
                    default:
                        cell.DataType = CellValues.String;
                        cell.CellValue = new CellValue(value.ToString() ?? string.Empty);
                        break;
                }

                row.Append(cell);
            }

            sheetData.Append(row);
            rowIndex++;
        }

        workbookPart.Workbook.Save();
        return true;
    }

    private int UserId
    {
        get
        {
            var value = httpAccessor?.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return value == null ? 0 : int.Parse(value);
        }
    }

    private static string GetCellReference(int rowIndex, int colIndex) =>
        $"{GetColumnName(colIndex)}{rowIndex}";

    private static string GetColumnName(int index)
    {
        var dividend = index;
        var columnName = string.Empty;
        while (dividend > 0)
        {
            var modulo = (dividend - 1) % 26;
            columnName = Convert.ToChar(65 + modulo) + columnName;
            dividend = (dividend - modulo) / 26;
        }

        return columnName;
    }
}
```

Add `using System.Collections.Generic;` if `GetValueOrDefault` is not resolved.

- [ ] **Step 3: Add the export action to the controller**

Add to `Controllers/RawDataController.cs` — usings `System.IO`, `System.Text`, `Services.RawDataExcelService`; inject `IRawDataExcelService` alongside `IRawDataService`; then this action, which follows the streaming shape of `InterviewsController.GenerateReportFile` verbatim:

```csharp
    [HttpGet]
    [Route("api/insight-dashboard-pn/dashboard-items/raw-data/export")]
    [ProducesResponseType(typeof(string), 400)]
    public async Task ExportRawData([FromQuery] RawDataExportRequestModel requestModel)
    {
        var dataResult = await _rawDataService.GetAllRawData(
            requestModel.DashboardId, requestModel.DashboardItemId);

        string filePath = null;
        if (dataResult.Success)
        {
            filePath = _rawDataExcelService.CreateFilePath();
            _rawDataExcelService.WriteRawDataToExcelFile(dataResult.Model, filePath);
        }

        const int bufferSize = 4086;
        var buffer = new byte[bufferSize];

        Response.OnStarting(async () =>
        {
            try
            {
                if (!dataResult.Success)
                {
                    Response.ContentLength = dataResult.Message.Length;
                    Response.ContentType = "text/plain";
                    Response.StatusCode = 400;
                    var bytes = Encoding.UTF8.GetBytes(dataResult.Message);
                    await Response.Body.WriteAsync(bytes, 0, bytes.Length);
                    await Response.Body.FlushAsync();
                }
                else
                {
                    await using var excelStream = new FileStream(filePath, FileMode.Open);
                    int bytesRead;
                    Response.ContentLength = excelStream.Length;
                    Response.ContentType =
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    while ((bytesRead = excelStream.Read(buffer, 0, buffer.Length)) > 0 &&
                           !HttpContext.RequestAborted.IsCancellationRequested)
                    {
                        await Response.Body.WriteAsync(buffer, 0, bytesRead);
                        await Response.Body.FlushAsync();
                    }
                }
            }
            finally
            {
                if (!string.IsNullOrEmpty(filePath) && System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
        });
    }
```

- [ ] **Step 4: Register the Excel service**

In `EformInsightDashboardPlugin.cs`, add `using Services.RawDataExcelService;` and this line to `ConfigureServices`, next to the other `AddTransient` excel/word registrations:

```csharp
        services.AddTransient<IRawDataExcelService, RawDataExcelService>();
```

- [ ] **Step 5: Build**

Run: `cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn && dotnet build -v q --nologo`
Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`

- [ ] **Step 6: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Services/RawDataExcelService \
        eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Controllers/RawDataController.cs \
        eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/EformInsightDashboardPlugin.cs
git commit -m "feat(insight-dashboard): add raw data excel export"
```

---

### Task 7: Angular models, service, component and wiring

**Files:**
- Create: `models/dashboard/raw-data/raw-data-column.model.ts`
- Create: `models/dashboard/raw-data/raw-data-list.model.ts`
- Create: `models/dashboard/raw-data/raw-data-request.model.ts`
- Create: `models/dashboard/raw-data/index.ts`
- Create: `services/insight-dashboard-pn-raw-data.service.ts`
- Create: `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.ts`
- Create: `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.html`
- Create: `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.scss` (empty file — the convention here, see `dashboard-block-view.component.scss`)
- Create: `components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.spec.ts`
- Modify: `models/dashboard/index.ts`, `services/index.ts`, `components/dashboards/view/index.ts`
- Modify: `insight-dashboard-pn.module.ts`
- Modify: `components/dashboards/view/dashboard-block-view/dashboard-block-view.component.html`
- Modify: `i18n/en-US.ts`, `i18n/da.ts`

All paths relative to `/home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn/`.

**Interfaces:**
- Consumes: `POST api/insight-dashboard-pn/dashboard-items/raw-data` (Task 5), `GET .../raw-data/export` (Task 6).
- Produces: `<app-dashboard-raw-data-view [dashboardViewModel] [itemModel]>`, plus DOM ids `dashboardRawDataToggle{position}`, `dashboardRawData{position}`, `dashboardRawDataExport{position}` that Task 8 targets.

- [ ] **Step 1: Create the models**

`models/dashboard/raw-data/raw-data-column.model.ts`:

```typescript
export class RawDataColumnModel {
  field: string;
  header: string;
  kind: string;
  defaultHidden: boolean;
  sortable: boolean;
  questionId: number | null;
  optionId: number | null;
}
```

`models/dashboard/raw-data/raw-data-list.model.ts`:

```typescript
import {RawDataColumnModel} from './raw-data-column.model';

export class RawDataListModel {
  total = 0;
  columns: RawDataColumnModel[] = [];
  rows: any[] = [];
}
```

Rows are `any[]` deliberately: the key set is decided by the survey at runtime, so there is no meaningful static type.

`models/dashboard/raw-data/raw-data-request.model.ts`:

```typescript
export class RawDataRequestModel {
  dashboardId: number;
  dashboardItemId: number;
  pageSize = 25;
  offset = 0;
  sort = 'finishedAt';
  isSortDsc = true;
}

export class RawDataExportRequestModel {
  dashboardId: number;
  dashboardItemId: number;
}
```

`models/dashboard/raw-data/index.ts`:

```typescript
export * from './raw-data-column.model';
export * from './raw-data-list.model';
export * from './raw-data-request.model';
```

Add `export * from './raw-data';` to `models/dashboard/index.ts`.

- [ ] **Step 2: Create the service**

`services/insight-dashboard-pn-raw-data.service.ts`:

```typescript
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RawDataExportRequestModel, RawDataListModel, RawDataRequestModel} from '../models';
import {OperationDataResult} from 'src/app/common/models';
import {ApiBaseService} from 'src/app/common/services';

const RawDataMethods = {
  RawData: 'api/insight-dashboard-pn/dashboard-items/raw-data',
  Export: 'api/insight-dashboard-pn/dashboard-items/raw-data/export',
};

@Injectable()
export class InsightDashboardPnRawDataService {
  private apiBaseService = inject(ApiBaseService);

  getRawData(model: RawDataRequestModel): Observable<OperationDataResult<RawDataListModel>> {
    return this.apiBaseService.post(RawDataMethods.RawData, model);
  }

  exportToExcel(model: RawDataExportRequestModel): Observable<any> {
    return this.apiBaseService.getBlobData(RawDataMethods.Export, model);
  }
}
```

Add `export * from './insight-dashboard-pn-raw-data.service';` to `services/index.ts`.

- [ ] **Step 3: Create the component TypeScript**

`components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.ts`:

```typescript
import {Component, inject, Input, OnDestroy} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Observable, of, Subscription} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {saveAs} from 'file-saver';
import {PaginationModel} from 'src/app/common/models';
import {updateTableSort} from 'src/app/common/helpers';
import {InsightDashboardPnRawDataService} from '../../../../services';
import {DashboardViewItemModel, DashboardViewModel, RawDataColumnModel} from '../../../../models';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-raw-data-view',
  templateUrl: './dashboard-raw-data-view.component.html',
  styleUrls: ['./dashboard-raw-data-view.component.scss'],
  standalone: false,
})
export class DashboardRawDataViewComponent implements OnDestroy {
  private translateService = inject(TranslateService);
  private rawDataService = inject(InsightDashboardPnRawDataService);

  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();

  expanded = false;
  loading = false;
  loaded = false;
  total = 0;
  rows: any[] = [];
  tableHeaders: MtxGridColumn[] = [];
  pagination: PaginationModel = new PaginationModel(0, 25, 0);
  sort = 'finishedAt';
  isSortDsc = true;

  getRawDataSub$: Subscription;
  exportSub$: Subscription;

  get sortDirection(): 'asc' | 'desc' {
    return this.isSortDsc ? 'desc' : 'asc';
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded && !this.loaded) {
      this.getRawData();
    }
  }

  getRawData() {
    this.loading = true;
    this.getRawDataSub$ = this.rawDataService
      .getRawData({
        dashboardId: this.dashboardViewModel.id,
        dashboardItemId: this.itemModel.id,
        offset: this.pagination.offset,
        pageSize: this.pagination.pageSize,
        sort: this.sort,
        isSortDsc: this.isSortDsc,
      })
      .subscribe((data) => {
        this.loading = false;
        if (data && data.success && data.model) {
          this.loaded = true;
          this.total = data.model.total;
          this.pagination = {...this.pagination, total: data.model.total};
          this.rows = data.model.rows;
          this.tableHeaders = data.model.columns.map((column) => this.toGridColumn(column));
        }
      });
  }

  // Answer column headers are translation keys; question and option headers are
  // already-resolved text from the database and must not be run through translate.
  private toGridColumn(column: RawDataColumnModel): MtxGridColumn {
    const header: Observable<string> = column.kind === 'answer'
      ? this.translateService.stream(column.header)
      : of(column.header);

    const gridColumn: MtxGridColumn = {
      header: header,
      field: column.field,
      hide: column.defaultHidden,
      sortable: column.sortable,
    };

    if (column.sortable) {
      gridColumn.sortProp = {id: column.field};
    }

    return gridColumn;
  }

  sortTable(sort: Sort) {
    const updated = updateTableSort(sort.active, this.sort, this.isSortDsc);
    this.sort = updated.sort;
    this.isSortDsc = updated.isSortDsc;
    this.getRawData();
  }

  onPaginationChanged(pagination: PaginationModel) {
    this.pagination = {
      ...this.pagination,
      pageSize: pagination.pageSize,
      offset: pagination.offset,
    };
    this.getRawData();
  }

  exportToExcel() {
    this.exportSub$ = this.rawDataService
      .exportToExcel({
        dashboardId: this.dashboardViewModel.id,
        dashboardItemId: this.itemModel.id,
      })
      .subscribe((data) => {
        saveAs(new Blob([data]), `${this.dashboardViewModel.dashboardName}_raw_data.xlsx`);
      });
  }

  ngOnDestroy(): void {}
}
```

- [ ] **Step 4: Create the component template**

`components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.html`:

```html
<div class="mt-3">
  <button
    mat-button
    color="accent"
    (click)="toggle()"
    id="dashboardRawDataToggle{{itemModel.position}}"
  >
    <mat-icon>{{ expanded ? 'expand_more' : 'chevron_right' }}</mat-icon>
    {{ 'Raw data' | translate }}
    <span *ngIf="expanded && loaded"> &mdash; {{ total }} {{ 'answers' | translate }}</span>
  </button>
</div>

<ng-container *ngIf="expanded">
  <ng-template #toolbarTpl>
    <button
      mat-icon-button
      color="accent"
      (click)="exportToExcel()"
      id="dashboardRawDataExport{{itemModel.position}}"
      [matTooltip]="'Export raw data' | translate"
    >
      <mat-icon>download</mat-icon>
    </button>
  </ng-template>

  <mtx-grid
    id="dashboardRawData{{itemModel.position}}"
    [data]="rows"
    [columns]="tableHeaders"
    [loading]="loading"
    [showPaginator]="true"
    [paginationTemplate]="paginatorTpl"
    [pageOnFront]="false"
    [rowStriped]="true"
    [showToolbar]="true"
    [showColumnMenuButton]="true"
    [toolbarTemplate]="toolbarTpl"
    [sortActive]="sort"
    [sortDirection]="sortDirection"
    (sortChange)="sortTable($event)"
    [noResultText]="'No raw data found' | translate"
  >
  </mtx-grid>

  <ng-template #paginatorTpl>
    <eform-pagination
      [pagination]="pagination"
      (paginationChanged)="onPaginationChanged($event)"
    ></eform-pagination>
  </ng-template>
</ng-container>
```

Create `dashboard-raw-data-view.component.scss` as an empty file.

- [ ] **Step 5: Export the component and register it**

Add to `components/dashboards/view/index.ts`:

```typescript
export * from './dashboard-raw-data-view/dashboard-raw-data-view.component';
```

In `insight-dashboard-pn.module.ts`:
- add `DashboardRawDataViewComponent` to the import list from `'./components'`
- add `DashboardRawDataViewComponent,` to `declarations`
- add `InsightDashboardPnRawDataService` to the import list from `'./services'` and to `providers`

- [ ] **Step 6: Render it under each chart**

In `components/dashboards/view/dashboard-block-view/dashboard-block-view.component.html`, inside the existing `<ng-container *ngIf="itemModel.firstQuestionType !== questionType.Text">`, add the new component immediately after `<app-dashboard-chart-data-view>`:

```html
        <ng-container *ngIf="itemModel.firstQuestionType !== questionType.Text">
          <app-dashboard-chart-view
            [chartPosition]="position"
            [itemModel]="itemModel">
          </app-dashboard-chart-view>
          <app-dashboard-chart-data-view [itemModel]="itemModel"></app-dashboard-chart-data-view>
          <app-dashboard-raw-data-view
            [dashboardViewModel]="dashboardViewModel"
            [itemModel]="itemModel">
          </app-dashboard-raw-data-view>
        </ng-container>
```

Text-type items keep showing only the interviews grid — they have no chart to reconcile against, and the backend rejects raw-data requests for them.

- [ ] **Step 7: Add i18n keys**

Append to the object in `i18n/en-US.ts` (before the closing `};`):

```typescript
  'Raw data': 'Raw data',
  'answers': 'answers',
  'No raw data found': 'No raw data found',
  'Export raw data': 'Export raw data',
  'Microting UID': 'Microting UID',
  'Finished at': 'Finished at',
  'Duration': 'Duration',
  'Site': 'Site',
  'Tags': 'Tags',
  'Unit': 'Unit',
  'Survey config': 'Survey config',
  'Time zone': 'Time zone',
  'UTC adjusted': 'UTC adjusted',
  'Created at': 'Created at',
  'Updated at': 'Updated at',
  'Version': 'Version',
  'Workflow state': 'Workflow state',
  'Site id': 'Site id',
  'Unit id': 'Unit id',
  'Language id': 'Language id',
```

Append the same keys to `i18n/da.ts`:

```typescript
  'Raw data': 'Rådata',
  'answers': 'svar',
  'No raw data found': 'Ingen rådata fundet',
  'Export raw data': 'Eksportér rådata',
  'Microting UID': 'Microting UID',
  'Finished at': 'Afsluttet',
  'Duration': 'Varighed',
  'Site': 'Lokation',
  'Tags': 'Tags',
  'Unit': 'Enhed',
  'Survey config': 'Undersøgelseskonfiguration',
  'Time zone': 'Tidszone',
  'UTC adjusted': 'UTC-justeret',
  'Created at': 'Oprettet',
  'Updated at': 'Opdateret',
  'Version': 'Version',
  'Workflow state': 'Workflow-status',
  'Site id': 'Lokations-id',
  'Unit id': 'Enheds-id',
  'Language id': 'Sprog-id',
```

`Id`, `Language`, `Survey` and `Question` already exist in both files — do not duplicate them. Check before appending; a duplicate key is a silent overwrite.

- [ ] **Step 8: Write the failing jest spec**

`components/dashboards/view/dashboard-raw-data-view/dashboard-raw-data-view.component.spec.ts`. Written with `waitForAsync`, unlike the 71 pre-existing broken stubs that use the removed `async`:

```typescript
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DashboardRawDataViewComponent} from './dashboard-raw-data-view.component';
import {InsightDashboardPnRawDataService} from '../../../../services';

@Pipe({name: 'translate', standalone: false})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DashboardRawDataViewComponent', () => {
  let component: DashboardRawDataViewComponent;
  let fixture: ComponentFixture<DashboardRawDataViewComponent>;

  const response = {
    success: true,
    model: {
      total: 2,
      columns: [
        {field: 'finishedAt', header: 'Finished at', kind: 'answer', defaultHidden: false, sortable: true, questionId: null, optionId: null},
        {field: 'timeZone', header: 'Time zone', kind: 'answer', defaultHidden: true, sortable: false, questionId: null, optionId: null},
        {field: 'q7_o21', header: '2 – Områder › Kantine', kind: 'multiOption', defaultHidden: false, sortable: false, questionId: 7, optionId: 21},
      ],
      rows: [
        {finishedAt: '2026-03-02T08:14:22', timeZone: 'Europe/Copenhagen', q7_o21: 'Kantine'},
        {finishedAt: '2026-03-03T07:22:11', timeZone: 'Europe/Copenhagen', q7_o21: ''},
      ],
    },
  };

  const rawDataServiceMock = {
    getRawData: jest.fn(() => of(response)),
    exportToExcel: jest.fn(() => of(new Blob())),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardRawDataViewComponent, MockTranslatePipe],
      providers: [
        {provide: InsightDashboardPnRawDataService, useValue: rawDataServiceMock},
        {
          provide: TranslateService,
          useValue: {
            stream: (key: string) => of(key),
            get: (key: string) => of(key),
            instant: (key: string) => key,
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRawDataViewComponent);
    component = fixture.componentInstance;
    component.dashboardViewModel = {id: 3, dashboardName: 'Test'} as any;
    component.itemModel = {id: 9, position: 1} as any;
    fixture.detectChanges();
  });

  it('should create without loading data', () => {
    expect(component).toBeTruthy();
    expect(component.expanded).toBe(false);
    expect(rawDataServiceMock.getRawData).not.toHaveBeenCalled();
  });

  it('loads data on first expand and does not refetch on re-expand', () => {
    component.toggle();

    expect(component.expanded).toBe(true);
    expect(component.total).toBe(2);
    expect(component.rows.length).toBe(2);
    expect(rawDataServiceMock.getRawData).toHaveBeenCalledTimes(1);

    component.toggle();
    component.toggle();

    expect(rawDataServiceMock.getRawData).toHaveBeenCalledTimes(1);
  });

  it('maps columns, hiding defaults and marking only answer columns sortable', () => {
    component.toggle();

    const [finishedAt, timeZone, optionColumn] = component.tableHeaders;

    expect(finishedAt.field).toBe('finishedAt');
    expect(finishedAt.sortable).toBe(true);
    expect(finishedAt.sortProp).toEqual({id: 'finishedAt'});

    expect(timeZone.hide).toBe(true);

    expect(optionColumn.sortable).toBe(false);
    expect(optionColumn.sortProp).toBeUndefined();
  });
});
```

- [ ] **Step 9: Run the spec — expect failure first**

Run:
```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client
npx jest src/app/plugins/modules/insight-dashboard-pn/components/dashboards/view/dashboard-raw-data-view
```
Expected before Steps 3-4 are complete: FAIL, "Cannot find module './dashboard-raw-data-view.component'". If Steps 3-4 are already done, expect PASS — in that case, deliberately break one assertion, re-run to confirm the spec actually exercises the component, then restore it.

- [ ] **Step 10: Run the spec and the build to verify green**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client
npx jest src/app/plugins/modules/insight-dashboard-pn/components/dashboards/view/dashboard-raw-data-view
npx ng build
```
Expected: `Tests: 3 passed`, then a successful Angular build.

- [ ] **Step 11: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eform-client/src/app/plugins/modules/insight-dashboard-pn
git commit -m "feat(insight-dashboard): add raw data table under each chart"
```

---

### Task 8: Playwright end-to-end coverage

**Important:** `devgetchanges.sh` does **not** sync `eform-client/playwright/`, and the host app has no insight-dashboard Playwright specs. This suite lives only in the plugin source repo, so — unlike every other task — these files are authored directly at
`/home/rene/Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/playwright/e2e/plugins/insight-dashboard-pn/`.

**Files:**
- Modify: `InsightDashboard-DashboardView.page.ts` (add locators)
- Create: `c/insight-dashboard-raw-data.spec.ts`

**Interfaces:**
- Consumes: DOM ids from Task 7 (`dashboardRawDataToggle{position}`, `dashboardRawData{position}`, `dashboardRawDataExport{position}`) and the existing `dataViewAmount{n}` ids on the aggregated table.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Add locators to the page object**

Append these methods to the `InsightDashboardDashboardViewPage` class in `InsightDashboard-DashboardView.page.ts`, matching the existing `page.locator('#id')` style:

```typescript
  public rawDataToggle(rowNum: number) {
    return this.page.locator(`#dashboardRawDataToggle${rowNum + 1}`);
  }

  public rawDataGrid(rowNum: number) {
    return this.page.locator(`#dashboardRawData${rowNum + 1}`);
  }

  public rawDataExportButton(rowNum: number) {
    return this.page.locator(`#dashboardRawDataExport${rowNum + 1}`);
  }

  public rawDataRows(rowNum: number) {
    return this.rawDataGrid(rowNum).locator('tbody tr.mat-row, tbody tr.mdc-data-table__row');
  }

  public rawDataHeaders(rowNum: number) {
    return this.rawDataGrid(rowNum).locator('thead th');
  }
```

`position` is 1-based on the item model while the existing page-object helpers take a 0-based index, hence the `+ 1`.

- [ ] **Step 2: Write the spec**

Create `c/insight-dashboard-raw-data.spec.ts`. Model its dashboard setup on the existing `c/insight-dashboard-multi.multi.spec.ts` — open that file first and reuse its `test.beforeEach` login/navigation and its dashboard-creation helper calls verbatim, changing only the assertions below. The reconciliation assertion is the point of this test:

```typescript
import {expect, test} from '@playwright/test';
import {InsightDashboardDashboardViewPage} from '../InsightDashboard-DashboardView.page';

test.describe('Insight dashboard raw data table', () => {
  test('is collapsed until opened, then reconciles with the chart total', async ({page}) => {
    const viewPage = new InsightDashboardDashboardViewPage(page);

    // The grid must not exist before the toggle is clicked — data loads lazily.
    await expect(viewPage.rawDataGrid(0)).toHaveCount(0);

    await viewPage.rawDataToggle(0).click();
    await expect(viewPage.rawDataGrid(0)).toBeVisible();

    // The aggregated table's bolded Total row, last cell, is the chart's total amount.
    const amountTotalRow = viewPage.rawChartDataAmountValueRow(0, 0, 0).last();
    const totalCells = amountTotalRow.locator('td');
    const chartTotalText = await totalCells.last().textContent();
    const chartTotal = Number(chartTotalText?.trim());

    const toggleText = await viewPage.rawDataToggle(0).textContent();
    const reportedAnswers = Number(toggleText?.match(/(\d+)/)?.[1]);

    // Equal for every question type except multi, where one answer contributes
    // several answer values and the chart total legitimately exceeds the row count.
    expect(reportedAnswers).toBe(chartTotal);
  });

  test('places each chosen multi-select option in its own column', async ({page}) => {
    const viewPage = new InsightDashboardDashboardViewPage(page);

    await viewPage.rawDataToggle(0).click();
    await expect(viewPage.rawDataGrid(0)).toBeVisible();

    const headers = await viewPage.rawDataHeaders(0).allTextContents();
    const optionHeaders = headers.filter((h) => h.includes('›'));
    expect(optionHeaders.length).toBeGreaterThan(0);

    // Every option header carries its question label as a prefix.
    for (const header of optionHeaders) {
      expect(header.split('›')[0].trim().length).toBeGreaterThan(0);
    }

    const rowCount = await viewPage.rawDataRows(0).count();
    expect(rowCount).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run the spec**

Run the insight-dashboard Playwright suite the same way the existing `c/` specs are run in this repo (check `package.json` / CI config in the plugin repo for the exact playwright project name before inventing a command).
Expected: both tests pass against a running dev stack.

If the stack is not running, this step is blocked — record that in the task and hand back to the user rather than marking the task done.

- [ ] **Step 4: Commit in the plugin source repo**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-insight-dashboard-plugin
git add "eform-client/playwright/e2e/plugins/insight-dashboard-pn/InsightDashboard-DashboardView.page.ts" \
        "eform-client/playwright/e2e/plugins/insight-dashboard-pn/c/insight-dashboard-raw-data.spec.ts"
git commit -m "test(insight-dashboard): cover raw data table"
```

---

### Task 9: Review, sync back, and commit the plugin

**Files:** no new files; this task moves the host-app work into the plugin source repo.

- [ ] **Step 1: Request code review**

Use the `superpowers:requesting-code-review` skill against the full diff of the host app's plugin directories. Address any findings before continuing.

- [ ] **Step 2: Confirm the browser behaviour with the user**

Ask the user to open a dashboard, expand `Raw data` under a chart, and confirm: the row count matches the chart, the column picker reveals `Time zone`, paging works, and the Excel export downloads. Do not proceed until they confirm — the backend has no unit tests, so this is the real verification gate.

- [ ] **Step 3: Sync back to the plugin repo**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-insight-dashboard-plugin
./devgetchanges.sh
```

This wholesale-replaces `eform-client/src/app/plugins/modules/insight-dashboard-pn` and `eFormAPI/Plugins/InsightDashboard.Pn` in the plugin repo with the host-app copies.

- [ ] **Step 4: Discard build and config artifacts**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-insight-dashboard-plugin
git checkout -- $(git diff --name-only | grep -E '\.(csproj|conf\.ts|xlsx|docx)$') 2>/dev/null || true
git status --short
```

- [ ] **Step 5: Compare against intent**

Review `git status` line by line. The expected additions are exactly:
- `eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/Infrastructure/Models/RawData/` (6 files)
- `eFormAPI/.../Infrastructure/Helpers/AnswerFilterHelper.cs`, `RawDataTranslations.cs`, `RawDataColumnBuilder.cs`
- `eFormAPI/.../Services/RawDataService/` (2 files), `Services/RawDataExcelService/` (2 files)
- `eFormAPI/.../Controllers/RawDataController.cs`
- `eform-client/src/.../models/dashboard/raw-data/` (4 files)
- `eform-client/src/.../services/insight-dashboard-pn-raw-data.service.ts`
- `eform-client/src/.../components/dashboards/view/dashboard-raw-data-view/` (4 files)

The expected modifications are exactly: `EformInsightDashboardPlugin.cs`, `Resources/localization.json`, `insight-dashboard-pn.module.ts`, `dashboard-block-view.component.html`, `i18n/en-US.ts`, `i18n/da.ts`, and the three `index.ts` barrels.

Run `git checkout --` on anything else that appears.

- [ ] **Step 6: Show the user the final status and commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-insight-dashboard-plugin
git status --short
```

Present that output to the user for confirmation. Only after they approve, stage the files **by name** (never `git add .`) and commit:

```bash
git commit -m "feat: add raw data table under each dashboard chart"
```

---

## Self-review

**Spec coverage.** Rows definition → Task 2. Answer column inventory → Task 3 `BuildAnswerColumns`. Dynamic question columns, `QuestionIndex` ordering, `"N – text"` labels, multi expansion by `OptionIndex` → Task 3. Cell content per question type, including smiley `label (weight)` and the `—` skipped convention → Task 4 `ResolveSingleValue` and the pivot loop. Placement and lazy collapse → Task 7 Steps 4 and 6. Server paging and sorting → Task 4 `ApplySort` plus Task 7 Steps 3-4. Excel export with hidden columns included and the 100 000 cap → Task 6 and `RawDataService.ExportRowLimit`. Language resolution → Task 3 `RawDataTranslations`. Error handling table → Task 4's guards plus Task 5's localization entries. Reconciliation invariant → Task 2's comments and Task 8's first test.

Two spec items are deliberately narrowed, and both are called out where they occur: the spec's error table lists a distinct behaviour for text-type items, which Task 7 Step 6 handles by not rendering the component at all rather than by returning a specific message; and the spec's testing section listed six Playwright assertions, of which Task 8 implements the two that carry real risk (reconciliation, multi-select placement) — the column-picker, paging and export assertions are covered by the jest spec and the manual gate in Task 9 Step 2 instead. Anyone wanting the full six should add them to Task 8.

**Placeholder scan.** No TBDs, no "add error handling", no "similar to Task N". Every code step carries the actual code. Task 8 Step 3 deliberately does not invent a test command and instead directs the implementer to read the repo's config — inventing one would be worse than saying so.

**Type consistency.** `RawDataListModel.Rows` is `List<Dictionary<string, object>>` in Tasks 1, 4 and 6 and `any[]` in Task 7. `RawDataColumnModel` field names match between C# (PascalCase) and TypeScript (camelCase) under default ASP.NET JSON casing. `RawDataQuestionMeta.OptionFields` is populated for both the multi branch and the single branch in Task 3 and consumed by the "not answered" pre-fill in Task 4. `AnswerFilterHelper.BuildAnswerQuery` is non-async and returns `IQueryable<Answer>` in both Task 2 and its Task 4 call site. `IRawDataService` exposes both `GetRawData` and `GetAllRawData`, used by Task 5 and Task 6 respectively.
