import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { addIcons } from 'ionicons';
import { locateOutline,chevronDownOutline, locationOutline, trashOutline, exitOutline,rocketOutline, cubeOutline, notificationsOutline,newspaperOutline,cartOutline, peopleOutline,personCircleOutline, homeOutline, cloud, cloudUploadOutline, listOutline, addCircleOutline, cashOutline, archiveOutline, mapOutline, swapHorizontalOutline, eye} from 'ionicons/icons';

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
  'cloud-upload-outline':cloudUploadOutline,
  'locate-outline': locateOutline,             
  'chevron-down-outline': chevronDownOutline,
  'person-circle-outline': personCircleOutline,
  'list-outline':listOutline,
  'add-circle-outline': addCircleOutline,
  'cash-outline': cashOutline,
  'archive-outline': archiveOutline,
  'map-outline': mapOutline,
  'swap-horizontal-outline': swapHorizontalOutline,
  'eye':eye,

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


