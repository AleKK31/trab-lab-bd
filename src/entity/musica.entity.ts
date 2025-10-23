import {
  BaseEntity,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArtistaEntity } from "./artista.entity";

@Entity({ name: "musica" })
@Check("duracao_segundos > 0")
export class MusicaEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "titulo",
    type: "varchar",
    length: 255,
    nullable: false,
  })
  titulo: string;

  @Column({
    name: "duracao_segundos",
    type: "int",
    nullable: false,
  })
  duracaoSegundos: number;

  @Column({
    name: "artista_id",
    type: "int",
    nullable: false,
  })
  artistaId: number;

  @ManyToOne(() => ArtistaEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "artista_id" })
  artista: ArtistaEntity;
}
