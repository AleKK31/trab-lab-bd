import { AppDataSource } from "../data-source";
import { MusicaEntity } from "../entity/musica.entity";

export class MusicaService {
  private repository = AppDataSource.getRepository(MusicaEntity);

  async criar(
    titulo: string,
    duracaoSegundos: number,
    artistaId: number
  ): Promise<MusicaEntity> {
    const musica = this.repository.create({
      titulo,
      duracaoSegundos,
      artistaId,
    });
    return await this.repository.save(musica);
  }

  async buscarPorId(id: number): Promise<MusicaEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["artista"],
    });
  }

  async buscarTodas(): Promise<MusicaEntity[]> {
    return await this.repository.find({
      relations: ["artista"],
    });
  }

  async atualizar(
    id: number,
    dados: { titulo?: string; duracaoSegundos?: number; artistaId?: number }
  ): Promise<MusicaEntity | null> {
    const musica = await this.buscarPorId(id);
    if (!musica) {
      return null;
    }

    if (dados.titulo) musica.titulo = dados.titulo;
    if (dados.duracaoSegundos) musica.duracaoSegundos = dados.duracaoSegundos;
    if (dados.artistaId) musica.artistaId = dados.artistaId;

    return await this.repository.save(musica);
  }

  async deletar(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
