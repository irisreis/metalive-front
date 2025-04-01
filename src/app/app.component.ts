import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]  // Correção aqui
})
export class AppComponent implements OnInit {
  title = 'metalive-front';

  ngOnInit() {
    console.log('AppComponent Initialized');
  }
}
