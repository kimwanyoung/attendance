import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { GenderEnum } from "../const/gender.enum";

@Entity()
export class UserEntity {
  /*
    - name
    - age
    - gender
    - email
    - password
    - phoneNumber
  */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  age: number;

  @Column({
    type: 'enum',
    enum: GenderEnum,
  })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  phone: string;
}
