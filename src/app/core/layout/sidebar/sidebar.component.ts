import {
  Component,
  input,
  output,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly isOpen = input<boolean>(false);
  readonly navigate = output<void>();

  readonly navItems: NavItem[] = [
    {
      label: 'Início',
      route: '/',
      icon: '🏠',
      exact: true
    },
    {
      label: 'Treinos',
      route: '/workouts',
      icon: '🏋️‍♂️'
    },
    {
      label: 'Nutrição',
      route: '/nutrition',
      icon: '🥗'
    },
    {
      label: 'Timer',
      route: '/timer',
      icon: '⏱️'
    },
    {
      label: 'Fichas',
      route: '/card-generator',
      icon: '📇'
    }
  ];

  onNavClick(): void {
    this.navigate.emit();
  }
}
