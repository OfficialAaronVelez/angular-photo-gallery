import { Component } from '@angular/core';

@Component({
  selector: 'app-saludo',
  standalone: true,
  templateUrl: './salud.html'
})
export class SaludoComponent {
  mensaje = 'Hola desde Angular';
}