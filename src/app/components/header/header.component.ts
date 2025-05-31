import { Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import { animate } from 'motion'

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  host: {
    '(mouseenter)': 'hover.set(true)',
    '(mouseleave)': 'hover.set(false)',
  }
})
export class HeaderComponent {

  navbar = viewChild.required<ElementRef>('navbar');
  navbarVisible = signal(true);
  hover = signal(false)
  private lastScrollY = 0; // Guarda la posición anterior

  ngOnInit() {
    window.addEventListener('scroll', () => {
      const position = window.scrollY;
      const velocity = position - this.lastScrollY; // Diferencia entre actual y anterior
      this.lastScrollY = position; // Actualiza para el siguiente evento
      if (Math.abs(velocity) > 50){
        if (position < 500 || velocity < 0) {
          this.navbarVisible.set(true);
        } else {
          this.navbarVisible.set(false);
        }
      }
    });
  }

  animateNav = effect(()=>{
    if(this.navbarVisible() || this.hover()){
      animate(this.navbar().nativeElement, { y: '0%' }, { duration: 0.2 });
    } else {
      animate(this.navbar().nativeElement, { y: '-90%' }, { duration: 0.2 });
    }
  })
}
