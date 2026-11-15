
export const PERMISSIONS = {
  STYLES_VIEW: "styles.view",
  STYLES_CREATE: "styles.create",
  STYLES_UPDATE: "styles.update",
  STYLES_DELETE: "styles.delete",

  SIZES_VIEW: "sizes.view",
  SIZES_CREATE: "sizes.create",
  SIZES_UPDATE: "sizes.update",
  SIZES_DELETE: "sizes.delete",

  WORKERS_VIEW: "workers.view",
  WORKERS_CREATE: "workers.create",
  WORKERS_UPDATE: "workers.update",
  WORKERS_DELETE: "workers.delete",

  BUNDLES_VIEW: "bundles.view",
  BUNDLES_CREATE: "bundles.create",
  BUNDLES_UPDATE: "bundles.update",
  BUNDLES_DELETE: "bundles.delete",

  PRODUCTION_VIEW: "production.view",
  PRODUCTION_CREATE: "production.create",
  PRODUCTION_UPDATE: "production.update",
  PRODUCTION_DELETE: "production.delete",

  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_UPDATE: "payments.update",

  ORGANIZATION_VIEW: "organization.view",
  ORGANIZATION_UPDATE: "organization.update",

  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",

  DASHBOARD_VIEW: "dashboard.view",
} as const

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
