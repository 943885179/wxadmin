import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STReq, STRes } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, SettingsService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Config } from 'src/app/models/app-data';
import { BasicSrvEditComponent } from './edit/edit.component';
import { BasicSrvViewComponent } from './view/view.component';

@Component({
  selector: 'app-basic-srv',
  templateUrl: './srv.component.html',
})
export class BasicSrvComponent implements OnInit {
  conf: Config = this.settingsService.getData('config');
  url = this.conf.api_url + this.conf.api_path.srvList;
  req: STReq = {
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'row',
    },
    allInBody: true,
    headers: {
      'Content-Type': 'application/json',
    },

  };
  resp: STRes = {
    reName: {
      list: 'data',
      total: 'total',
      }
  };
  searchSchema: SFSchema = {
    properties: {
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id' },
    { title: '服务名称', index: 'service' },
    { title: '方法名称', index: 'method'},
    { title: '描述', index: 'srv_explain'},
    {
      title: '',
      buttons: [
        {
          text: '查看', icon: 'search', type: 'drawer', drawer: {
            component: BasicSrvViewComponent,
            params: item => item
          }
        },
        {
          text: '编辑',
          icon: 'edit',
          type: 'static',
          // component: SysMenuEditComponent,
          modal: {
            component: BasicSrvEditComponent,
            params: (item: any) => item
          },
          click: () => {
            this.st.reload();
          }
        },
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          pop: {
            title: '是否确定删除?',
            okType: 'danger',
            icon: 'star',
          },
            click: (record, _modal, comp) => {
              this.http.post(this.conf.api_url + this.conf.api_path.delSrv, { id: record.id }).subscribe(() => comp!.removeRow(record));
          },
          iif: (item) => item.children === undefined,
          // iif: (item) => item.p_id > 0,
        }
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private settingsService: SettingsService,
    private msg: NzMessageService
  ) { }

  ngOnInit() { }
  add() {
    this.modal
      .createStatic(BasicSrvEditComponent, { i: { id: 0 } })
      .subscribe(() => this.st.reload());
  }

}
