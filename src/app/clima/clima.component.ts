import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgFor, NgIf, DatePipe, TitleCasePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { WeatherService, CityResult, CurrentWeather, ForecastDay } from './weather.service';

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DatePipe, TitleCasePipe, DecimalPipe],
  templateUrl: './clima.component.html',
  styleUrls: ['./clima.component.css'],
})
export class ClimaComponent {
  private readonly weather = inject(WeatherService);
  /** NO SUPE ENTENDI ESTO PORQUE SE USA, PERO LO DEJARE ASI DESPUES DE VER UNOS STACK OVERFLOW POSTS */
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);

  private refresh(): void {
    this.cdr.detectChanges();
  }

  query = '';
  loading = false;
  error = '';

  candidates: CityResult[] = [];
  currentWeather: CurrentWeather | null = null;
  forecast: ForecastDay[] = [];

  buscar(): void {
    const q = this.query.trim();
    this.error = '';
    this.currentWeather = null;
    this.forecast = [];
    this.candidates = [];

    if (q.length < 2) {
      this.error = 'Escribe al menos 2 caracteres.';
      return;
    }

    this.loading = true;
    this.weather.searchCities(q).subscribe({
      next: (cities) => {
        this.zone.run(() => {
          if (cities.length === 0) {
            this.loading = false;
            this.error = 'No se encontró esa ciudad.';
            this.refresh();
            return;
          }
          if (cities.length === 1) {
            this.cargarClima(cities[0]);
            return;
          }
          this.candidates = cities;
          this.loading = false;
          this.refresh();
        });
      },
      error: (e: Error) => {
        this.zone.run(() => {
          this.loading = false;
          this.error = e?.message ?? 'Error al buscar.';
          this.refresh();
        });
      },
    });
  }

  elegirCiudad(city: CityResult): void {
    this.candidates = [];
    this.cargarClima(city);
  }

  private cargarClima(city: CityResult): void {
    this.loading = true;
    this.error = '';
    this.query = city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;

    this.weather
      .fetchWeather(city.lat, city.lon)
      .pipe(
        finalize(() =>
          this.zone.run(() => {
            this.loading = false;
            this.refresh();
          })
        )
      )
      .subscribe({
        next: ({ current, forecast }) => {
          this.zone.run(() => {
            this.currentWeather = current;
            this.forecast = forecast;
            this.loading = false;
            this.refresh();
          });
        },
        error: (e: Error) => {
          this.zone.run(() => {
            this.error = e?.message ?? 'Error desconocido.';
            this.refresh();
          });
        },
      });
  }

  iconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
