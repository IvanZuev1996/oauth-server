export type Scope = {
  [serviceKey: string]: {
    [scopeKey: string]: {
      title: string;
      requiresApproval: boolean;
      ttl: number;
      isTtlRefreshable: boolean;
    };
  };
};

export enum ScopeStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}
