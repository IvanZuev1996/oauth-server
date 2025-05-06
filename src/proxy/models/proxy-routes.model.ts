import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { ProxyRouteScopeModel } from './proxy-route-scopes.model';
import { RestMethods } from 'src/types';

@Table({
  tableName: 'proxy-routes',
})
export class ProxyRouteModel extends Model<ProxyRouteModel> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  readonly id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'))
  method: RestMethods;

  @AllowNull(false)
  @Column(DataType.STRING)
  externalPath: string;

  @HasMany(() => ProxyRouteScopeModel)
  scopes: ProxyRouteScopeModel[];
}
