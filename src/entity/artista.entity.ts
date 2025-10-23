import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "artista" })
export class artista {
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
}
