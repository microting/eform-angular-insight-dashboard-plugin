export enum DashboardChartTypesEnum {
  Line = 1,
  // Pie = 2,
  Pie = 3,
  PieGrid,
  HorizontalBar,
  HorizontalBarStacked,
  HorizontalBarGrouped,
  VerticalBar,
  VerticalBarStacked,
  VerticalBarGrouped,
  HorizontalBarStackedGrouped,

  /**
   * 100% stacked vertical bars, one band per location or tag.
   *
   * Appended, never inserted: the value is persisted as a plain int on
   * DashboardItem.ChartType, so renumbering would reclassify every dashboard
   * item already saved. Must stay in step with DashboardChartTypes in
   * Microting.InsightDashboardBase, where it is 12.
   */
  VerticalBarStackedNormalizedGrouped
}
