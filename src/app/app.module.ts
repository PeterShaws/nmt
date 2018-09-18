import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InMemoryDataService } from './services/in-memory-data.service';
import { TranslatorComponent } from './components/translator/translator.component';
import { CoordinatesComponent } from './components/coordinates/coordinates.component';
import { GalacticAddressDirective } from './directives/galactic-address.directive';
import { PortalAddressDirective } from './directives/portal-address.directive';
import { PlanetDestinationDirective } from './directives/planet-destination.directive';

@NgModule({
  declarations: [
    AppComponent,
    TranslatorComponent,
    CoordinatesComponent,
    GalacticAddressDirective,
    PortalAddressDirective,
    PlanetDestinationDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
