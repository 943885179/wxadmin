import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, SettingsService, _HttpClient } from '@delon/theme';
import { Config } from 'src/app/models/app-data';
import { BasicUserEditComponent } from './edit/edit.component';
import { BasicUserViewComponent } from './view/view.component';

@Component({
  selector: 'app-basic-user',
  templateUrl: './user.component.html',
})
export class BasicUserComponent implements OnInit {
  // url = `/user`;
  conf: Config = this.settingsService.getData('config');
  url = this.conf.api_url + this.conf.api_path.userInfoList;
  page_req = {
    page: 1,
    row: 10
  };
  req: STReq = {
    method: 'POST',
    reName: {
      pi: 'page_req.page',
      ps: 'page_req.row',
    },
    allInBody: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      page_req: this.page_req
    }

  };
  resp: STRes = {
    reName: {
      list: 'data',
      total: 'total',
      }
  };

  searchSchema: SFSchema = {
    properties: {
      user_name: {
        type: 'string',
        title: '用户名'
      },
      user_phone: {
        type: 'string',
        title: '电话'
      },
      user_email: {
        type: 'string',
        title: '邮箱'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id' },
    { title: '用户名', index: 'user_name' },
    // { title: '头像', type: 'img', width: '50px', index: 'icon.name' },
    { title: '电话',  index: 'user_phone' },
    { title: '邮箱', index: 'user_email' },
    { title: '身份证', index: 'id_card' },
   // { title: '时间', type: 'date', index: 'user_phone' },
    {
      title: '',
      buttons: [
        {
          text: '查看', icon: 'search', type: 'drawer', drawer: {
            component: BasicUserViewComponent,
            params: item => item
          }
        },
        {
          text: '编辑',
          icon: 'edit',
          type: 'static',
          // component: SysMenuEditComponent,
          modal: {
            component: BasicUserEditComponent,
            params: (item: any) => item
          },
          click: () => {
            this.st.reload();
          }
        },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private settingsService: SettingsService) { }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
