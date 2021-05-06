import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { AnswerModel } from '../models/answer';
import { ApiBaseService } from 'src/app/common/services';

const DashboardAnswersMethods = {
  Answers: 'api/insight-dashboard-pn/answers',
};

@Injectable()
export class InsightDashboardPnAnswersService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAnswer(
    microtingUUID: number
  ): Observable<OperationDataResult<AnswerModel>> {
    return this.apiBaseService.get(
      DashboardAnswersMethods.Answers + '/' + microtingUUID
    );
  }

  deleteAnswer(microtingUUID: number): Observable<any> {
    return this.apiBaseService.delete(
      DashboardAnswersMethods.Answers + '/' + microtingUUID
    );
  }
}
