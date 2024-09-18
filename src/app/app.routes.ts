import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { ComboComponent } from "./pages/combo/combo.component";
import { PerfilComponent } from "./pages/perfil/perfil.component";
import { FormularioComponent } from "./pages/formulario/formulario.component";
import { PagamentoComponent } from "./pages/pagamento/pagamento.component";
import { NutricionistaDashboardComponent } from "./pages/nutricionista-dashboard/nutricionista-dashboard.component";
import { PersonalDashboardComponent } from "./pages/personal-dashboard/personal-dashboard.component";
import { CadastroColaboradorComponent } from "./pages/cadastro-colaborador/cadastro-colaborador.component";
import { LoginColaboradorComponent } from "./pages/login-colaborador/login-colaborador.component";
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: CadastroComponent },
  { path: "combos", component: ComboComponent },
  { path: "perfil",
    component: PerfilComponent,
    canActivate: [RoleGuard],
    data: { role: 'cliente' } 
  },
  { path: "formulario", component: FormularioComponent },
  { path: "pagamento", component: PagamentoComponent },
  { path: "nutricionista",
    component: NutricionistaDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'Nutricionista' } 
  },
  { path: "personal",
    component: PersonalDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'Personal Trainer' }
  },
  { path: "cadastroColaborador", component: CadastroColaboradorComponent},
  { path: "loginColaborador", component: LoginColaboradorComponent},

  // Wildcard para capturar todas as outras rotas
  { path: '**', redirectTo: '/not-found' }
];
console.log('Routes Configured', routes);
