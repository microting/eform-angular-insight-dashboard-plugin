import {
  Component,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-answer-delete-modal',
  templateUrl: './answer-delete-modal.component.html',
  styleUrls: ['./answer-delete-modal.component.scss'],
})
export class AnswerDeleteModalComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<AnswerDeleteModalComponent>);

  deleteAnswer: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
  }

  hide() {
    this.dialogRef.close();
  }

  delete() {
    this.deleteAnswer.emit();
  }
}
