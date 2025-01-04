import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { ClientModel } from 'src/clients/models/client.model';
import { UserModel } from 'src/users/models/user.model';

@Table({
  tableName: 'client-tokens',
})
export class ClientTokensModel extends Model<ClientTokensModel> {
  @PrimaryKey
  @Unique
  @Column(DataType.STRING)
  readonly id: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId: number;

  @ForeignKey(() => ClientModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  clientId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  accessToken: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  refreshToken: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.INTEGER))
  scope: number[];

  @AllowNull(false)
  @Column(DataType.DATE)
  expiresAt: Date;
}
