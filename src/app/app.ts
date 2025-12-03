import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Aluno } from './models/aluno.model';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'; // ✅ alterado aqui
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxMaskDirective,
    NgxMaskPipe, 
    MatDialogModule
  ],
  providers: [provideNgxMask()], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  alunos: Aluno[] = [];
  aluno: Aluno = { nome: '', email: '', cpf: '', nascimento: '', telefone: '', celular: '' };
  editando = false;
  indexEdicao: number | null = null;

  colunas = ['nome', 'email', 'cpf', 'nascimento', 'celular', 'telefone', 'acoes'];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    if (typeof window !== 'undefined' && localStorage) {
      this.alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
    }
  }

  salvarAluno() {
    if (!this.aluno.nome || !this.aluno.email) {
      this.snackBar.open('Preencha nome e e-mail!', 'Fechar', { duration: 2000 });
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.aluno.email);
    if (!emailValido) {
      this.snackBar.open('E-mail inválido!', 'Fechar', { duration: 2000 });
      return;
    }

    if (this.aluno.cpf && !this.cpfValido(this.aluno.cpf)) {
      this.snackBar.open('CPF inválido!', 'Fechar', { duration: 2000 });
      return;
    }

    if (this.editando && this.indexEdicao !== null) {
      this.alunos[this.indexEdicao] = { ...this.aluno };
      this.snackBar.open('Aluno atualizado!', 'Fechar', { duration: 2000 });
    } else {
      this.alunos.push({ ...this.aluno });
      this.snackBar.open('Aluno adicionado!', 'Fechar', { duration: 2000 });
    }

    this.salvarLocal();
    this.alunos = [...this.alunos];
    this.cancelar();
  }

  editar(i: number) {
    this.aluno = { ...this.alunos[i] };
    this.editando = true;
    this.indexEdicao = i;
  }

  async remover(i: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja realmente excluir o aluno "${this.alunos[i].nome}"?`
      },
      width: '350px',
      panelClass: 'confirm-dialog-panel'
    });

    const confirmed = await dialogRef.afterClosed().toPromise();

    if (confirmed) {
      this.alunos.splice(i, 1);
      this.salvarLocal();
      this.alunos = [...this.alunos];
      this.snackBar.open('Aluno excluído!', 'Fechar', { duration: 2000 });
    }
  }

  cancelar() {
    this.aluno = { nome: '', email: '', cpf: '', nascimento: '' };
    this.editando = false;
    this.indexEdicao = null;
  }

  private salvarLocal() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('alunos', JSON.stringify(this.alunos));
    }
  }

  cpfValido(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = 11 - (soma % 11);
    let digito1 = resto > 9 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = 11 - (soma % 11);
    let digito2 = resto > 9 ? 0 : resto;

    return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
  }
}
