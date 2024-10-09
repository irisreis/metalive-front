// app-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { routes } from "./app.routes"; // Importe as rotas definidas

@NgModule({
  imports: [
    RouterModule.forRoot(routes)  // Configura o RouterModule com as rotas definidas
  ],
  exports: [
    RouterModule  // Exporta o RouterModule para que ele esteja disponível em todo o aplicativo
  ]
})
export class AppRoutingModule { }
