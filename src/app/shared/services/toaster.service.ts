import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IToast, ToastType } from '@app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private subject = new Subject<IToast>();

  readonly toasts$ = this.subject.asObservable();

  show(message: string, type: ToastType = ToastType.Success) {
    this.subject.next({ type, message });
  }
}
