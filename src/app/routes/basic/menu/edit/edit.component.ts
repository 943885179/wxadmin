import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema, SFTreeSelectWidgetSchema, SFUISchema } from '@delon/form';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Config } from 'src/app/models/app-data';

@Component({
  selector: 'app-basic-menu-edit',
  templateUrl: './edit.component.html',
})
export class BasicMenuEditComponent implements OnInit {
  record: any = {};
  menudata: any;
  i: any;
  schema: SFSchema = {
    properties: {
    },
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id: {
      widget: 'text'
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

  ngOnInit(): void{
    if (this.record.id > 0) {
     this.http.get(`${this.conf.api_url}${this.conf.api_path.menuById}/${this.record.id}`)
        .subscribe(res => {
          this.i = res;
          let p_id = this.i.p_id ; // 默认是父级
          if (this.record.editType === 2) {// 如果是添加子菜单，父id默认为自身
            p_id = this.i.id;
          }
          this.getSelectMenu(res, p_id);
        });
    }
    else {
       this.getSelectMenu(null, '');
    }
  }
  save(value: any) {
    if (this.record.editType === 2) {// 如果是添加子菜单，父id默认为自身
      value.id = '';
    }
    value.p_id = value.pid; // 读取父id
    this.http.post(`${this.conf.api_url}${this.conf.api_path.editMenu}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }
 getSelectMenu(menu: any, p_id: string) {
    this.http.get(this.conf.api_url + this.conf.api_path.menuTree)
    .subscribe((res) => {
      this.schema = {
        properties: {
          id: { type: 'string', title: 'id' },
          text: { type: 'string', title: '菜单名称', maxLength: 15 },
          i_18_n: { type: 'string', title: 'i18n' },
          icon: { type: 'string', title: '图标', },
          pid: {
            type: 'string',
            title: '上级菜单',
            ui: {
              allowClear: true,
              showIcon: true,
              // notFoundContent: '没有数据',
              widget: 'tree-select',
              defaultExpandAll: true,
              // showLine: true,
              // showExpand: true,
              // showRequired: true,
              placeholder: '选择上级菜单',
              // multiple: true,
             // asyncData: () => of(res.data).pipe(),
            } as SFTreeSelectWidgetSchema,
            enum: res.data,
            default: p_id // menu === null ? '' : menu.p_id + '',
          },
          link: { type: 'string', title: '路由' },
          external_link: { type: 'string', title: '外部链接' },
          target: {
            type: `string`,
            title: '链接target',
            enum: [
              { label: '_blank', value: '_blank' },
              { label: '_self', value: '_self' },
              { label: '_parent', value: '_parent' },
              { label: '_top', value: '_top' }
            ],
            ui: {
              widget: 'radio',
              styleType: 'button',
              buttonStyle: 'solid',
            },
            default: menu == null ? '' : menu.target
          },
          disabled: {
            type: 'boolean',
            title: '是否禁用',
            default: menu == null ? false : menu.disabled
          },
          hide: {
            type: 'boolean',
            title: '是否隐藏',
            default: menu == null ? false : menu.hide
          }
        },
        required: ['text', 'i_18_n'],
      };
    });
  }

  close() {
    this.modal.destroy();
  }
}
