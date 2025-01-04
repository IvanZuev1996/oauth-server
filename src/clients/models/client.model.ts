import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({ tableName: 'clients' })
export class ClientModel extends Model<ClientModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

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

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  description: string;
}
