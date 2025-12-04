import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MusicaEntity } from "./musica.entity";

@Entity({ name: "artista" })
export class ArtistaEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "nome",
    type: "varchar",
    length: 255,
    nullable: false,
    unique: true,
  })
  nome: string;

  @Column({
    name: "nacionalidade",
    type: "varchar",
    length: 100,
  })
  nacionalidade: string;

  @OneToMany(() => MusicaEntity, (musica) => musica.artista)
  musicas: MusicaEntity[];
}
