import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  RefreshCw,
  AlertTriangle,
} from 'lucide-angular';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './server-error.component.html',
})
export class ServerErrorComponent {
  readonly Home = Home;
  readonly RefreshCw = RefreshCw;
  readonly AlertTriangle = AlertTriangle;

  reload() {
    window.location.reload();
  }
}
