import { Component } from "@angular/core";
import { AppToastService } from "../../services/toast.service";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [NgbToast],
  templateUrl: "./toast.component.html",
  styleUrl: "./toast.component.scss"
})
export class ToastComponent {
  constructor(public toastService: AppToastService) {}
}
