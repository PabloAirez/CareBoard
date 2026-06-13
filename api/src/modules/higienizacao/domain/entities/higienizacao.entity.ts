export class Higienizacao {
  constructor(
    public id: number | null,
    public leitoId: number,
    public statusHigienizacaoId: number,
    public dataInicio: Date,
    public dataFim: Date | null,
    public realizadoPorUsuarioId: number | null,
  ) {}
}
