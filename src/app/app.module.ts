import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { PessoaComponent } from './pessoa/pessoa.component';
import { PessoaService } from './service/pessoa.service';
import { HttpClientModule } from '@angular/common/http';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';                 //api
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {GrowlModule} from 'primeng/growl';
import {MenuModule} from 'primeng/menu';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {InputMaskModule} from 'primeng/inputmask';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    PessoaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,    
    TableModule,
    AccordionModule,
    ButtonModule,
    DialogModule,
    BrowserAnimationsModule,
    GrowlModule,    
    MenuModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    InputMaskModule,
    FormsModule,
    HttpModule,
    DropdownModule
    
  ],
  providers: [PessoaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
