import "reflect-metadata";
import { DataSource } from "typeorm";
import { ArtistaEntity } from "./entity/artista.entity";
import { MusicaEntity } from "./entity/musica.entity";
import { PlaylistEntity } from "./entity/playlist.entity";
import { UsuarioEntity } from "./entity/usuario.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: false,
  entities: [ArtistaEntity, MusicaEntity, UsuarioEntity, PlaylistEntity],
  migrations: [],
  subscribers: [],
});
