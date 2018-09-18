import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TranslatorComponent } from './components/translator/translator.component';
import { CoordinatesComponent } from './components/coordinates/coordinates.component';

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
