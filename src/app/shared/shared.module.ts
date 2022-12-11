import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/modules/material.module';
import { SanitizeHTMLPipe } from '@shared/pipes/sanitize-html.pipe';

@NgModule({
  declarations: [
    SanitizeHTMLPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    SanitizeHTMLPipe
  ]
})

export class SharedModule { }
