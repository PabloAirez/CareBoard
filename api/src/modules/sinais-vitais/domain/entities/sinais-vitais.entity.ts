export class SinaisVitais {
  constructor(
    public id: number | null,
    public pacienteId: number,
    public dataHora: Date,
    public oximetria: string | null,
    public usaSuporteOxigenio: boolean | null,
    public temperatura: string | null,
    public frequenciaCardiaca: number | null,
    public frequenciaRespiratoria: number | null,
    public pressaoSistolica: number | null,
    public pressaoDiastolica: number | null,
    public nivelConsciencia: string | null,
    public mewsScore: number | null,
  ) {}
}
