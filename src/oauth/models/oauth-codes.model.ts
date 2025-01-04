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
  tableName: 'oauth-codes',
})
export class OAuthCodesModel extends Model<OAuthCodesModel> {
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
  code: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  redirectUri: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.INTEGER))
  scope: number[];

  @AllowNull(false)
  @Column(DataType.DATE)
  expiresAt: Date;
}
