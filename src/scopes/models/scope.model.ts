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
import { ServiceModel } from './service.model';

@Table({ tableName: 'scopes' })
export class ScopeModel extends Model<ScopeModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

  @AllowNull(false)
  @ForeignKey(() => ServiceModel)
  @Column(DataType.STRING)
  readonly serviceId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  readonly key: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  requires_approval: boolean;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  ttl: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isTtlRefreshable: boolean;
}
