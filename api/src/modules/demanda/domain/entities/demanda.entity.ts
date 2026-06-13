export class Demanda {
  constructor(
    public id: number | null,
    public internacaoId: number,
    public tipoDemandaId: number,
    public statusDemandaId: number,
    public dataHoraSolicitacao: Date,
    public dataHoraAtendimento: Date | null,
    public atendidoPorUsuarioId: number | null,
  ) {}
}
