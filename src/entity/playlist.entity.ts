import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UsuarioEntity } from "./usuario.entity";

@Entity({ name: "playlist" })
export class PlaylistEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "playlist_id" })
  playlistId: number;

  @PrimaryColumn({ name: "usuario_id" })
  usuarioId: number;

  @Column({
    name: "nome",
    type: "varchar",
    length: 255,
    nullable: false,
  })
  nome: string;

  @Column({
    name: "data_criacao",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  dataCriacao: Date;

  @ManyToOne(() => UsuarioEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "usuario_id" })
  usuario: UsuarioEntity;
}
