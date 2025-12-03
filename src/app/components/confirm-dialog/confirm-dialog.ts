import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div style="text-align:center; margin-bottom:12px;">
        <mat-icon style="font-size:40px; color:#f44336;">warning</mat-icon>
      </div>
      <h2 style="text-align:center; margin:0 0 8px 0; color:#333;">{{ data.title }}</h2>
      <p style="text-align:center; color:#555; margin:0 0 20px 0;">{{ data.message }}</p>

      <div style="display:flex; justify-content:center; gap:12px;">
        <button mat-raised-button color="warn" (click)="onConfirm()">Excluir</button>
        <button mat-stroked-button (click)="onCancel()">Cancelar</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 18px 24px; width: 320px; }
    h2 { font-size: 18px; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void { this.dialogRef.close(true); }
  onCancel(): void { this.dialogRef.close(false); }
}
