import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-modal',
  imports: [],
  templateUrl: './pdf-modal.component.html',
  styleUrl: './pdf-modal.component.scss',
})
export class PdfModalComponent {
  safeUrl!: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PdfModalComponent>,
    private sanitizer: DomSanitizer
  ) {
    this.setPdfUrl(data.pdfUrl);
  }

  setPdfUrl(url: string) {
    const cleanUrl = url.replace(/\/v\d+\//, '/');
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(cleanUrl);
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
