import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICertificate } from '@app/shared/interfaces';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-certificate-view',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './certificate-view.component.html',
  styleUrl: './certificate-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateViewComponent {
  @Input({ required: true }) certificate!: ICertificate;
}
