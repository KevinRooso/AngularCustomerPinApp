import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PinsListComponent } from './views/pins-list/pins-list.component';
import { HeaderComponent } from './views/header/header.component';
import { AddCustomerComponent } from './views/add-customer/add-customer.component';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { HttpClientModule } from '@angular/common/http';
import { AddPinComponent } from './views/add-pin/add-pin.component';
import { FileUploadModule } from 'ng2-file-upload';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ToastrModule } from 'ngx-toastr';


const dbConfig: DBConfig  = {
  name: 'myDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'pins',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'imageFileObj', keypath: 'imageFileObj', options: { unique: false } },
        { name: 'customers', keypath: 'customers', options: { unique: false } },
        { name: 'privacy', keypath: 'privacy', options: { unique: false } }
      ]
    }
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    PinsListComponent,
    HeaderComponent,
    AddCustomerComponent,
    AddPinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxSelectModule,
    HttpClientModule,
    FileUploadModule,
    ToastrModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
