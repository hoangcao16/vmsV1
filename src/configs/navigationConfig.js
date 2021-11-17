import { reactLocalStorage } from 'reactjs-localstorage';

const navigationConfig = [
  {
    id: 'map',
    title: 'Bản đồ Vietmap',
    type: 'item',
    navLink: '/app/maps'
  },
  {
    id: 'view',
    title: 'Giám sát',
    type: 'item',
    navLink: '/app/live'
  },
  {
    id: 'event',
    title: 'Sự kiện',
    type: 'item',
    navLink: '/app/storage/export-event-file'
  },
  {
    id: 'report',
    title: 'Báo cáo',
    type: 'item',
    navLink: '/app/report'
  },
  {
    id: 'notification',
    title: 'Thông báo',
    type: 'item',
    navLink: '/app/notification'
  },
  {
    id: 'infor',
    title: 'Thông tin cá nhân',
    type: 'item',
    navLink: `/app/infor`
  },
  {
    id: 'setting',
    title: 'Cài đặt',
    type: 'item',
    navLink: '/app/setting'
  },
  {
    id: 'humans',
    title: 'Quản lý khuôn mặt',
    type: 'item',
    navLink: '/humans/list'
  },
  {
    id: 'ai-config',
    title: 'Quản lý sự kiện thông minh',
    type: 'item',
    navLink: '/ai_config'
  }
];

export default navigationConfig;