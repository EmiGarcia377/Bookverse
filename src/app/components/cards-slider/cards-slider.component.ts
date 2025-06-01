import { Component } from '@angular/core';
import { animate, scroll } from 'motion'

@Component({
  selector: 'app-cards-slider',
  imports: [],
  templateUrl: './cards-slider.component.html',
  styleUrl: './cards-slider.component.css'
})
export class CardsSliderComponent {
  readonly container = document.querySelector('.img-group') as HTMLElement;
 ngAfterViewInit(){
  scroll(
    animate(".img-group", {
      transform: ["none", `translateX(-200vw)`],
    }),
    { target: document.querySelector("section") ?? undefined }
 );
 }
}
