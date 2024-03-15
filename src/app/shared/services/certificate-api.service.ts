import { Injectable } from '@angular/core';
import { from, map, Observable, of, tap } from 'rxjs';
import { ICertificate } from '../interfaces';
import { del, get, set, update } from 'idb-keyval';

const STORAGE_NAME = 'list';

@Injectable({
  providedIn: 'root'
})
export class CertificateApiService {

  getAll(): Observable<ICertificate[]> {
    return from(get(STORAGE_NAME));
  }

  add(cer: ICertificate): Observable<void> {
    return from(update(STORAGE_NAME, (val) => {
      const arr = val || [];
      arr.push(cer);
      return arr;
    }));
  }

  deleteAll() {
    return from(del(STORAGE_NAME));
  }
}
