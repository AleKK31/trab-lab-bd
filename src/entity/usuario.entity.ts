import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "usuario" })
export class UsuarioEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "username",
    type: "varchar",
    length: 255,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    name: "email",
    type: "varchar",
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;
}
