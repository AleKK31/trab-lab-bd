import { AppDataSource } from "../data-source";
import { UsuarioEntity } from "../entity/usuario.entity";

export class UsuarioService {
  private repository = AppDataSource.getRepository(UsuarioEntity);

  async criar(username: string, email: string): Promise<UsuarioEntity> {
    const usuario = this.repository.create({
      username,
      email,
    });
    return await this.repository.save(usuario);
  }

  async buscarPorId(id: number): Promise<UsuarioEntity | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async buscarPorUsername(username: string): Promise<UsuarioEntity | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }

  async buscarTodos(): Promise<UsuarioEntity[]> {
    return await this.repository.find();
  }
}
