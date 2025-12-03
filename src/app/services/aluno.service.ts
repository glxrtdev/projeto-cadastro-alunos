import { Injectable } from '@angular/core';
import { Aluno } from '../models/aluno.model';

const STORAGE_KEY = 'alunos_quality_v1';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private alunos: Aluno[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    this.alunos = raw ? JSON.parse(raw) : [];
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.alunos));
  }

  getAll(): Aluno[] {
    return [...this.alunos];
  }

  add(aluno: Aluno): void {
    aluno.id = Date.now();
    this.alunos.push(aluno);
    this.save();
  }

  update(updated: Aluno): void {
    const idx = this.alunos.findIndex(a => a.id === updated.id);
    if (idx !== -1) {
      this.alunos[idx] = { ...updated };
      this.save();
    }
  }

  delete(id: number): void {
    this.alunos = this.alunos.filter(a => a.id !== id);
    this.save();
  }
}
