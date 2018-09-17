import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TranslatorComponent } from './translator/translator.component';
import { CoordinatesComponent } from 'src/app/coordinates/coordinates.component';

const routes: Routes = [
  { path: '', redirectTo: '/translator', pathMatch: 'full' },
  { path: 'translator', component: TranslatorComponent },
  { path: 'coordinates', component: CoordinatesComponent },
  { path: 'ships', redirectTo: '/translator' },
  { path: 'exploration', redirectTo: '/translator' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
