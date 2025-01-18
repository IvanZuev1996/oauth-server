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
import { ServiceModel } from './service.model';

@Table({ tableName: 'scopes' })
export class ScopeModel extends Model<ScopeModel> {
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  readonly key: string;

  @AllowNull(false)
  @ForeignKey(() => ServiceModel)
  @Column(DataType.INTEGER)
  readonly serviceId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  requiresApproval: boolean;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  ttl: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isTtlRefreshable: boolean;

  @BelongsTo(() => ServiceModel)
  service: ServiceModel;
}
