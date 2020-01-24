import {DashboardChartTypesEnum} from '../const/enums';
import * as SvgSaver from 'svgsaver';

export function convertInlineStyleSVG(svgDocument: any, nodeIndex: number, chartType: DashboardChartTypesEnum) {
  const svg = svgDocument.getElementsByClassName('ngx-charts')[nodeIndex]
    .childNodes[0].childNodes[0].firstChild;

  if (svg) {
    const allTextElements = svg.querySelectorAll('text');
    for (let i = allTextElements.length - 1; i >= 0; --i) {
      allTextElements[i].style.fontFamily = 'Roboto,sans-serif';
    }
    const svgSaver = new SvgSaver();
    const clonedSVG = svgSaver.cloneSVG(svg);
    svg.parentNode.replaceChild(clonedSVG, svg);
  }
}
