export class Paciente {
  constructor(
    public id: number | null,
    public nome: string,
    public dataNascimento: Date | null,
    public sexo: string | null,
    public temDoencaContagiosa: boolean,
  ) {}
}
