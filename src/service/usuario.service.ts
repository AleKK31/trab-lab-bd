import { AppDataSource } from "../data-source";
import { UsuarioEntity } from "../entity/usuario.entity";

export class UsuarioService {
  private repository = AppDataSource.getRepository(UsuarioEntity);

  // Create
  async criar(username: string, email: string): Promise<UsuarioEntity> {
    const usuario = this.repository.create({
      username,
      email,
    });
    return await this.repository.save(usuario);
  }

  // Read by ID
  async buscarPorId(id: number): Promise<UsuarioEntity | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  // Read by username
  async buscarPorUsername(username: string): Promise<UsuarioEntity | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }

  // Read all
  async buscarTodos(): Promise<UsuarioEntity[]> {
    return await this.repository.find();
  }
}
