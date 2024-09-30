import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { ComboComponent } from "./pages/combo/combo.component";
import { PerfilComponent } from "./pages/perfil/perfil.component";
import { FormularioComponent } from "./pages/formulario/formulario.component";
import { PagamentoComponent } from "./pages/pagamento/pagamento.component";
import { NutricionistaDashboardComponent } from "./pages/nutricionista-dashboard/nutricionista-dashboard.component";
import { PersonalDashboardComponent } from "./pages/personal-dashboard/personal-dashboard.component";
import { RoleGuard } from './guards/role.guard'; // Certifique-se de que o caminho está correto

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: CadastroComponent },
  { path: "combos", component: ComboComponent },
  { 
    path: "perfil/:uid", 
    component: PerfilComponent,
    canActivate: [RoleGuard],
    data: { role: 'cliente' } // Ajuste o role conforme necessário
  },
  { 
    path: "NutricionistaDashboardComponent/:uid", 
    component: NutricionistaDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'nutricionista' } // Ajuste o role conforme necessário
  },
  { 
    path: "PersonalDashboardComponent/:uid", 
    component: PersonalDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'personal trainer' } // Ajuste o role conforme necessário
  },
  { path: "formulario", component: FormularioComponent },
  { path: "pagamento", component: PagamentoComponent},
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
