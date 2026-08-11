import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';

import { MfeErrorFallbackComponent } from './mfe-error-fallback.component';

describe('MfeErrorFallbackComponent', () => {
  let component: MfeErrorFallbackComponent;
  let fixture: ComponentFixture<MfeErrorFallbackComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfeErrorFallbackComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                moduleName: 'Planejador de Treinos',
                moduleKey: 'workout-planner'
              }
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(MfeErrorFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render moduleName and moduleKey from route data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Planejador de Treinos'
    );
    expect(compiled.querySelector('code')?.textContent).toContain(
      'workout-planner'
    );
  });

  it('should render back to home link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backBtn = compiled.querySelector('.btn-back-home');
    expect(backBtn).toBeTruthy();
    expect(backBtn?.textContent).toContain('Voltar para o Início');
  });

  it('should navigate to home when goHome is called', () => {
    component.goHome();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should trigger module reload when retry button is clicked', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/workouts');
    component.retryModuleLoading();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/workouts', {
      onSameUrlNavigation: 'reload'
    });
  });

  it('should fallback to default texts when route data is empty', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [MfeErrorFallbackComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {}
            }
          }
        }
      ]
    }).compileComponents();

    const emptyFixture = TestBed.createComponent(MfeErrorFallbackComponent);
    const emptyComponent = emptyFixture.componentInstance;
    expect(emptyComponent.moduleName).toBe('Módulo Remoto');
    expect(emptyComponent.moduleKey).toBe('desconhecido');
  });
});
