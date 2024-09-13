import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; 
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp as provideFirebaseAppInitialize } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Adicione esta linha se você também estiver usando `ngModel`


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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => provideFirebaseAppInitialize(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideHttpClient(),
    CommonModule,
    ReactiveFormsModule, // Adicione esta linha
    FormsModule // Adicione esta linha se usar ngModel
  ]
}).catch(err => {
  // Trate o erro aqui
  if (err instanceof Error) {
    console.error('Error bootstrapping application:', err.message);
  } else {
    console.error('An unknown error occurred:', err);
  }
});
