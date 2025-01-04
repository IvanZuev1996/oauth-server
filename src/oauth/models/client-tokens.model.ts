import {
  AllowNull,
  AutoIncrement,
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
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  clientId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  accessTokenId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  refreshTokenId: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.INTEGER))
  scope: number[];

  @AllowNull(false)
  @Column(DataType.DATE)
  expiresAt: Date;
}
