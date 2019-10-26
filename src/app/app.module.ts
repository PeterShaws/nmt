import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CoordinatesComponent } from '@components/coordinates/coordinates.component';
import { TranslatorComponent } from '@components/translator/translator.component';
import { GalacticAddressDirective } from '@directives/galactic-address.directive';
import { PlanetDestinationDirective } from '@directives/planet-destination.directive';
import { PortalAddressDirective } from '@directives/portal-address.directive';
import { InMemoryDataService } from '@services/in-memory-data.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    TranslatorComponent,
    CoordinatesComponent,
    GalacticAddressDirective,
    PortalAddressDirective,
    PlanetDestinationDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
