export interface ICertificate {
  subjectName: string | null;
  issuerName: string | null;
  validFrom: string | null;
  validTo: string | null;
  certificate: Uint8Array;
}
