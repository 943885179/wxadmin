export interface Config{
  app: {// app信息
    name: string;
    description: string;
  };
  user: {
    name: string;
    avatar: string;
    email: string;
  };
  menu: Menu[];
  api_url: string;
  img_url: string;
  // api_path: [];
  api_path: {
    login: string;
    registry: string;
    userInfoList: string;
    token: string;
    userById: string;
    editUser: string;

    menuList: string;
    menuById: string;
    editMenu: string;
    menuTree: string;
    delMenu: string;

    apiList: string;
    delApi: string;
    editApi: string;
    apiById: string;

    srvList: string;
    delSrv: string;
    editSrv: string;
    srvById: string;
  };
}

export interface Menu{
  text: string;
  icon: string;
  link: string;
  i18n: string;
  group: boolean;
  hideInBreadcrumb: boolean;
  shortcutRoot: boolean;
  badge: number;
  children: Menu[];
}
