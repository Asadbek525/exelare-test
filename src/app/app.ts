import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ProgressBar } from 'primeng/progressbar';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialog, ProgressBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private loadingService = inject(LoadingService);
  loading = this.loadingService.loading;
}
