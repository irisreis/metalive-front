import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideStorage, getStorage } from "@angular/fire/storage";
import { ReactiveFormsModule } from '@angular/forms'; // Importação correta para formulários

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7rLD2BbkgExlwd6hhABPqvl39SfcrtFo",
  authDomain: "metalive-8b9e7.firebaseapp.com",
  projectId: "metalive-8b9e7",
  storageBucket: "metalive-8b9e7.appspot.com",
  messagingSenderId: "1052735217691",
  appId: "1:1052735217691:web:53d5aaccbb01b2bad1d8be",
  measurementId: "G-1GJLL3P14D"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule  // Habilitar formulários reativos
  ]
};