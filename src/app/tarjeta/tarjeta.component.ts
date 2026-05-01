import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent {
  @Input() nombre = 'Invitado';
  @Input() edad = 0;

  likes = 0;

  sumarLike(): void {
    this.likes++;
  }
}
