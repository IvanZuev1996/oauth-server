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

@Table({
  tableName: 'oauth-codes',
})
export class OAuthCodesModel extends Model<OAuthCodesModel> {
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
  code: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  codeChallenge: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  redirectUri: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  scope: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  expiresAt: Date;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  state: string;
}
