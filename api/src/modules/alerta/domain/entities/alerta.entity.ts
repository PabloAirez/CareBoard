export class Alerta {
  constructor(
    public id: number | null,
    public internacaoId: number,
    public tipoAlertaId: number,
    public mensagem: string,
    public dataHora: Date,
    public visto: boolean,
    public vistoPorUsuarioId: number | null,
    public dataHoraVisto: Date | null,
  ) {}
}
