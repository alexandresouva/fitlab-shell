import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../theme/theme.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let themeService: ThemeService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand title FitLab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain(
      'FitLab'
    );
  });

  it('should emit toggleSidebar when hamburger button is clicked', () => {
    spyOn(component.toggleSidebar, 'emit');
    component.onToggleSidebar();
    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });

  it('should toggle theme when theme button is clicked', () => {
    spyOn(themeService, 'toggleTheme');
    component.onToggleTheme();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should render current user name and avatar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-name')?.textContent).toContain(
      authService.currentUser().name
    );
    expect(compiled.querySelector('.user-avatar')).toBeTruthy();
  });
});
