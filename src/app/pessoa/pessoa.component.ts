import { Component, OnInit, Input } from '@angular/core';
import { PessoaService } from '../service/pessoa.service';
import { Pessoa } from '../model/pessoa.model';
import { Output } from '@angular/core/src/metadata/directives';
import { Message, MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/components/common/api';
import { utils, write, WorkBook, read } from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from "@angular/common";
import { SelectItem } from 'primeng/api';
import { Profissao } from '../model/profissao.model';


@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.css'],
  providers: [ConfirmationService]
})
export class PessoaComponent implements OnInit {

  display: boolean = false;
  pessoas: Array<any>;
  pessoaSelecionada = new Pessoa();

  texto: string;

  profs: Array<any>;

  //mensagens
  growl: Message[] = [];
  labelMsg: Message[] = [];

  sexo: SelectItem[];

  profissoes: SelectItem[];

  sexoSelecionado: string;

  cols: any[];
  constructor(private pessoaService: PessoaService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.listarPessoas();
    this.cols = [
      { field: 'nome', header: 'Nome' },
      { field: 'cpf', header: 'cpf' },
      { field: 'email', header: 'email' },
      { field: 'telefone', header: 'telefone' }
    ];

    this.sexo = [
      { label: 'Selecione o sexo', value: null },
      { label: 'Masculino', value: 'M' },
      { label: 'Feminino', value: 'F' }
    ];

    //carrega as profissoes
    this.carregarProfissoes();

  }

  fileChanged(e: Event) {
    var target: HTMLInputElement = e.target as HTMLInputElement;
    for (var i = 0; i < target.files.length; i++) {
      this.upload(target.files[i]);
    }
  }

  upload(img: File) {
    var formData: FormData = new FormData();
    formData.append("image", img, img.name);
    this.getBase64(img);//transforma a imagem em base64/blob 
  }

  //metodo responsavel por salvar no banco a foto em base64
  getBase64(file) {
    var reader = new FileReader();
    var r = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = e => {
      const b64 = reader.result;
      this.uploadImg(b64);
    };
    this.pessoaSelecionada.tipoImg = file.type;
  }

  uploadImg(b64: any) {
    this.pessoaSelecionada.avatar = b64;
    this.pessoaService.uploadUrl(this.pessoaSelecionada);
  }



  exportarExcel() {

    const ws_name = 'Pessoas';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = utils.json_to_sheet(this.pessoas);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      };
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'exported.xlsx');
  }


  listarPessoas() {
    this.pessoaService.getAll().subscribe(p => {
      this.pessoas = p;
    })
  }

  selecionarPessoa(p: Pessoa) {
    this.pessoaService.findById(p.id).subscribe(pe => {
      this.pessoaSelecionada = pe;
    });
    this.display = true;
  }


  fechar() {
    this.display = false;
  }

  salvar(p: Pessoa) {
    if (this.validarCampos()) {
      if (p.id == null) {
        this.criarPessoa(p);
        this.display = false;
      } else {
        this.atualizarPessoa(p);
        this.display = false;
      }
    }
  }

  atualizarPessoa(p: Pessoa) {
    this.pessoaService.atualizarPessoa(p)
      .subscribe((data: Pessoa[]) => {
        this.listarPessoas();
        this.growl.push({ severity: 'info', summary: 'Alerta', detail: 'Pessoa atualizada com sucesso!' });
        this.display = false;
      });
  }

  novaPessoa() {
    this.pessoaSelecionada = new Pessoa();
    this.display = true;
  }

  criarPessoa(p: Pessoa): void {
    this.pessoaService.inserirPessoa(p)
      .subscribe((data: Pessoa[]) => {
        this.listarPessoas();
        this.growl.push({ severity: 'info', summary: 'Alerta', detail: 'Pessoa inserida com sucesso!' });
        this.display = false;
      });
  };


  deletarPessoa(pessoa: number): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que quer deletar esse registro?',
      accept: () => {
        this.pessoaService.deletarPessoa(pessoa)
          .subscribe(data => {
            this.pessoas = this.pessoas.filter(p => p.id !== pessoa);
            this.growl.push({ severity: 'info', summary: 'Alerta', detail: 'Pessoa removida com sucesso!' });
          })
      }
    });
  };


  validarCampos() {
    if (this.pessoaSelecionada.nome == null) {
      this.labelMsg.push({ severity: 'error', summary: 'Atenção', detail: 'Campo nome é obrigatório.' })
      return false;
    }

    if (this.pessoaSelecionada.cpf == null || this.pessoaSelecionada.cpf.length < 11) {
      this.labelMsg.push({ severity: 'error', summary: 'Atenção', detail: 'Campo cpf inválido!' })
      return false;
    }

    else {
      return true;
    }
  }


  carregarProfissoes() {
    this.pessoaService.carregarProfissoes().subscribe(p => {
      this.profs = p;
    });    
  }
}
