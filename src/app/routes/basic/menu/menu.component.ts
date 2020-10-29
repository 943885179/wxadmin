import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { STReq } from '@delon/abc/st/st.interfaces';
import { STRes } from '@delon/abc/st/st.interfaces';
import { SFSchema } from '@delon/form';
import { ModalHelper, SettingsService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Config } from 'src/app/models/app-data';
import { BasicMenuEditComponent } from './edit/edit.component';
import { BasicMenuViewComponent } from './view/view.component';

@Component({
  selector: 'app-basic-menu',
  templateUrl: './menu.component.html',
})
export class BasicMenuComponent implements OnInit {
  conf: Config = this.settingsService.getData('config');
  url = this.conf.api_url + this.conf.api_path.menuList;
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
    {
      title: '名称', index: 'text',
      sort: {
        compare: (a, b) => a.name.length - b.name.length,
      },
    },
    {
      title: '图标s', format: (item, col, index) => {
        return item.icon == null ? '' : `${item.icon}`;
      }
    },
    { title: '图标', format: (item, col, index) => item.icon == null ? '' : `${item.icon}` },
    { title: '国际化', index: 'i_18_n' },
    { title: '上级id', index: 'p_id'},
    {
      title: '',
      buttons: [
        {
          text: '查看', icon: 'search', type: 'drawer', drawer: {
            component: BasicMenuViewComponent,
            params: item => item
          }
        },
        {
          text: '编辑',
          icon: 'edit',
          type: 'static',
          // component: SysMenuEditComponent,
          modal: {
            component: BasicMenuEditComponent,
            params: (item: any) =>  {
              item.editType = 1; // 修改菜单
              return item;
            }
          },
          click: () => {
            this.st.reload();
          }
        },
        {
          text: '添加子菜单',
          icon: 'edit',
          type: 'static',
          // component: SysMenuEditComponent,
          modal: {
            component: BasicMenuEditComponent,
            params: (item: any) => {
              item.editType = 2; // 修改子菜单
              return item;
            }
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
              this.http.post(this.conf.api_url + this.conf.api_path.delMenu, { id: record.id }).subscribe(() => comp!.removeRow(record));
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
      .createStatic(BasicMenuEditComponent, { i: { id: 0 } })
      .subscribe(() => this.st.reload());
  }

}
