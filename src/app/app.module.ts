import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { TranslatorComponent } from './translator/translator.component';
import { InMemoryDataService } from './in-memory-data.service';
import { AppRoutingModule } from './/app-routing.module';
import { CoordinatesComponent } from './coordinates/coordinates.component';

@NgModule({
  declarations: [
    AppComponent,
    TranslatorComponent,
    CoordinatesComponent
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
