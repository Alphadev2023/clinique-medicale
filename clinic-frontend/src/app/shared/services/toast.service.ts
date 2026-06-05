import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  success(message: string) {
    this.add(message, 'success');
  }
  error(message: string) {
    this.add(message, 'error');
  }
  info(message: string) {
    this.add(message, 'info');
  }
  warning(message: string) {
    this.add(message, 'warning');
  }

  private add(message: string, type: Toast['type']) {
    const id = Date.now().toString();
    this.toasts.update((t) => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: string) {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
