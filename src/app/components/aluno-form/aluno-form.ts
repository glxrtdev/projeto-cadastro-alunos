import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Aluno } from '../../models/aluno.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  templateUrl: './aluno-form.html',
  styleUrls: ['./aluno-form.css'],
  providers: [provideNgxMask()]
})
export class AlunoFormComponent implements OnChanges {
  @Input() alunoEdit: Aluno | null = null;
  @Output() save = new EventEmitter<Aluno>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: [''],
      nascimento: [''],
      telefone: [''],
      celular: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alunoEdit']) {
      if (this.alunoEdit) {
        this.form.patchValue(this.alunoEdit);
      } else {
        this.form.reset();
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const aluno: Aluno = { ...this.form.value };
    this.save.emit(aluno);
    this.form.reset();
  }

  onCancel(): void {
    this.form.reset();
    this.cancel.emit();
  }

  get nome() { return this.form.get('nome'); }
  get email() { return this.form.get('email'); }
}
