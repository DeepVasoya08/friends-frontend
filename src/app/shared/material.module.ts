import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

const modules: any[] = [
  MatCardModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatIconModule,
  MatBadgeModule,
  MatMenuModule,
  MatTooltipModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...modules],
  exports: [...modules],
})
export class MaterialModule {}
