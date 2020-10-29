import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { Config } from 'src/app/models/app-data';

@Component({
  selector: 'app-basic-menu-view',
  templateUrl: './view.component.html',
})
export class BasicMenuViewComponent implements OnInit {
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
    this.http.get(`${conf.api_url}${conf.api_path.menuById}/${this.record.id}`).subscribe(res => (this.i = res));
  }

  close() {
    this.drawer.close();
  }
}
