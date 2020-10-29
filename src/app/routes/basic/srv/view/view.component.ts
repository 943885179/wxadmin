import { Component, OnInit } from '@angular/core';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Config } from 'src/app/models/app-data';

@Component({
  selector: 'app-basic-srv-view',
  templateUrl: './view.component.html',
})
export class BasicSrvViewComponent implements OnInit {
  record: any = {};
  i: any;

  constructor(
    private drawer: NzDrawerRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    const conf: Config = this.settingsService.getData('config');
    this.http.get(`${conf.api_url}${conf.api_path.srvById}/${this.record.id}`).subscribe(res => (this.i = res));
  }

  close() {
    this.drawer.close();
  }
}
