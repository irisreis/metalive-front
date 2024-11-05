// app-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from '../app/pages/home/home.component'; // Certifique-se de importar o HomeComponent
import { FormularioComponent } from './pages/formulario/formulario.component'; // Certifique-se de importar o FormularioComponent

// Importe as rotas definidas
export const routes: Routes = [
  { path: '', component: HomeComponent }, // Rota para a página inicial
  { path: 'formulario/:clienteId', component: FormularioComponent }, // Rota para o formulário
  // Outras rotas aqui...
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)  // Configura o RouterModule com as rotas definidas
  ],
  exports: [
    RouterModule  // Exporta o RouterModule para que ele esteja disponível em todo o aplicativo
  ]
})
export class AppRoutingModule { }
