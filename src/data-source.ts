import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { ArtistaEntity } from "./entity/artista.entity";
import { MusicaEntity } from "./entity/musica.entity";
import { MusicaPlaylistEntity } from "./entity/musicaPlaylist.entity";
import { PlaylistEntity } from "./entity/playlist.entity";
import { UsuarioEntity } from "./entity/usuario.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: [
    ArtistaEntity,
    MusicaEntity,
    UsuarioEntity,
    PlaylistEntity,
    MusicaPlaylistEntity,
  ],
  migrations: [],
  subscribers: [],
});
