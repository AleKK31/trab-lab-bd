import { AppDataSource } from "../data-source";
import { ArtistaEntity } from "../entity/artista.entity";

export class ArtistaService {
  private repository = AppDataSource.getRepository(ArtistaEntity);

  async criar(nome: string, nacionalidade: string): Promise<ArtistaEntity> {
    const artista = this.repository.create({
      nome,
      nacionalidade,
    });
    return await this.repository.save(artista);
  }

  async buscarPorId(id: number): Promise<ArtistaEntity | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async buscarTodos(): Promise<ArtistaEntity[]> {
    return await this.repository.find();
  }

  async atualizar(
    id: number,
    dados: { nome?: string; nacionalidade?: string }
  ): Promise<ArtistaEntity | null> {
    const artista = await this.buscarPorId(id);
    if (!artista) {
      return null;
    }

    if (dados.nome) artista.nome = dados.nome;
    if (dados.nacionalidade) artista.nacionalidade = dados.nacionalidade;

    return await this.repository.save(artista);
  }

  async deletar(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
