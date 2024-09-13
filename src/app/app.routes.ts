import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { ComboComponent } from "./pages/combo/combo.component";
import { PerfilComponent } from "./pages/perfil/perfil.component";
import { FormularioComponent } from "./pages/formulario/formulario.component";
import { userGuard } from "./guards/user.guard";
import { PagamentoComponent } from "./pages/pagamento/pagamento.component";
import { NutricionistaDashboardComponent } from "./pages/nutricionista-dashboard/nutricionista-dashboard.component";
import { PersonalDashboardComponent } from "./pages/personal-dashboard/personal-dashboard.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: CadastroComponent },
  { path: "combos", component: ComboComponent },
  { path: "perfil", component: PerfilComponent },
  { path: "formulario", component: FormularioComponent },
  { path: "pagamento", component: PagamentoComponent },
  { path: "nutricionista", component: NutricionistaDashboardComponent},
  { path: "personal", component: PersonalDashboardComponent}
];
console.log('Routes Configured', routes);
