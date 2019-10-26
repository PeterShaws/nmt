import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinatesComponent } from '@components/coordinates/coordinates.component';
import { TranslatorComponent } from '@components/translator/translator.component';

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
