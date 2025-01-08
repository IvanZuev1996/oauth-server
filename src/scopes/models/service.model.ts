import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({ tableName: 'services' })
export class ServiceModel extends Model<ServiceModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  readonly name: string;
}
