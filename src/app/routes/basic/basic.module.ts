import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { BasicRoutingModule } from './basic-routing.module';
import { BasicUserEditComponent } from './user/edit/edit.component';
import { BasicUserComponent } from './user/user.component';
import { BasicUserViewComponent } from './user/view/view.component';
import { BasicApiComponent } from './api/api.component';
import { BasicApiEditComponent } from './api/edit/edit.component';
import { BasicApiViewComponent } from './api/view/view.component';
import { BasicSrvComponent } from './srv/srv.component';
import { BasicSrvEditComponent } from './srv/edit/edit.component';
import { BasicSrvViewComponent } from './srv/view/view.component';
import { BasicMenuComponent } from './menu/menu.component';
import { BasicMenuEditComponent } from './menu/edit/edit.component';
import { BasicMenuViewComponent } from './menu/view/view.component';
import { BasicTreeComponent } from './tree/tree.component';
import { BasicTreeEditComponent } from './tree/edit/edit.component';
import { BasicTreeViewComponent } from './tree/view/view.component';
import { BasicShopComponent } from './shop/shop.component';
import { BasicShopEditComponent } from './shop/edit/edit.component';
import { BasicShopViewComponent } from './shop/view/view.component';
import { BasicUsergroupComponent } from './usergroup/usergroup.component';
import { BasicUsergroupEditComponent } from './usergroup/edit/edit.component';
import { BasicUsergroupViewComponent } from './usergroup/view/view.component';

const COMPONENTS: Type<void>[] = [
  BasicUserComponent,
  BasicApiComponent,
  BasicSrvComponent,
  BasicMenuComponent,
  BasicTreeComponent,
  BasicShopComponent,
  BasicUsergroupComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [
  BasicUserEditComponent,
  BasicUserViewComponent,
  BasicApiEditComponent,
  BasicApiViewComponent,
  BasicSrvEditComponent,
  BasicSrvViewComponent,
  BasicMenuEditComponent,
  BasicMenuViewComponent,
  BasicTreeEditComponent,
  BasicTreeViewComponent,
  BasicShopEditComponent,
  BasicShopViewComponent,
  BasicUsergroupEditComponent,
  BasicUsergroupViewComponent];

@NgModule({
  imports: [
    SharedModule,
    BasicRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class BasicModule { }
