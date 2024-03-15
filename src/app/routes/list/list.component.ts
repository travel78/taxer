import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CertificateApiService } from '@app/shared/services';
import { ICertificate } from '@app/shared/interfaces';
import { CertificateViewComponent } from '@app/modules/certificate-view';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, finalize, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CertificateViewComponent,
    AsyncPipe,
    RouterLink,
    NgIf
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  host: { 'class': 'flex gap' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  readonly selectedCertificate = signal<ICertificate | null>(null);
  readonly certificateSer = inject(CertificateApiService);
  readonly triggerGet = new BehaviorSubject(null);
  readonly triggerDelete = new Subject<void>();
  readonly deleteSer = this.triggerDelete.pipe(
    switchMap(() => {
      return this.certificateSer.deleteAll().pipe(
        tap(() => {
          this.triggerGet.next(null);
          this.selectedCertificate.set(null);
        })
      );
    })
  );
  readonly certificates$ = this.triggerGet.pipe(
    switchMap(this.certificateSer.getAll)
  );
  readonly certificates = toSignal(this.certificates$, { initialValue: [] });
}
