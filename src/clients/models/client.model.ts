import {
  AllowNull,
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
import { ClientScopesOptions, ClientStatus } from '../interfaces';

@Table({ tableName: 'clients' })
export class ClientModel extends Model<ClientModel> {
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  readonly clientId: string;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

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
  @Column(DataType.ARRAY(DataType.STRING))
  scopes: string[];

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  img: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.JSONB)
  scopesOptions: ClientScopesOptions;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isBanned: boolean;

  @AllowNull(false)
  @Default(ClientStatus.PENDING)
  @Column(DataType.ENUM(...Object.values(ClientStatus)))
  status: ClientStatus;
}
