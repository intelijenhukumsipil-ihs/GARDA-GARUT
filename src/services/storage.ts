import { 
  InfraAsset, 
  DamageReport, 
  WorkOrder, 
  BuildingCase, 
  GatewayEndpointStatus, 
  GatewayQueueItem, 
  SecurityEventLog, 
  AuditLog, 
  UserProfile 
} from '../types';

import { 
  INITIAL_USERS, 
  INITIAL_ASSETS, 
  INITIAL_REPORTS, 
  INITIAL_WORK_ORDERS, 
  INITIAL_BUILDING_CASES, 
  INITIAL_GATEWAY_ENDPOINTS, 
  INITIAL_GATEWAY_QUEUE, 
  INITIAL_SECURITY_LOGS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'garda_garut_current_user',
  ASSETS: 'garda_garut_assets',
  REPORTS: 'garda_garut_reports',
  WORK_ORDERS: 'garda_garut_work_orders',
  BUILDING_CASES: 'garda_garut_building_cases',
  GATEWAY_ENDPOINTS: 'garda_garut_gateway_endpoints',
  GATEWAY_QUEUE: 'garda_garut_gateway_queue',
  SECURITY_LOGS: 'garda_garut_security_logs',
  AUDIT_LOGS: 'garda_garut_audit_logs'
};

// Initialize default storage if empty
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSETS)) {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORK_ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(INITIAL_WORK_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BUILDING_CASES)) {
    localStorage.setItem(STORAGE_KEYS.BUILDING_CASES, JSON.stringify(INITIAL_BUILDING_CASES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GATEWAY_ENDPOINTS)) {
    localStorage.setItem(STORAGE_KEYS.GATEWAY_ENDPOINTS, JSON.stringify(INITIAL_GATEWAY_ENDPOINTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GATEWAY_QUEUE)) {
    localStorage.setItem(STORAGE_KEYS.GATEWAY_QUEUE, JSON.stringify(INITIAL_GATEWAY_QUEUE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(INITIAL_SECURITY_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
}

// User Profile
export function getCurrentUser(): UserProfile {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : INITIAL_USERS[0];
}

export function setCurrentUser(user: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  addAuditLog(
    user.name,
    user.role,
    'SYSTEM',
    'GANTI_PERAN_PENGGUNA',
    user.id,
    `Beralih ke peran: ${user.role} (${user.agency})`
  );
}

// Infra Assets
export function getAssets(): InfraAsset[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSETS) || '[]');
}

export function saveAsset(asset: InfraAsset): void {
  const assets = getAssets();
  const index = assets.findIndex(a => a.id === asset.id);
  if (index >= 0) {
    assets[index] = asset;
  } else {
    assets.unshift(asset);
  }
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  const user = getCurrentUser();
  addAuditLog(user.name, user.role, 'GARDA_INFRA', 'SIMPAN_ASET', asset.id, `Simpan data aset: ${asset.name}`);
}

// Reports
export function getReports(): DamageReport[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
}

export function saveReport(report: DamageReport): void {
  const reports = getReports();
  const index = reports.findIndex(r => r.id === report.id);
  if (index >= 0) {
    reports[index] = report;
  } else {
    reports.unshift(report);
  }
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  const user = getCurrentUser();
  addAuditLog(user.name, user.role, 'GARDA_INFRA', 'SIMPAN_LAPORAN', report.id, `Simpan laporan kerusakan untuk: ${report.assetName}`);
}

// Work Orders
export function getWorkOrders(): WorkOrder[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.WORK_ORDERS) || '[]');
}

export function saveWorkOrder(workOrder: WorkOrder): void {
  const orders = getWorkOrders();
  const index = orders.findIndex(o => o.id === workOrder.id);
  if (index >= 0) {
    orders[index] = workOrder;
  } else {
    orders.unshift(workOrder);
  }
  localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(orders));
  const user = getCurrentUser();
  addAuditLog(user.name, user.role, 'GARDA_INFRA', 'SIMPAN_SPK', workOrder.id, `Penerbitan/Pembaruan SPK: ${workOrder.title}`);
}

// Building Cases
export function getBuildingCases(): BuildingCase[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUILDING_CASES) || '[]');
}

export function saveBuildingCase(buildingCase: BuildingCase): void {
  const cases = getBuildingCases();
  const index = cases.findIndex(c => c.id === buildingCase.id);
  if (index >= 0) {
    cases[index] = buildingCase;
  } else {
    cases.unshift(buildingCase);
  }
  localStorage.setItem(STORAGE_KEYS.BUILDING_CASES, JSON.stringify(cases));
  const user = getCurrentUser();
  addAuditLog(user.name, user.role, 'GARDA_BANGUNAN', 'SIMPAN_KASUS_BANGUNAN', buildingCase.id, `Kasus SIMBG: ${buildingCase.simbgReferenceNo} (${buildingCase.buildingName})`);
}

// Gateway Endpoints & Queue
export function getGatewayEndpoints(): GatewayEndpointStatus[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.GATEWAY_ENDPOINTS) || '[]');
}

export function getGatewayQueue(): GatewayQueueItem[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.GATEWAY_QUEUE) || '[]');
}

export function addGatewayQueueItem(item: GatewayQueueItem): void {
  const queue = getGatewayQueue();
  queue.unshift(item);
  localStorage.setItem(STORAGE_KEYS.GATEWAY_QUEUE, JSON.stringify(queue));
}

export function updateGatewayQueueItemStatus(id: string, status: GatewayQueueItem['status'], errorMessage?: string): void {
  const queue = getGatewayQueue();
  const item = queue.find(q => q.id === id);
  if (item) {
    item.status = status;
    item.lastAttemptAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    if (errorMessage) item.errorMessage = errorMessage;
    if (status === 'failed_retrying') item.retryCount += 1;
    localStorage.setItem(STORAGE_KEYS.GATEWAY_QUEUE, JSON.stringify(queue));
  }
}

// Security & Audit Logs
export function getSecurityLogs(): SecurityEventLog[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS) || '[]');
}

export function getAuditLogs(): AuditLog[] {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
}

export function addAuditLog(
  actorName: string,
  actorRole: string,
  module: AuditLog['module'],
  action: string,
  targetRef: string,
  details: string
): void {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actorName,
    actorRole,
    module,
    action,
    targetRef,
    details,
    ipAddress: '103.140.22.18'
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

// Reset data helper
export function resetDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(INITIAL_WORK_ORDERS));
  localStorage.setItem(STORAGE_KEYS.BUILDING_CASES, JSON.stringify(INITIAL_BUILDING_CASES));
  localStorage.setItem(STORAGE_KEYS.GATEWAY_ENDPOINTS, JSON.stringify(INITIAL_GATEWAY_ENDPOINTS));
  localStorage.setItem(STORAGE_KEYS.GATEWAY_QUEUE, JSON.stringify(INITIAL_GATEWAY_QUEUE));
  localStorage.setItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(INITIAL_SECURITY_LOGS));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
}
