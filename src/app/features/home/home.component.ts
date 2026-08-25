import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface MfeCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  badge: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly isValidating = signal<boolean>(false);

  triggerValidation(): void {
    if (this.isValidating()) return;

    this.isValidating.set(true);
    setTimeout(() => this.isValidating.set(false), 2000);
  }

  readonly mfeModules: MfeCard[] = [
    {
      title: 'Planejador de Treinos',
      description:
        'Crie, gerencie e acompanhe rotinas de exercícios personalizadas.',
      route: '/workouts',
      icon: '🏋️‍♂️',
      badge: 'Treinos'
    },
    {
      title: 'Nutrição & Dietas',
      description:
        'Acompanhe macronutrientes, calorias diárias e planejamento de refeições.',
      route: '/nutrition',
      icon: '🥗',
      badge: 'Nutrição'
    },
    {
      title: 'Timer de Intervalos',
      description:
        'Cronômetro para treinos HIIT, Tabata e circuitos funcionais.',
      route: '/timer',
      icon: '⏱️',
      badge: 'Timer'
    },
    {
      title: 'Gerador de Fichas',
      description:
        'Gere fichas e cartões de treino em formato visual para impressão ou exportação.',
      route: '/card-generator',
      icon: '📇',
      badge: 'Fichas'
    }
  ];
}
