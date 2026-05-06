 FrontEnd Angular Project — Galería, formularios y clima

Angular app with a photo gallery, an advanced reactive registration form, and a weather (“Clima — Proyecto final”) feature backed by the OpenWeatherMap API. Use the nav links Galería, Registro, and Clima Proyecto Final.

Live site (GitHub Pages): https://officialaaronvelez.github.io/angular-photo-gallery/

Repository: https://github.com/OfficialAaronVelez/angular-photo-gallery

Local development


npm install
npm start


Then open http://localhost:4200/ (npm start runs ng serve).

 Build


npm run build


Deploy (GitHub Pages)

GitHub Pages for this repo is served from the gh-pages branch. After local changes, publish the production build with the correct base href for the project URL:


npx ng deploy --base-href=/angular-photo-gallery/


 What’s in this project

 Routes (src/app/app.routes.ts)

| Path | Description |
|------|-------------|
| / | Redirects to /page-1 |
| /page-1 … /page-4 | Simple demo pages (src/app/pages/…) |
| /galeria | Gallery (src/app/gallery/) |
| /registro | Advanced registration form (below) |
| /clima | Weather search and forecast — “Clima Proyecto Final” (src/app/clima/) |

 Clima — Proyecto final (/clima)

City search, current conditions, and multi-day forecast using OpenWeatherMap over HttpClient.

- src/app/clima/weather.service.ts — geocoding lookup, current weather, and forecast mapping; calls api.openweathermap.org. The app id is configured in this file (in production, prefer environment variables and rotate the key if it was ever exposed).
- src/app/clima/clima.component.ts / .html / .css — standalone UI: search, pick a city from candidates, show conditions and forecast; uses DecimalPipe, DatePipe, TitleCasePipe, and Spanish-oriented UX copy.
- src/app/app.config.ts — provideHttpClient(withFetch()) for browser HTTP.
- src/main.ts — registerLocaleData for es so locale-aware pipes can use Spanish formatting.

Registration — “Formularios avanzados” (/registro)

Bank-style registration with validation, clear errors, and a simulated API submit.

- src/app/registro/registro.component.ts — FormGroup, controls, FormArray for optional phones, submit + reset after success (setTimeout simulates the API).
- src/app/registro/registro.component.html — fields and messages using touched/dirty via interacted(), submit disabled when invalid, pending, or submitting.
- src/app/registro/registro.component.css — layout.
- src/app/registro/registro-validators.ts — sync validators (password match, minimum age, optional phone format) and async email check.

Fields: nombre, email, contraseña, confirmación, edad, términos, plus optional teléfonos (FormArray with add/remove).

Concepts: ReactiveForms (FormGroup / FormControl / FormArray), custom validators, async validator on email (updateOn: 'blur'), UX guard on submit, reset after successful simulated POST.

 Presentation card (TarjetaComponent)

Reusable card with @Input for name and age and a local likes counter. See src/app/tarjeta/ and usage in app.component.html as <app-tarjeta …>.

 Gallery

src/app/gallery/ — linked from the nav as Galería.

 Prerequisites

- Node.js (LTS recommended; odd major versions may show CLI warnings)
- Angular CLI (optional global): npm install -g @angular/cli
