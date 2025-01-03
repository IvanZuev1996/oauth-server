import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { RoleModel } from 'src/roles/models/role.model';

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  readonly id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  readonly login: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @ForeignKey(() => RoleModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  roleId: number;

  @BelongsTo(() => RoleModel)
  role: RoleModel;
}
