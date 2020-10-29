import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService } from '@delon/auth';
import { MenuService, SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Config } from '../../../models/app-data';
import { LoginReq } from '../../../models/basic';
@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    private menuService: MenuService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, ]],
      password: [null, [Validators.required, ]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      mobileCaptcha: [null, [Validators.required]],
      emailCaptcha: [null, [Validators.required]],
      email: [null, [Validators.required]],
      remember: [true],
    });
  }

  // #region fields

  get userName(): AbstractControl {
    return this.form.controls.userName;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  get mobile(): AbstractControl {
    return this.form.controls.mobile;
  }
  get email(): AbstractControl {
    return this.form.controls.email;
  }
  get emailCaptcha(): AbstractControl {
    return this.form.controls.emailCaptcha;
  }
  get mobileCaptcha(): AbstractControl {
    return this.form.controls.mobileCaptcha;
  }
  form: FormGroup;
  loginReq: LoginReq;
  error = '';
  type = 0;

  // #region get captcha

  count = 0;
  interval$: any;
  switch({ index }: { index: number }): void {
    this.type = index;
  }

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  submit(): void {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
      this.loginReq = {
        type: this.type,
        user_name_or_phone_or_email: this.userName.value,
        user_password_or_code: this.password.value
      };
    } else if (this.type === 1) {// 电话登录
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.mobileCaptcha.markAsDirty();
      this.mobileCaptcha.updateValueAndValidity();
      if (this.mobile.invalid || this.mobileCaptcha.invalid) {
        return;
      }
      this.loginReq = {
        type: this.type,
        user_name_or_phone_or_email: this.mobile.value,
        user_password_or_code: this.mobileCaptcha.value
      };
    } else {
      this.email.markAsDirty();
      this.email.updateValueAndValidity();
      this.emailCaptcha.markAsDirty();
      this.emailCaptcha.updateValueAndValidity();
      if (this.email.invalid || this.emailCaptcha.invalid) {
        return;
      }
      this.loginReq = {
        type: this.type,
        user_name_or_phone_or_email: this.email.value,
        user_password_or_code: this.emailCaptcha.value
      };
    }
    const conf: Config = this.settingsService.getData('config');
    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.http
      .post(conf.api_url + conf.api_path.login + '?_allow_anonymous=true', this.loginReq)
      .subscribe((res) => {
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置用户Token信息
        // res.result.token.expired = +new Date() + 1000 * 60 * 5;
        this.settingsService.setUser({
            name: res.user.user_name,
            avatar: conf.img_url + res.user.icon.name,
            email: res.user.user_email,
        });
        if (res.user.menus === undefined) {
          this.error = '请联系管理员配置相关权限';
          return ;
        }
       // this.menuService.add(res.user.menus);
        this.tokenService.set(res.token);
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().then(() => {
          let url = this.tokenService.referrer!.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        });
      });
  }

  // #region social

  open(type: string, openType: SocialOpenType = 'href'): void {
    let url = ``;
    let callback = ``;
    // tslint:disable-next-line: prefer-conditional-expression
    if (environment.production) {
      callback = 'https://ng-alain.github.io/ng-alain/#/callback/' + type;
    } else {
      callback = 'http://localhost:4200/#/callback/' + type;
    }
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe((res) => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
