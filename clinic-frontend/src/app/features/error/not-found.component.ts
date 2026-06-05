import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Home, ArrowLeft, Search } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  readonly Home = Home;
  readonly ArrowLeft = ArrowLeft;
  readonly Search = Search;
}
