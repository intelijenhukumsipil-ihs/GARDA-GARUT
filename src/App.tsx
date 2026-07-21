import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  InfraAsset, 
  DamageReport, 
  WorkOrder, 
  BuildingCase, 
  GatewayEndpointStatus, 
  GatewayQueueItem, 
  SecurityEventLog, 
  AuditLog 
} from './types';

import { 
  initStorage, 
  getCurrentUser, 
  setCurrentUser, 
  getAssets, 
  saveAsset, 
  getReports, 
  saveReport, 
  getWorkOrders, 
  saveWorkOrder, 
  getBuildingCases, 
  saveBuildingCase, 
  getGatewayEndpoints, 
  getGatewayQueue, 
  getSecurityLogs, 
  getAuditLogs, 
  updateGatewayQueueItemStatus 
} from './services/storage';

import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { GatewayDashboard } from './components/Gateway/GatewayDashboard';
import { InfraModule } from './components/Infra/InfraModule';
import { BangunanModule } from './components/Bangunan/BangunanModule';
import { InteractiveMap } from './components/Map/InteractiveMap';
import { QRManager } from './components/QR/QRManager';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { AuditTrailView } from './components/Audit/AuditTrailView';
import { TechnicalSpecDoc } from './components/Docs/TechnicalSpecDoc';
import { QuickSearchModal } from './components/Search/QuickSearchModal';
import { GardaMascot } from './components/Mascot/GardaMascot';

export default function App() {
  const [currentUser, setCurrentUserProfile] = useState<UserProfile>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // App States
  const [assets, setAssets] = useState<InfraAsset[]>([]);
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [buildingCases, setBuildingCases] = useState<BuildingCase[]>([]);
  const [endpoints, setEndpoints] = useState<GatewayEndpointStatus[]>([]);
  const [queue, setQueue] = useState<GatewayQueueItem[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityEventLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load Data on Mount
  useEffect(() => {
    initStorage();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setCurrentUserProfile(getCurrentUser());
    setAssets(getAssets());
    setReports(getReports());
    setWorkOrders(getWorkOrders());
    setBuildingCases(getBuildingCases());
    setEndpoints(getGatewayEndpoints());
    setQueue(getGatewayQueue());
    setSecurityLogs(getSecurityLogs());
    setAuditLogs(getAuditLogs());
  };

  // User Role Switcher Handler
  const handleRoleChange = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    setCurrentUserProfile(newUser);
    setAuditLogs(getAuditLogs());
  };

  // Infra Handlers
  const handleSaveReport = (newReport: DamageReport) => {
    saveReport(newReport);
    refreshAllData();
  };

  const handleSaveWorkOrder = (newWorkOrder: WorkOrder) => {
    saveWorkOrder(newWorkOrder);
    refreshAllData();
  };

  const handleUpdateAssetCondition = (assetId: string, newCondition: InfraAsset['condition']) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      const updated = { ...asset, condition: newCondition, lastMaintenanceDate: new Date().toISOString().split('T')[0] };
      saveAsset(updated);
      refreshAllData();
    }
  };

  // Bangunan Handler
  const handleSaveBuildingCase = (newCase: BuildingCase) => {
    saveBuildingCase(newCase);
    refreshAllData();
  };

  // Gateway Retry Handler
  const handleRetryQueueItem = (id: string) => {
    updateGatewayQueueItemStatus(id, 'completed');
    refreshAllData();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenQuickSearch={() => setIsSearchOpen(true)}
        onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reportCount={reports.length}
          caseCount={buildingCases.length}
          queueCount={queue.filter(q => q.status !== 'completed').length}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Content View Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <OverviewDashboard
              currentUser={currentUser}
              assets={assets}
              reports={reports}
              workOrders={workOrders}
              buildingCases={buildingCases}
              endpoints={endpoints}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'gateway' && (
            <GatewayDashboard
              endpoints={endpoints}
              queue={queue}
              securityLogs={securityLogs}
              onRetryQueueItem={handleRetryQueueItem}
            />
          )}

          {activeTab === 'infra' && (
            <InfraModule
              currentUser={currentUser}
              assets={assets}
              reports={reports}
              workOrders={workOrders}
              onSaveReport={handleSaveReport}
              onSaveWorkOrder={handleSaveWorkOrder}
              onUpdateAssetCondition={handleUpdateAssetCondition}
            />
          )}

          {activeTab === 'bangunan' && (
            <BangunanModule
              currentUser={currentUser}
              buildingCases={buildingCases}
              onSaveBuildingCase={handleSaveBuildingCase}
            />
          )}

          {activeTab === 'map' && (
            <InteractiveMap
              assets={assets}
              buildingCases={buildingCases}
              reports={reports}
            />
          )}

          {activeTab === 'qr' && (
            <QRManager
              assets={assets}
              buildingCases={buildingCases}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAnalytics
              assets={assets}
              buildingCases={buildingCases}
              reports={reports}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTrailView
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'spec' && (
            <TechnicalSpecDoc />
          )}

        </main>

      </div>

      {/* Footer Moto */}
      <footer className="py-3 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-center px-6 sm:px-8 text-[11px] justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-emerald-400 font-black italic">"Layanan Cerdas, Data Terjaga, Garut Lebih Maju"</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-300 font-semibold">Pemilik & Pengembang Inovasi: Ir. Risa Kristalia N., ST., MT.</span>
        </div>
        <div className="text-slate-400 font-bold uppercase flex items-center space-x-3">
          <span className="text-emerald-400 font-mono">WhatsApp Server: +62 813-1640-3160</span>
          <span>|</span>
          <span>© 2026 Dinas PUPR Kab. Garut</span>
        </div>
      </footer>

      {/* Floating Interactive Mascot Si GARDA */}
      <GardaMascot onNavigateTab={(tab) => setActiveTab(tab as any)} />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        buildingCases={buildingCases}
        workOrders={workOrders}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

    </div>
  );
}

