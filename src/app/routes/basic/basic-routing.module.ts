import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicUserComponent } from './user/user.component';
import { BasicApiComponent } from './api/api.component';
import { BasicSrvComponent } from './srv/srv.component';
import { BasicMenuComponent } from './menu/menu.component';
import { BasicTreeComponent } from './tree/tree.component';
import { BasicShopComponent } from './shop/shop.component';
import { BasicUsergroupComponent } from './usergroup/usergroup.component';

const routes: Routes = [
  { path: 'user', component: BasicUserComponent },
  { path: 'api', component: BasicApiComponent },
  { path: 'srv', component: BasicSrvComponent },
  { path: 'menu', component: BasicMenuComponent },
  { path: 'tree', component: BasicTreeComponent },
  { path: 'shop', component: BasicShopComponent },
  { path: 'usergroup', component: BasicUsergroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicRoutingModule { }
