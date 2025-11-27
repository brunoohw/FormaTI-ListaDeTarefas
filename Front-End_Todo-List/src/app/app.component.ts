import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  // URL da API (CONFIRA A PORTA DO SEU SWAGGER!)
  readonly apiUrl = 'https://localhost:7018'; 

  tarefas: any[] = [];
  categorias: any[] = [];
  
  // Modelo da nova tarefa
  novaTarefa = {
    nome: '',
    descricao: '',
    categoriaId: 0
  };

  // Filtro
  filtroCategoriaId: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarCategorias();
    this.carregarTarefas();
  }

  carregarCategorias() {
    this.http.get<any[]>(`${this.apiUrl}/Categorias`).subscribe(data => {
      this.categorias = data;
    }, error => console.error('Erro ao carregar categorias', error));
  }

  carregarTarefas() {
    this.http.get<any[]>(`${this.apiUrl}/Produtos`).subscribe(data => {
      this.tarefas = data;
    }, error => console.error('Erro ao carregar tarefas', error));
  }

  adicionarTarefa() {
    if(!this.novaTarefa.nome || this.novaTarefa.categoriaId == 0) {
      alert('Preencha o nome e selecione uma categoria!');
      return;
    }

    const payload = {
      nome: this.novaTarefa.nome,
      descricao: this.novaTarefa.descricao || 'Sem descrição',
      categoriaId: Number(this.novaTarefa.categoriaId),
      preco: 1.99,
      estoque: 1,
      imagemUrl: 'tarefa.png',
      dataCadastro: new Date().toISOString()
    };

    this.http.post(`${this.apiUrl}/Produtos`, payload).subscribe(() => {
      alert('Tarefa criada com sucesso!');
      this.novaTarefa.nome = '';
      this.novaTarefa.descricao = '';
      this.carregarTarefas();
    }, erro => {
      console.error(erro);
      alert('Erro ao salvar. Verifique se o Back-End está rodando e se o CORS está ativado.');
    });
  }

  excluirTarefa(id: number) {
    if(confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.http.delete(`${this.apiUrl}/Produtos/${id}`).subscribe(() => {
        this.carregarTarefas();
      }, erro => {
        alert('Erro ao excluir. Verifique o console.');
      });
    }
  }

  get tarefasFiltradas() {
    if (this.filtroCategoriaId == 0) {
      return this.tarefas;
    }
    return this.tarefas.filter(t => t.categoriaId == this.filtroCategoriaId);
  }
}