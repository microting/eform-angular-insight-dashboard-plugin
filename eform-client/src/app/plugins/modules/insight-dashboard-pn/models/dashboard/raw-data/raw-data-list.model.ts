import {RawDataColumnModel} from './raw-data-column.model';

export class RawDataListModel {
  total = 0;
  columns: RawDataColumnModel[] = [];
  // The key set is decided by the survey at runtime, so there is no useful static type.
  rows: any[] = [];
}
