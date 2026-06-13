export class Internacao {
  constructor(
    public id: number | null,
    public pacienteId: number,
    public leitoId: number,
    public dataEntrada: Date,
    public dataSaida: Date | null,
    public statusInternacaoId: number,
  ) {}
}
