import {
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-answer-delete-modal',
  templateUrl: './answer-delete-modal.component.html',
  styleUrls: ['./answer-delete-modal.component.scss'],
})
export class AnswerDeleteModalComponent implements OnInit {
  deleteAnswer: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<AnswerDeleteModalComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  hide() {
    this.dialogRef.close();
  }

  delete() {
    this.deleteAnswer.emit();
  }
}
