import { Injectable } from '@angular/core';
import { EmptyError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { ICertificate } from '@app/shared/interfaces';
import ASN1 from 'lapo__asn1js';

declare const ASN: ASN1;


@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  parseFile(file: File): Observable<ICertificate> {
    // console.log(ASN)
    return from(file.arrayBuffer()).pipe(
      switchMap((buff) => {
          try {
            const certificate = new Uint8Array(buff);
            // @ts-ignore
            const tbs: ASN1 = ASN.decode(certificate).sub[0];
            if (tbs && tbs.sub) {
              const issuer = tbs.sub[3];
              const subject = tbs.sub[5];
              const validity = tbs.sub[4];
              const validFrom = validity.sub && validity.sub[0].content();
              const validTo = validity.sub && validity.sub[1].content();

              const issuerName = this.findName(issuer, 'commonName');
              const subjectName = this.findName(subject, 'commonName');

              return of<ICertificate>({ subjectName, issuerName, validFrom, validTo, certificate } );
            } else return throwError(() => EmptyError);
          } catch {
            return throwError(() => EmptyError);
          }
        }
      )
    );
  }

  private findName(asn: ASN1, name: string): string | null {
    let res: null | string = null;
    const func = (dd: ASN1) => {
      if (dd.sub) {
        for (let i = 0; i < dd.sub.length; i++) {
          if (!dd.sub[i].sub && dd.sub[i].content()?.includes(name)) {
            res = dd.sub[i + 1] && dd.sub[i + 1].content();
            break;
          } else {
            func(dd.sub[i]);
          }
        }
      }
    };
    func(asn);

    return res;
  }
}
