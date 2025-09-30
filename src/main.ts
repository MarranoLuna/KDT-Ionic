import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { addIcons } from 'ionicons';
import { locationOutline, trashOutline, exitOutline,rocketOutline, cubeOutline, notificationsOutline,newspaperOutline,cartOutline, peopleOutline,personCircleOutline, homeOutline} from 'ionicons/icons';

addIcons({
  'location-outline': locationOutline,
  'exit-outline': exitOutline,
  'cube-outline': cubeOutline,
  'cart-outline': cartOutline,
  'people-outline': peopleOutline,
  'newspaper-outline':newspaperOutline,
  'notifications-outline':notificationsOutline,
  'home-outline':homeOutline,
  'rocket-outline':rocketOutline,
  'trash-outline': trashOutline,

}); 

import { provideHttpClient } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    
  ],
});


