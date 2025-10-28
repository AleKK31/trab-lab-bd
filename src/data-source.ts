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
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
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
