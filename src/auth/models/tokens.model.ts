import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { TokensCreationAttributes } from '../interfaces';

@Table({
  tableName: 'user-refresh-tokens',
  timestamps: false,
})
export class RefreshTokenModel extends Model<
  RefreshTokenModel,
  TokensCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  readonly token_id: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;
}
