 FrontEnd Angular Project - Formularios Avanzados

Live site (GitHub Pages): https://officialaaronvelez.github.io/angular-photo-gallery/

Repository: https://github.com/OfficialAaronVelez/angular-photo-gallery


 Quick start

"""bash
npm install
ng serve
"""

Open [http://localhost:4200](http://localhost:4200).

- Build: "ng build"
- Tests: "ng test"



What’s in this project!!

Routes ("src/app/app.routes.ts")

Path        | Description                                      
 "/"        | Redirects to "/page-1"                          
"/page-1"   "/page-4" | Simple demo pages ("src/app/pages/…")   
"/galeria"  | Gallery demo ("src/app/gallery/")                
"/registro" | Advanced reactive registration form (below) 


Registration form — “Formularios avanzados” ("/registro")

Bank-style user registration with real-time validation, friendly errors, and a simulated API submit.

Code:

- "src/app/registro/registro.component.ts" — "FormGroup", controls, "FormArray" for optional phone rows, submit + reset after success ("setTimeout" simulates the API).
- "src/app/registro/registro.component.html" — fields, messages using touched/dirty via "interacted()", submit disabled when "invalid", "pending", or submitting.
- "src/app/registro/registro.component.css" — layout for the form.
- "src/app/registro/registro-validators.ts" — sync validators (password match on the group, minimum age, optional phone format) and async email check (simulated “email already registered” with a short delay).

Fields: nombre, email, contraseña, confirmación, edad, términos, plus optional teléfonos (FormArray with add/remove).

Concepts shown: ReactiveForms ("FormGroup" / "FormControl" / "FormArray"), custom validators, async validator on email ("updateOn: 'blur'"), UX guard on submit, reset after successful simulated POST.

 Presentation card ("TarjetaComponent")

Reusable card with "@Input" for name and age, and a local “likes” counter on click.

- "src/app/tarjeta/tarjeta.component."
- Used from "app.component.html" as "<app-tarjeta [nombre]="…" [edad]="…">".

Gallery

- "src/app/gallery/" — gallery feature linked from the nav as Galería.

Prerequisites

- Node.js (LTS recommended; odd major versions may show CLI warnings)
- Angular CLI (global optional): "npm install -g @angular/cli"
