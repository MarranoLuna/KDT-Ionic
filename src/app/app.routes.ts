
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; // Guardián de login
import { kdtGuard } from './guards/kdt-guard';   // Guardián de KDT
import { userGuard } from './guards/user-guard'; // Guardián de User

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
    loadComponent: () => import('./home/home.page').then( m => m.HomePage),
    canActivate: [authGuard, userGuard] // Requiere login Y ser 'user'
  },

  {
    path: 'new-requests',
    loadComponent: () => import('./new-requests/new-requests.page').then( m => m.NewRequestsPage),
    canActivate: [authGuard, userGuard] // Requiere login Y ser 'user'
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requests.page').then( m => m.RequestsPage),
    canActivate: [authGuard, userGuard] // Requiere login Y ser 'user'
  },

  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.page').then( m => m.OrdersPage)
  },
  {
    path: 'request-sent',
    loadComponent: () => import('./request-sent/request-sent.page').then( m => m.RequestSentPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.page').then( m => m.NotificationsPage)
  },
  
  {
    path: 'address',
    loadComponent: () => import('./address/address.page').then( m => m.AddressPage),
    canActivate: [authGuard, userGuard] // Requiere login Y ser 'user'
  },
    {
      path: 'profile-edit',
    loadComponent: () => import('./profile-edit/profile-edit.page').then( m => m.ProfileEditPage),
    canActivate: [authGuard] // Solo requiere estar logueado
  },
  {
    path: 'edit-password',
    loadComponent: () => import('./edit-password/edit-password.page').then( m => m.EditPasswordPage)
  },
  {
    path: 'register-motorcycle',
    loadComponent: () => import('./register-motorcycle/register-motorcycle.page').then( m => m.RegisterMotorcyclePage)
  },
  {
    path: 'register-bicycle',
    loadComponent: () => import('./register-bicycle/register-bicycle.page').then( m => m.RegisterBicyclePage)
  },
    {

    path: 'be-kdt',
    loadComponent: () => import('./be-kdt/be-kdt.page').then( m => m.BeKDTPage)
  },
  {
    path: 'kdt-form',
    loadComponent: () => import('./kdt-form/kdt-form.page').then( m => m.KdtFormPage)
  },
  {
    path: 'kdt-form2',
    loadComponent: () => import('./kdt-form2/kdt-form2.page').then( m => m.KdtForm2Page)
  },

  {
    path: 'request-sent-kdt',
    loadComponent: () => import('./request-sent-kdt/request-sent-kdt.page').then( m => m.RequestSentKdtPage)
  },
  {
    path: 'validate-vehicle',
    loadComponent: () => import('./validate-vehicle/validate-vehicle.page').then( m => m.ValidateVehiclePage )
  },
  {
    path: 'kdt-home',
    loadComponent: () => import('./kdt-home/kdt-home.page').then( m => m.KdtHomePage),
     canActivate: [authGuard, kdtGuard] // Requiere login Y ser 'kdt'
  },

 

];




 
;


