export class Hospital {
  constructor(
    public id: number | null,
    public nome: string,
    public cnpj: string,
    public endereco?: string,
  ) {}
}
