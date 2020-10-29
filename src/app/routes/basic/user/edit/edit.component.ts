import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { format } from 'path';
import { Config } from 'src/app/models/app-data';

@Component({
  selector: 'app-basic-user-edit',
  templateUrl: './edit.component.html',
})
export class BasicUserEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: 'id', readOnly: true },
      user_name: { type: 'string', title: '姓名', maxLength: 15 },
      user_phone: { type: 'string', title: '电话', format: 'mobile'},
      user_email: {type: 'string', title: '邮箱', format: 'email'},
      id_card: {type: 'string', title: '身份证', format: 'id-card'}
      // href: { type: 'string', title: '链接', format: 'uri' },
    },
    required: ['id', 'user_name', 'user_phone', 'user_email'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id: {
      widget: 'text'
    },
    $user_name: {
      widget: 'string',
    },
    $user_phone: {
      widget: 'string',
    },
    $user_email: {
      widget: 'string',
    },
  };
  conf: Config;
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private settingsService: SettingsService
  ) {
     this.conf = this.settingsService.getData('config');
  }

  ngOnInit(): void {
    if (this.record.id > 0) {
      this.http.get(`${this.conf.api_url}${this.conf.api_path.userById}/${this.record.id}`).subscribe(res => (this.i = res));
    }
  }

  save(value: any) {
    this.http.post(`${this.conf.api_url}${this.conf.api_path.editUser}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
