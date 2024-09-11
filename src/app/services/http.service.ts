import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HttpService<T> {
  private apiURI = "";

  constructor(private httpClient: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  get(endpoint: string): Observable<T> {
    const url = `${this.apiURI}/${endpoint}`;
    return this.httpClient.get<T>(url, this.httpOptions);
  }

  getOne(idPessoa: string): Observable<T> {
    const url = `${this.apiURI}/${idPessoa}`;
    return this.httpClient.get<T>(url, this.httpOptions);
  }
}
