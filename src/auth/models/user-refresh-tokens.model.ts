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
import { TokensCreationAttributes } from '../interfaces';
import { UserModel } from 'src/users/models/user.model';

@Table({
  tableName: 'user-refresh-tokens',
})
export class UserRefreshTokenModel extends Model<
  UserRefreshTokenModel,
  TokensCreationAttributes
> {
  @PrimaryKey
  @Unique
  @Column(DataType.STRING)
  readonly tokenId: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId: number;
}
