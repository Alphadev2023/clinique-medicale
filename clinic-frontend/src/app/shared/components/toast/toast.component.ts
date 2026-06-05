import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { slideInBottom } from '../../animations/animations';
import {
  LucideAngularModule,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  animations: [slideInBottom],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Info = Info;
  readonly AlertTriangle = AlertTriangle;
  readonly X = X;

  constructor(public toastService: ToastService) {}

  getIcon(type: string) {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  }

  getClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'border-l-4 border-green-500 bg-white';
      case 'error':
        return 'border-l-4 border-red-500 bg-white';
      case 'warning':
        return 'border-l-4 border-amber-500 bg-white';
      default:
        return 'border-l-4 border-blue-500 bg-white';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'success':
        return '#059669';
      case 'error':
        return '#dc2626';
      case 'warning':
        return '#d97706';
      default:
        return '#2563eb';
    }
  }
}
