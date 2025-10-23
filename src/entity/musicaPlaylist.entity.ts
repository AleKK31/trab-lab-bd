import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from "typeorm";
import { MusicaEntity } from "./musica.entity";
import { PlaylistEntity } from "./playlist.entity";

@Entity({ name: "musica_playlist" })
@Unique(["playlistId", "usuarioId", "ordemNaPlaylist"])
export class MusicaPlaylistEntity extends BaseEntity {
  @PrimaryColumn({ name: "musica_id" })
  musicaId: number;

  @PrimaryColumn({ name: "playlist_id" })
  playlistId: number;

  @PrimaryColumn({ name: "usuario_id" })
  usuarioId: number;

  @Column({
    name: "ordem_na_playlist",
    type: "int",
    nullable: false,
  })
  ordemNaPlaylist: number;

  @ManyToOne(() => MusicaEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "musica_id" })
  musica: MusicaEntity;

  @ManyToOne(() => PlaylistEntity, { onDelete: "CASCADE" })
  @JoinColumn([
    { name: "playlist_id", referencedColumnName: "playlistId" },
    { name: "usuario_id", referencedColumnName: "usuarioId" },
  ])
  playlist: PlaylistEntity;
}
