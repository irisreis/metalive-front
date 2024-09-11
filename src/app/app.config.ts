import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideStorage, getStorage } from "@angular/fire/storage";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({
      projectId: "metalive-22ff2",
      appId: "1:1047384985528:web:71aecac79764b3d8c9894d",
      storageBucket: "metalive-22ff2.appspot.com",
      apiKey: "AIzaSyDoV1Xfpdn__R8Fjzr1W7a_J-PDAhs7EEI",
      authDomain: "metalive-22ff2.firebaseapp.com",
      messagingSenderId: "1047384985528"
    })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};