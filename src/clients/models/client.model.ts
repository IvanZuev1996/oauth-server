import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { UserModel } from 'src/users/models/user.model';

@Table({ tableName: 'clients' })
export class ClientModel extends Model<ClientModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  readonly userId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  readonly clientId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  clientSecret: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  redirectUri: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  companyEmail: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.INTEGER))
  scope: number[];

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  img: string;
}
