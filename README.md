# FrontEnd Angular Project — Galería y formularios avanzados

Angular app for browsing photos and for the advanced reactive registration demo. To browse photos, open **Galería** in the nav.

**Live site (GitHub Pages):** https://officialaaronvelez.github.io/angular-photo-gallery/

**Repository:** https://github.com/OfficialAaronVelez/angular-photo-gallery

## Local development

```bash
npm install
npm start
```

Then open http://localhost:4200/ (`npm start` runs `ng serve`).

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```

## Deploy (GitHub Pages)

After configuring the `angular-cli-ghpages` setup for your repo base href:

```bash
ng deploy
```

## What’s in this project

### Routes (`src/app/app.routes.ts`)

| Path | Description |
|------|-------------|
| `/` | Redirects to `/page-1` |
| `/page-1` … `/page-4` | Simple demo pages (`src/app/pages/…`) |
| `/galeria` | Gallery (`src/app/gallery/`) |
| `/registro` | Advanced registration form (below) |

### Registration — “Formularios avanzados” (`/registro`)

Bank-style registration with validation, clear errors, and a simulated API submit.

- `src/app/registro/registro.component.ts` — `FormGroup`, controls, `FormArray` for optional phones, submit + reset after success (`setTimeout` simulates the API).
- `src/app/registro/registro.component.html` — fields and messages using touched/dirty via `interacted()`, submit disabled when invalid, pending, or submitting.
- `src/app/registro/registro.component.css` — layout.
- `src/app/registro/registro-validators.ts` — sync validators (password match, minimum age, optional phone format) and async email check.

**Fields:** nombre, email, contraseña, confirmación, edad, términos, plus optional teléfonos (`FormArray` with add/remove).

**Concepts:** ReactiveForms (`FormGroup` / `FormControl` / `FormArray`), custom validators, async validator on email (`updateOn: 'blur'`), UX guard on submit, reset after successful simulated POST.

### Presentation card (`TarjetaComponent`)

Reusable card with `@Input` for name and age and a local likes counter. See `src/app/tarjeta/` and usage in `app.component.html` as `<app-tarjeta …>`.

### Gallery

`src/app/gallery/` — linked from the nav as **Galería**.

## Prerequisites

- Node.js (LTS recommended; odd major versions may show CLI warnings)
- Angular CLI (optional global): `npm install -g @angular/cli`
