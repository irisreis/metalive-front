import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideStorage, getStorage } from "@angular/fire/storage";
import { ReactiveFormsModule } from "@angular/forms"; // Importação para formulários reativos

// Configurações do Firebase
// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7rLD2BbkgExlwd6hhABPqvl39SfcrtFo",
  authDomain: "metalive-8b9e7.firebaseapp.com",
  projectId: "metalive-8b9e7",
  storageBucket: "metalive-8b9e7.firebasestorage.app", // <<<<< ALTERADO AQUI!
  messagingSenderId: "1052735217691",
  appId: "1:1052735217691:web:53d5aaccbb01b2bad1d8be",
  measurementId: "G-1GJLL3P14D",
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ScreenTrackingService,
    UserTrackingService,
    ReactiveFormsModule, // Habilitar formulários reativos
    provideRouter(routes), // Certifique-se de que está usando a variável correta
  ],
};
