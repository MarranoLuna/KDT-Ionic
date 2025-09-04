import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'index',
    loadComponent: () => import('./index/index.page').then( m => m.IndexPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'new-requests',
    loadComponent: () => import('./new-requests/new-requests.page').then( m => m.NewRequestsPage)
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requests.page').then( m => m.RequestsPage)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.page').then( m => m.OrdersPage)
  },
  {
    path: 'request-sent',
    loadComponent: () => import('./request-sent/request-sent.page').then( m => m.RequestSentPage)
  },

];

