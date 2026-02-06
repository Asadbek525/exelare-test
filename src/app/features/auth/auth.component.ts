import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { catchError, debounceTime, distinctUntilChanged, lastValueFrom, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { AuthStore } from '../../core/store/auth.store';
import { ErrorsStoreService } from '../../core/services/errors-store.service';
import { AuthRequest } from '../../core/dto/rest-user';
import { PermissionsHelper } from '../../core/permissions-helper';
import { Method } from '../../shared/dto/items';
import { MiscService } from '../../shared/services/misc.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    CardModule,
    NgOptimizedImage,
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private errorStore = inject(ErrorsStoreService);
  private miscSvc = inject(MiscService);

  loginForm: FormGroup;
  isLoading = signal(false);
  protected readonly logoSrc = signal('assets/images/img.png');
  extraLogo = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      companyID: ['', Validators.required],
      userID: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Handle Company ID changes for Logo
    this.loginForm.controls['companyID'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(() => {
          const url = this.generateLogoLink();
          if (!url) return of('Error');

          return this.miscSvc
            .customExecuteRequestObs({
              method: Method.GET,
              headers: { 'Content-Type': 'image/*', Accept: 'image/*' },
              wantRaw: true,
              url: url,
            })
            .pipe(catchError(() => of('Error')));
        }),
        takeUntilDestroyed(),
      )
      .subscribe((val) => {
        if (val && val !== 'Error') {
          this.extraLogo.set(true);
          this.logoSrc.set('data:image/jpeg;base64,' + val);
        } else {
          this.extraLogo.set(false);
          this.logoSrc.set('assets/exelare.png');
        }
      });

    // Check the logout message
    effect(() => {
      const msg = this.authStore.logoutMessage();
      if (msg) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: msg,
          key: 'auth-toast',
          sticky: true,
        });
        this.authStore.setLogoutMessage(undefined);
      }
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      try {
        const formVal = this.loginForm.value;
        const authData: AuthRequest = {
          companyID: formVal.companyID,
          userID: formVal.userID,
          password: formVal.password,
          authToken: undefined,
          relogin: false,
        };

        const user = await lastValueFrom(this.authService.login(authData));

        if (user.errors && user.errors.length > 0) {
          this.errorStore.setLoginErrors(environment.buildUrl('api/login'), user.errors);
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid credentials or server error',
            key: 'auth-toast',
          });
          this.isLoading.set(false);
          return;
        }

        this.authStore.setUser(user);

        PermissionsHelper.getPermissionObj(user.permissionsXml).subscribe((perms) => {
          this.authStore.setPermissions(perms);
        });

        this.authStore.updExpDate(
          this.authStore.generateNewExpireDate(user.request.sessionTimeoutMins),
        );

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/candidates';
        await this.router.navigate([returnUrl]);
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Login Failed',
            key: 'auth-toast',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Login Failed',
          });
        }
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private generateLogoLink(): string | undefined {
    try {
      let logoName = this.loginForm.value.companyID;
      if (!logoName) return undefined;

      const _Pos = logoName.indexOf('_');
      if (_Pos > -1) {
        const prefix = logoName.substring(0, _Pos);
        if (['cbiz', 'exl', 'exlweb'].includes(prefix.toLowerCase())) {
          logoName = logoName.slice(_Pos + 1);
        }
      }

      return `https://cbizsoft.com/DOWNLOAD/files/logo/${logoName}_Logo.png`;
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }
}
