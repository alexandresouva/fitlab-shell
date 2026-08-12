import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar state', () => {
    expect(component.isSidebarOpen()).toBeFalse();

    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBeTrue();

    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBeFalse();
  });

  it('should close sidebar when closeSidebar is called', () => {
    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBeTrue();

    component.closeSidebar();
    expect(component.isSidebarOpen()).toBeFalse();
  });

  it('should render header and sidebar in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render backdrop when sidebar is open', () => {
    component.toggleSidebar();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const backdrop = compiled.querySelector('.sidebar-backdrop') as HTMLElement;
    expect(backdrop).toBeTruthy();

    backdrop.click();
    expect(component.isSidebarOpen()).toBeFalse();
  });
});
