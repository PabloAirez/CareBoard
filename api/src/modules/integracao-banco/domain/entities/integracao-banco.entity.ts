export class IntegracaoBanco {
  constructor(
    public id: number | null,
    public hospitalId: number,
    public sistemaExternoId: number,
    public caminhoEnv: string,
  ) {}
}
