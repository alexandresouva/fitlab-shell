import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-mfe-error-fallback',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mfe-error-fallback.component.html',
  styleUrl: './mfe-error-fallback.component.scss'
})
export class MfeErrorFallbackComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly moduleName: string =
    this.route.snapshot.data['moduleName'] ?? 'Módulo Remoto';
  readonly moduleKey: string =
    this.route.snapshot.data['moduleKey'] ?? 'desconhecido';

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  retryModuleLoading(): void {
    this.router.navigateByUrl(this.router.url, {
      onSameUrlNavigation: 'reload'
    });
  }
}
