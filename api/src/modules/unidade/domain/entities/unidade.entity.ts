export class Unidade {
  constructor(
    public id: number | null,
    public nome: string,
    public hospitalId: number,
    public idSistemaExterno: string | null = null,
  ) {}
}
