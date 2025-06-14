import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CardsSliderComponent } from '../../components/cards-slider/cards-slider.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, CardsSliderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styles: ``
})
export class MainComponent {

}