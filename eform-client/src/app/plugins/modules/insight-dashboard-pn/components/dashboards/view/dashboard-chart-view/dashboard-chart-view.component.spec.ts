import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {of} from 'rxjs';
import {Store} from '@ngrx/store';
import {DashboardChartViewComponent} from './dashboard-chart-view.component';
import {DashboardChartTypesEnum} from '../../../../const/enums';

@Pipe({name: 'translate', standalone: false})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DashboardChartViewComponent', () => {
  let component: DashboardChartViewComponent;
  let fixture: ComponentFixture<DashboardChartViewComponent>;

  const band = (name: string, periods: string[], answers: string[]) => ({
    name,
    series: periods.map((period) => ({
      name: period,
      series: answers.map((answer) => ({name: answer, value: 25})),
    })),
  });

  const setUp = (multiStacked: any[]) => {
    component.chartPosition = 1;
    component.itemModel = {
      position: 1,
      firstQuestionName: 'Har du et godt samarbejde?',
      chartType: DashboardChartTypesEnum.VerticalBarStackedNormalizedGrouped,
      chartData: {multiStacked},
    } as any;
    component.ngOnChanges({itemModel: {} as any});
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardChartViewComponent, MockTranslatePipe],
      providers: [{provide: Store, useValue: {select: () => of(false)}}],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setUp([band('Nord', ['20_2H'], ['Glad'])]);
    expect(component).toBeTruthy();
  });

  describe('bandLabel', () => {
    it('names the band and the periods it spans', () => {
      const nord = band('Nord', ['20_2H', '21_1H', '22_2H'], ['Glad']);
      expect(component.bandLabel(nord)).toBe('Nord (20_2H–22_2H)');
    });

    it('does not repeat a single period', () => {
      expect(component.bandLabel(band('Nord', ['20_2H'], ['Glad']))).toBe(
        'Nord (20_2H)'
      );
    });

    it('falls back to the bare name when the band has no periods', () => {
      expect(component.bandLabel({name: 'Nord', series: []})).toBe('Nord');
      expect(component.bandLabel({name: 'Nord'})).toBe('Nord');
    });
  });

  describe('legendEntries', () => {
    it('carries every category once, in first-seen order', () => {
      setUp([
        band('Nord', ['20_2H'], ['Meget glad', 'Glad']),
        band('Vest', ['20_2H'], ['Glad', 'Neutral']),
      ]);

      expect(component.legendEntries.map((e) => e.name)).toEqual([
        'Meget glad',
        'Glad',
        'Neutral',
      ]);
    });

    it('takes the union across bands, not just the first band', () => {
      // A category can be absent from one band and present in another; a legend
      // built from one band would silently omit it.
      setUp([
        band('Nord', ['20_2H'], ['Glad']),
        band('Vest', ['20_2H'], ['Sur']),
      ]);

      expect(component.legendEntries.map((e) => e.name)).toEqual(['Glad', 'Sur']);
    });

    it('uses the fixed answer colours', () => {
      setUp([band('Nord', ['20_2H'], ['Meget glad', 'Ved ikke'])]);

      expect(component.legendEntries).toEqual([
        {name: 'Meget glad', value: '#007E33'},
        {name: 'Ved ikke', value: '#0099CC'},
      ]);
    });

    it('falls back to the scheme for a category with no fixed colour', () => {
      setUp([band('Nord', ['20_2H'], ['Ja'])]);

      expect(component.legendEntries[0].name).toBe('Ja');
      expect(component.legendEntries[0].value).toBe(component.colorScheme.domain[0]);
    });

    it('is empty when the item carries no chart data', () => {
      component.itemModel = {position: 1} as any;
      component.ngOnChanges({itemModel: {} as any});
      expect(component.legendEntries).toEqual([]);
    });

    it('excludes answer values the item ignores, by only reading the data', () => {
      // Ignored values never reach chartData, so nothing extra is needed - this
      // pins that the legend is derived from the data rather than customColors.
      setUp([band('Nord', ['20_2H'], ['Glad'])]);

      expect(component.legendEntries.length).toBe(1);
      expect(component.legendEntries.map((e) => e.name)).not.toContain('Sur');
    });
  });
});
