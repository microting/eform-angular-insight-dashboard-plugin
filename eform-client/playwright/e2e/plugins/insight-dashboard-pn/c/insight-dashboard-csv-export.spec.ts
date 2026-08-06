import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import { LoginPage } from '../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';
import { InsightDashboardDashboardViewPage } from '../InsightDashboard-DashboardView.page';
import {
  InsightDashboardDashboardEditPage,
  DashboardTestConfigEditModel,
} from '../InsightDashboard-DashboardEdit.page';
import {
  dashboardCsvExportItems,
  csvExportTextQuestion,
} from '../ChartData/DashboardCsvExport.data';

const dashboardName = 'CSV export';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 1,
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 6,
    dayTo: 14,
  },
  today: true,
};

const BOM = '﻿';
const RECORD_SEPARATOR = '\r\n';

interface ExportedFile {
  fileName: string;
  text: string;
  records: string[];
}

/** Splits an export into records, dropping the empty tail after the last CRLF. */
function toRecords(text: string): string[] {
  const records = text.split(RECORD_SEPARATOR);
  if (records[records.length - 1] === '') {
    records.pop();
  }
  return records;
}

function cells(record: string): string[] {
  return record.split('\t');
}

/**
 * A blank record separates one table from the next. The aggregated export holds
 * several: a chart with more than one raw data block writes one section per
 * block, and a non grouped chart splits each block into percentages and amounts.
 */
function toSections(records: string[]): string[][] {
  const sections: string[][] = [];
  let current: string[] = [];
  for (const record of records) {
    if (record === '') {
      sections.push(current);
      current = [];
    } else {
      current.push(record);
    }
  }
  sections.push(current);
  return sections;
}

/** Every record in a section describes the same columns as its header. */
function expectRectangular(section: string[]) {
  const width = cells(section[0]).length;
  expect(width).toBeGreaterThan(1);
  for (const record of section) {
    expect(cells(record).length).toBe(width);
  }
}

test.describe('InSight Dashboard - tab separated CSV export', () => {
  let page: any;
  let insightDashboardPage: InsightDashboardPage;
  let dashboardsPage: InsightDashboardDashboardsPage;
  let dashboardEditPage: InsightDashboardDashboardEditPage;
  let dashboardsViewPage: InsightDashboardDashboardViewPage;

  const download = async (locator: any): Promise<ExportedFile> => {
    const [downloaded] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      locator.click(),
    ]);
    const savedTo = await downloaded.path();
    const text = fs.readFileSync(savedTo, 'utf8');
    return {
      fileName: downloaded.suggestedFilename(),
      text,
      records: toRecords(text),
    };
  };

  const ensureRawDataExpanded = async (item: number) => {
    if ((await dashboardsViewPage.rawDataGrid(item).count()) === 0) {
      await dashboardsViewPage.rawDataToggle(item).click();
    }
    await expect(dashboardsViewPage.rawDataGrid(item)).toBeVisible();
    await expect(dashboardsViewPage.rawDataRows(item).first()).toBeVisible({
      timeout: 30000,
    });
  };

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    insightDashboardPage = new InsightDashboardPage(page);
    dashboardsPage = new InsightDashboardDashboardsPage(page);
    dashboardEditPage = new InsightDashboardDashboardEditPage(page);
    dashboardsViewPage = new InsightDashboardDashboardViewPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard(dashboardName);
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardCsvExportItems);

    // A third item on the survey's text question, which renders the interviews
    // table instead of a chart.
    await dashboardEditPage.createItem(
      await dashboardEditPage.getDashboardItem(dashboardCsvExportItems.length)
    );
    await dashboardEditPage.fillTextQuestionItem(
      dashboardCsvExportItems.length + 1,
      csvExportTextQuestion.firstQuestion,
      csvExportTextQuestion.firstQuestionForSelect
    );

    await dashboardEditPage.dashboardUpdateSaveBtn.click();
    await page
      .locator('#spinner-animation')
      .waitFor({ state: 'hidden', timeout: 40000 });
    await page.waitForTimeout(1000);
  });

  test.afterAll(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('writes a byte order mark, tab fields and CRLF records', async () => {
    const file = await download(dashboardsViewPage.chartDataExportCsvButton(0));

    expect(file.text.startsWith(BOM)).toBe(true);
    // The extension says comma; the delimiter is a tab. That is the point.
    expect(cells(file.records[0]).length).toBeGreaterThan(1);
    expect(file.text.endsWith(RECORD_SEPARATOR)).toBe(true);
    // Lone LFs would break the record separator contract.
    expect(file.text.replace(/\r\n/g, '')).not.toContain('\n');
  });

  test('names each file after the dashboard, the item and the table', async () => {
    const chart = await download(dashboardsViewPage.chartDataExportCsvButton(0));
    expect(chart.fileName).toBe(`${dashboardName}_1_chart_data.csv`);

    const interviewsButton = dashboardsViewPage.interviewsExportCsvButton(
      dashboardCsvExportItems.length
    );
    // The button is only rendered when the item has interviews to export, which
    // is a property of the seed data rather than of the feature.
    test.skip(
      (await interviewsButton.count()) === 0,
      'Seed data has no interviews in the dashboard period.'
    );

    const interviews = await download(interviewsButton);
    expect(interviews.fileName).toBe(
      `${dashboardName}_${dashboardCsvExportItems.length + 1}_interviews.csv`
    );
  });

  test('stacks percentages above amounts for a non grouped chart', async () => {
    const file = await download(dashboardsViewPage.chartDataExportCsvButton(0));
    const sections = toSections(file.records);

    // Percentages and amounts are two tables on screen, so they are two sections
    // in the file - and a chart with several raw data blocks repeats the pair.
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections.length % 2).toBe(0);

    for (let i = 0; i < sections.length; i += 2) {
      const percents = sections[i];
      const amounts = sections[i + 1];
      expectRectangular(percents);
      expectRectangular(amounts);
      // Both halves describe the same columns, so they carry the same header.
      expect(amounts[0]).toBe(percents[0]);
      expect(percents.length).toBeGreaterThan(1);
      expect(amounts.length).toBe(percents.length);
      // Percentages keep the sign the table shows; amounts are bare numbers.
      expect(percents[1]).toContain('%');
      expect(amounts[1]).not.toContain('%');
    }
  });

  test('keeps percentages and amounts on one row for the stacked grouped chart', async () => {
    const file = await download(dashboardsViewPage.chartDataExportCsvButton(1));

    for (const section of toSections(file.records)) {
      expectRectangular(section);
      expect(section.length).toBeGreaterThan(1);

      for (const record of section.slice(1)) {
        const values = cells(record);
        // The group name is promoted from the rowSpan cell to a leading column.
        expect(values[0].length).toBeGreaterThan(0);
        // This chart puts both halves on the same row, so a data record carries
        // percentages and amounts together rather than one or the other.
        expect(values.some((value) => value.endsWith('%'))).toBe(true);
        expect(values.slice(2).some((value) => /^\d+$/.test(value))).toBe(true);
      }
    }
  });

  test('exports every raw data row, not just the page on screen', async () => {
    await ensureRawDataExpanded(0);

    const answerCount = await dashboardsViewPage.rawDataAnswerCount(0);
    expect(answerCount).not.toBeNull();
    expect(answerCount as number).toBeGreaterThan(0);

    const onScreenRows = await dashboardsViewPage.rawDataRows(0).count();
    const file = await download(dashboardsViewPage.rawDataExportCsvButton(0));

    // One header plus one record per answer in the whole result, which is more
    // than the grid holds whenever the result runs past a single page.
    expect(file.records.length - 1).toBe(answerCount);
    if ((answerCount as number) > onScreenRows) {
      expect(file.records.length - 1).toBeGreaterThan(onScreenRows);
    }
  });

  test('exports exactly the raw data columns the grid is showing', async () => {
    await ensureRawDataExpanded(0);

    const onScreenHeaders = (
      await dashboardsViewPage.rawDataHeaders(0).allTextContents()
    ).map((header) => header.trim());

    const file = await download(dashboardsViewPage.rawDataExportCsvButton(0));
    const fileHeaders = cells(file.records[0]);
    fileHeaders[0] = fileHeaders[0].replace(BOM, '');

    expect(fileHeaders).toEqual(onScreenHeaders);
    // Time zone ships hidden behind the column picker and must stay out.
    expect(fileHeaders).not.toContain('Tidszone');

    const width = fileHeaders.length;
    for (const record of file.records.slice(1)) {
      expect(cells(record).length).toBe(width);
    }
  });

  test('exports the interviews table with one record per interview', async () => {
    const item = dashboardCsvExportItems.length;
    const button = dashboardsViewPage.interviewsExportCsvButton(item);
    test.skip(
      (await button.count()) === 0,
      'Seed data has no interviews in the dashboard period.'
    );

    const file = await download(button);

    const headers = cells(file.records[0]);
    headers[0] = headers[0].replace(BOM, '');
    expect(headers.length).toBe(3);
    expect(headers[1]).toBe('Tag');

    for (const record of file.records.slice(1)) {
      expect(cells(record).length).toBeGreaterThanOrEqual(3);
      // Dates are written the way the grid renders them: dd.MM.yyyy HH:mm:ss.
      expect(cells(record)[0]).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}$/);
    }
  });
});
