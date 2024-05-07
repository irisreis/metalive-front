import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      provideFirebaseApp(
        () => initializeApp(
          {
            "projectId": "metalive-22ff2",
            "appId": "1:1047384985528:web:71aecac79764b3d8c9894d",
            "storageBucket": "metalive-22ff2.appspot.com",
            "apiKey": "AIzaSyDoV1Xfpdn__R8Fjzr1W7a_J-PDAhs7EEI",
            "authDomain": "metalive-22ff2.firebaseapp.com",
            "messagingSenderId": "1047384985528"
          }
        )
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideAnalytics(() => getAnalytics())),
    ScreenTrackingService,
    UserTrackingService,
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage()))]
};
