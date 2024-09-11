import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { ComboComponent } from "./pages/combo/combo.component";
import { PerfilComponent } from "./pages/perfil/perfil.component";
import { FormularioComponent } from "./pages/formulario/formulario.component";
import { PagamentoComponent } from "./pages/pagamento/pagamento.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: CadastroComponent },
  { path: "combos", component: ComboComponent },
  { path: "perfil", component: PerfilComponent },
  { path: "formulario", component: FormularioComponent },
  { path: "pagamento,", component: PagamentoComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)  //Configura o RouterModule com as rotas definidas
  ],
  exports: [
    RouterModule  //Exporta o RouterModule para que ele esteja disponível em todo o aplicativo
  ]
})
export class AppRoutingModule { }
