export interface IToast {
  message: string;
  type: ToastType;
}

export enum ToastType {
  Success = 0,
  Error = 1
}
