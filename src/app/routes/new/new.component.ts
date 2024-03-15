import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ICertificate, ToastType } from '@app/shared/interfaces';
import { RouterLink } from '@angular/router';
import { CertificateViewComponent } from '@app/modules/certificate-view';
import { CertificateApiService, CertificateService } from '@app/shared/services';
import { ToasterService } from '@app/shared/services/toaster.service';


@Component({
  selector: 'app-new',
  standalone: true,
  imports: [
    RouterLink,
    CertificateViewComponent
  ],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss',
  host: { 'class': 'flex gap' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewComponent {
  readonly certificate = signal<ICertificate | null>(null);
  readonly dragOver = signal<boolean>(false);
  readonly certificateApiSer = inject(CertificateApiService);
  readonly certificateSer = inject(CertificateService);
  readonly toasterSer = inject(ToasterService);

  onSaveCertificate(certificate: ICertificate) {
    this.certificateApiSer.add(certificate)
      .subscribe({
        next: ()=>{
          {
            this.certificate.set(null);
            this.toasterSer.show('Файл збережено');
          }
        },
        error:()=>{
          this.toasterSer.show('Помилка при збереженні', ToastType.Error);
        }
      });
  }

  uploadFile(file: File | null | undefined) {
    if (file && (file.type.endsWith('cert'))) {
      this.certificateSer.parseFile(file).subscribe({
          next: (res) => {
            this.certificate.set(res);
          },
          error: () => {
            this.toasterSer.show('Не вірний тип файлу', ToastType.Error);
          }
        }
      );
    }else {
      this.toasterSer.show('Не вірний тип файлу', ToastType.Error);
    }
  }

  onSelectFile(input: HTMLInputElement) {
    const file: File | null | undefined = input.files?.item(0);
    input.value = '';
    this.uploadFile(file);
  }

  onDrop(event: DragEvent) {
    this.showOver(event, false);
    const { dataTransfer } = event;
    const file = Array.from(dataTransfer?.files ?? [])[0];
    this.uploadFile(file);
  }

  showOver(event: DragEvent, isOver: boolean) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(isOver);
  }
}
