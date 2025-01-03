import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { UserModel } from 'src/users/model/user.model';

@Table({ tableName: 'roles', timestamps: false })
export class RoleModel extends Model<RoleModel> {
  @Unique
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  readonly id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @HasMany(() => UserModel)
  users: UserModel[];
}
