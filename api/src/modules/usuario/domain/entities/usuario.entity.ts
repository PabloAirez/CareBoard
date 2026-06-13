export class Usuario {
  constructor(
    public id: number | null,
    public nome: string,
    public tipoUsuarioId: number,
    public hospitalId: number,
  ) {}
}
