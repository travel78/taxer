import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToasterService } from '@app/shared/services/toaster.service';
import { AsyncPipe } from '@angular/common';
import { IToast, ToastType } from '@app/shared/interfaces';
import { concat, delay, merge, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToasterComponent {
  readonly toasterSer = inject(ToasterService);
  readonly toasts$: Observable<IToast | null> = this.toasterSer.toasts$.pipe(
    switchMap((res) => {
      return concat(of(res), of(null).pipe(delay(1500)));
    })
  );
  readonly toastType = ToastType;
}
