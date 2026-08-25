import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all navigation items', () => {
    expect(component.navItems).toHaveSize(5);
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('fitlab-nav-item');
    expect(links).toHaveSize(5);
  });

  it('should emit navigate when a nav link is clicked', () => {
    spyOn(component.navigate, 'emit');
    component.onNavClick();
    expect(component.navigate.emit).toHaveBeenCalled();
  });
});
