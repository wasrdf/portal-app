import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pessoa } from "../model/pessoa.model";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class PessoaService {

    private api: string = "http://localhost:9090/api/pessoa";

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any>(this.api + "/pessoas");
    }

    inserirPessoa(pessoa: Pessoa) {
        return this.http.post(this.api + "/criarPessoa", pessoa);
    }

    atualizarPessoa(pessoa: Pessoa) {
        return this.http.put(this.api + "/atualizar", pessoa);
    }

    deletarPessoa(id: number) {
        return this.http.delete(this.api + "/delete/" + id, );
    }

    findById(id: number) {
        return this.http.get<Pessoa>(this.api + "/pessoas/" + id);
    }

}