export class IntegracaoBanco {
  constructor(
    public id: number | null,
    public hospitalId: number,
    public sistemaExternoId: number,
    public host: string,
    public porta: number,
    public nomeBanco: string,
    public usuario: string,
    public senhaCriptografada: string,
    public ivCriptografia: string,
    public authTag: string,
  ) {}
}
