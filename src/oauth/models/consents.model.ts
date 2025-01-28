import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
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
  tableName: 'consents',
})
export class ConsentsModel extends Model<ConsentsModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

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

  /* Relationships */

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => ClientModel)
  client: ClientModel;
}
