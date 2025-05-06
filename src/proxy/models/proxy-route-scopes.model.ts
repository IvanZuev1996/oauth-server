import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { ProxyRouteModel } from './proxy-routes.model';
import { ScopeModel } from 'src/scopes/models/scope.model';

@Table({
  tableName: 'proxy-route-scopes',
})
export class ProxyRouteScopeModel extends Model<ProxyRouteScopeModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

  @ForeignKey(() => ProxyRouteModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  routeId: number;

  @ForeignKey(() => ScopeModel)
  @AllowNull(false)
  @Column(DataType.STRING)
  scopeKey: string;

  @BelongsTo(() => ProxyRouteModel, { onDelete: 'CASCADE' })
  route: ProxyRouteModel;

  @BelongsTo(() => ScopeModel, { onDelete: 'CASCADE' })
  scope: ScopeModel;
}
