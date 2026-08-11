import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should list all 4 FitLab MFE modules', () => {
    expect(component.mfeModules).toHaveSize(4);
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.module-card');
    expect(cards).toHaveSize(4);
  });

  it('should render correct titles for modules', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Planejador de Treinos');
    expect(compiled.textContent).toContain('Nutrição & Dietas');
    expect(compiled.textContent).toContain('Timer de Intervalos');
    expect(compiled.textContent).toContain('Gerador de Fichas');
  });
});
