'use client';

import React, { useState } from 'react';
import PnLReportView from './PnLReportView';
import Gstr1ReportView from './Gstr1ReportView';

export default function ReportsTabContainer() {
  const [activeReport, setActiveReport] = useState<'PNL' | 'GST'>('PNL');

  return (
    <div className="space-y-6">
      {/* Report Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EDF2] pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'PNL', label: '📊 Profit & Loss (P&L) Statement' },
          { id: 'GST', label: '📑 GSTR-1 Tax Return & Excel Export' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeReport === tab.id
                ? 'bg-[#163B5C] text-white shadow-xs'
                : 'bg-white border border-[#E8EDF2] text-[#64748B] hover:text-[#163B5C] hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.id === 'GST' && (
              <span className="px-1.5 py-0.2 rounded-md bg-[#0D8A4E] text-white text-[10px] font-bold">
                16 Sheets
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Report View */}
      {activeReport === 'PNL' && <PnLReportView />}
      {activeReport === 'GST' && <Gstr1ReportView />}
    </div>
  );
}
