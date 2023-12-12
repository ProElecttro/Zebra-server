import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'bytea' })
  fileData: Buffer;

}

export default User;