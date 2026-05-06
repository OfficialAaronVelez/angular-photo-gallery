import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';

/** API KEY GRATUITA POR ESO ESTA HARDCODED */
const API_KEY = '3532a9ff961567444c5cdc2f3cc89d04';
const BASE = 'https://api.openweathermap.org';
const REQ_MS = 25000;

export interface CityResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  name: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  dt: number;
}

export interface ForecastDay {
  date: Date;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  searchCities(query: string): Observable<CityResult[]> {
    const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    return this.http.get<any[]>(url).pipe(
      timeout(REQ_MS),
      map((rows) =>
        (rows ?? []).map((r) => ({
          name: r.name,
          country: r.country,
          state: r.state,
          lat: r.lat,
          lon: r.lon,
        }))
      ),
      catchError((err) => throwError(() => this.toMessage(err)))
    );
  }

  
  fetchWeather(lat: number, lon: number): Observable<{ current: CurrentWeather; forecast: ForecastDay[] }> {
    const common = `lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
    const currentUrl = `${BASE}/data/2.5/weather?${common}`;
    const forecastUrl = `${BASE}/data/2.5/forecast?${common}&cnt=40`;

    return this.http.get<any>(currentUrl).pipe(
      timeout(REQ_MS),
      map((d) => this.mapCurrent(d)),
      switchMap((current) =>
        this.http.get<any>(forecastUrl).pipe(
          timeout(REQ_MS),
          map((d) => ({
            current,
            forecast: this.forecastByDay(d?.list ?? []),
          })),
          catchError(() => of({ current, forecast: [] as ForecastDay[] }))
        )
      ),
      catchError((err) => throwError(() => this.toMessage(err)))
    );
  }

  private mapCurrent(d: any): CurrentWeather {
    return {
      name: d.name,
      country: d.sys?.country ?? '',
      temp: d.main.temp,
      feelsLike: d.main.feels_like,
      humidity: d.main.humidity,
      description: d.weather?.[0]?.description ?? '',
      icon: d.weather?.[0]?.icon ?? '',
      windSpeed: d.wind?.speed ?? 0,
      dt: d.dt,
    };
  }

  private forecastByDay(list: any[]): ForecastDay[] {
    const byDate = new Map<string, { min: number; max: number; icon: string; desc: string; hum: number[] }>();

    for (const item of list) {
      const w = item.weather?.[0];
      if (!w || item.main == null) continue;

      const key = new Date(item.dt * 1000).toISOString().slice(0, 10);
      const m = item.main;
      let g = byDate.get(key);
      if (!g) {
        g = {
          min: m.temp_min,
          max: m.temp_max,
          icon: w.icon ?? '',
          desc: w.description ?? '',
          hum: [m.humidity],
        };
        byDate.set(key, g);
      } else {
        g.min = Math.min(g.min, m.temp_min);
        g.max = Math.max(g.max, m.temp_max);
        g.hum.push(m.humidity);
      }
    }

    const days: ForecastDay[] = [];
    for (const [dateKey, g] of byDate) {
      if (days.length >= 5) break;
      days.push({
        date: new Date(dateKey + 'T12:00:00'),
        tempMin: g.min,
        tempMax: g.max,
        description: g.desc,
        icon: g.icon,
        humidity: Math.round(g.hum.reduce((a, b) => a + b, 0) / g.hum.length),
      });
    }
    return days;
  }

  private toMessage(err: any): Error {
    if (err?.name === 'TimeoutError') {
      return new Error('La petición tardó demasiado. Revisa tu conexión e intenta de nuevo.');
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return new Error('Sin conexión. Revisa tu red.');
    }
    if (err?.status === 401) return new Error('Clave de API inválida.');
    if (err?.status === 404) return new Error('No se encontraron datos.');
    if (err?.status === 429) return new Error('Demasiadas peticiones. Prueba más tarde.');
    return new Error('No se pudo obtener el clima.');
  }
}
