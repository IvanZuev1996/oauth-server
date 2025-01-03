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
import { RolesEnum } from 'src/configs/roles';
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
  @Column(DataType.ENUM(...Object.values(RolesEnum)))
  name: RolesEnum;

  @HasMany(() => UserModel)
  users: UserModel[];
}
