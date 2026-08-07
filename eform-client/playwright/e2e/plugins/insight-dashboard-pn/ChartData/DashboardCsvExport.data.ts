import { DashboardTestItemEditModel } from '../InsightDashboard-DashboardEdit.page';

/**
 * Two chart items, because the aggregated table exports in two shapes: the
 * stacked grouped chart puts percentages and amounts side by side in one row,
 * every other chart type stacks them as two tables. The text question item that
 * produces the interviews table cannot live here - it is filled through
 * fillTextQuestionItem, which skips the chart controls a text question hides.
 */
export const dashboardCsvExportItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q13',
    firstQuestionForSelect: '13 - Q13: ...',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Linje',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: [],
  },
  {
    firstQuestion: 'Q13',
    firstQuestionForSelect: '13 - Q13: ...',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Vandret Bjælke Stablet Grupperet',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: [],
  },
];

/** Question 14 in the Test-Set survey is the survey's only text question. */
export const csvExportTextQuestion = {
  firstQuestion: 'Enter you opinion',
  firstQuestionForSelect: '14 - Enter you opinion about the question',
};
