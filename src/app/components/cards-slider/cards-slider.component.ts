import { Component } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-cards-slider',
  imports: [SlickCarouselModule],
  templateUrl: './cards-slider.component.html',
  styleUrl: './cards-slider.component.css'
})
export class CardsSliderComponent {
 slides = [
  {img: 'ElPoderDelAhora.webp'},
  {img: 'ElPrincipe.webp'},
  {img: 'NoMePuedesLastimar.webp'}
 ];

 slideConfig = {
  slidesToShow: 3,
  slidesToScroll: 1,
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
 }
}
