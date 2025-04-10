export interface BaseModalOptions {
  id: string;
  title: string;
  busy?: boolean;
  cancelDisabled?: boolean;
  cancelTitle?: string;
  cancelVariant?: string;
  centered?: boolean;
  noCloseOnEsc?: boolean;
  okDisabled?: boolean;
  okOnly?: boolean;
  okTitle?: string;
  okVariant?: string;
  scrollable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  static?: boolean;
}

export interface BaseModalEmits {
  (event: 'cancel', e: Event): void;
  (event: 'change', s: boolean): void;
  (event: 'close', e: Event): void;
  (event: 'hide', e: Event): void;
  (event: 'hidden'): void;
  (event: 'ok', e: Event): void;
  (event: 'show', e: Event): void;
  (event: 'shown'): void;
}

export interface ConfirmModalOptions {
  cancelTitle?: string;
  cancelVariant?: string;
  okOnly?: boolean;
  okTitle?: string;
  okVariant?: string;
}
