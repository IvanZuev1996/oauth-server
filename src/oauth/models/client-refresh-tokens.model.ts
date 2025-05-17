import {
  AllowNull,
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
import { ClientModel } from 'src/clients/models/client.model';
import { UserModel } from 'src/users/models/user.model';

@Table({
  tableName: 'client-refresh-tokens',
})
export class ClientRefreshTokensModel extends Model<ClientRefreshTokensModel> {
  @PrimaryKey
  @Unique
  @Column(DataType.STRING)
  tokenId: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId: number;

  @ForeignKey(() => ClientModel)
  @AllowNull(false)
  @Column(DataType.STRING)
  clientId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  scope: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isRevoked: boolean;

  @AllowNull(false)
  @Column(DataType.DATE)
  expiresAt: Date;

  /* Relationships */

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => ClientModel)
  client: ClientModel;
}
