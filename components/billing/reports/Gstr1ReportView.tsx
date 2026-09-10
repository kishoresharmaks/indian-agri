'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  FileSpreadsheet,
  RefreshCw,
  Printer,
  FileText,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  TrendingUp,
  Boxes,
  HelpCircle,
} from 'lucide-react';
import { Gstr1Data } from '@/lib/gstr1Engine';

export default function Gstr1ReportView() {
  const currentDate = new Date();
  const [filterMode, setFilterMode] = useState<'MONTH' | 'CUSTOM'>('MONTH');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);
  const [reportData, setReportData] = useState<Gstr1Data | null>(null);
  const [activeSheetKey, setActiveSheetKey] = useState<string>('gstr1Report');
  const [error, setError] = useState<string>('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');

      let url = '/api/billing/reports/gstr1?';
      if (filterMode === 'MONTH') {
        url += `month=${selectedMonth}&year=${selectedYear}`;
      } else {
        if (startDate) url += `startDate=${startDate}&`;
        if (endDate) url += `endDate=${endDate}`;
      }

      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setReportData(json.data);
      } else {
        setError(json.message || 'Failed to load GSTR-1 report');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear, filterMode]);

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      let url = '/api/billing/reports/gstr1/export?';
      if (filterMode === 'MONTH') {
        url += `month=${selectedMonth}&year=${selectedYear}`;
      } else {
        if (startDate) url += `startDate=${startDate}&`;
        if (endDate) url += `endDate=${endDate}`;
      }

      // Trigger file download
      const res = await fetch(url);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'GSTR_1_Report.xlsx';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert('Failed to export Excel file: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Sheet definitions matching 16 reference sheets
  const SHEETS = [
    { key: 'gstr1Report', label: '1. GSTR1 Report', icon: '📑', badge: reportData?.sheets.gstr1Report.rows.length || 0 },
    { key: 'b2b', label: '2. b2b,sez,de', icon: '🏢', badge: reportData?.sheets.b2b.rows.length || 0 },
    { key: 'b2cl', label: '3. b2cl', icon: '📦', badge: reportData?.sheets.b2cl.rows.length || 0 },
    { key: 'b2cs', label: '4. b2cs', icon: '🛒', badge: reportData?.sheets.b2cs.rows.length || 0 },
    { key: 'cdnr', label: '5. cdnr', icon: '📝', badge: reportData?.sheets.cdnr.rows.length || 0 },
    { key: 'cdnur', label: '6. cdnur', icon: '📝', badge: reportData?.sheets.cdnur.rows.length || 0 },
    { key: 'exp', label: '7. exp', icon: '🚢', badge: reportData?.sheets.exp.rows.length || 0 },
    { key: 'at', label: '8. at', icon: '💰', badge: reportData?.sheets.at.rows.length || 0 },
    { key: 'atadj', label: '9. atadj', icon: '🔄', badge: reportData?.sheets.atadj.rows.length || 0 },
    { key: 'exemp', label: '10. exemp', icon: '🌿', badge: 4 },
    { key: 'hsnB2b', label: '11. hsn(b2b)', icon: '🏷️', badge: reportData?.sheets.hsnB2b.rows.length || 0 },
    { key: 'hsnB2c', label: '12. hsn(b2c)', icon: '🏷️', badge: reportData?.sheets.hsnB2c.rows.length || 0 },
    { key: 'docs', label: '13. docs', icon: '📄', badge: reportData?.sheets.docs.rows.length || 0 },
    { key: 'itemWiseSale', label: '14. itemWiseSale', icon: '📊', badge: reportData?.sheets.itemWiseSale.rows.length || 0 },
    { key: 'itemWiseSaleReturn', label: '15. itemWiseSaleReturn', icon: '↩️', badge: reportData?.sheets.itemWiseSaleReturn.rows.length || 0 },
    { key: 'itemSummary', label: '16. itemSummary', icon: '📋', badge: reportData?.sheets.itemSummary.rows.length || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter and Action Bar */}
      <div className="bg-white border border-[#E8EDF2] rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterMode('MONTH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'MONTH' ? 'bg-[#163B5C] text-white shadow-xs' : 'text-[#64748B] hover:text-[#163B5C]'
              }`}
            >
              Monthly Period
            </button>
            <button
              onClick={() => setFilterMode('CUSTOM')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'CUSTOM' ? 'bg-[#163B5C] text-white shadow-xs' : 'text-[#64748B] hover:text-[#163B5C]'
              }`}
            >
              Custom Dates
            </button>
          </div>

          {filterMode === 'MONTH' ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-bold text-[#163B5C] focus:outline-hidden focus:ring-2 focus:ring-[#163B5C]/20"
              >
                {[
                  { m: 1, name: 'January' },
                  { m: 2, name: 'February' },
                  { m: 3, name: 'March' },
                  { m: 4, name: 'April' },
                  { m: 5, name: 'May' },
                  { m: 6, name: 'June' },
                  { m: 7, name: 'July' },
                  { m: 8, name: 'August' },
                  { m: 9, name: 'September' },
                  { m: 10, name: 'October' },
                  { m: 11, name: 'November' },
                  { m: 12, name: 'December' },
                ].map((item) => (
                  <option key={item.m} value={item.m}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-bold text-[#163B5C] focus:outline-hidden focus:ring-2 focus:ring-[#163B5C]/20"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#163B5C] focus:outline-hidden"
              />
              <span className="text-xs text-[#64748B] font-bold">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#163B5C] focus:outline-hidden"
              />
              <button
                onClick={fetchReport}
                className="px-3 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#163B5C] rounded-xl text-xs font-bold transition-all"
              >
                Apply
              </button>
            </div>
          )}

          <button
            onClick={fetchReport}
            disabled={loading}
            className="p-2 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#163B5C] hover:bg-[#F8FAFC] transition-all"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ED3500]' : ''}`} />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] transition-all shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#64748B]" />
            Print View
          </button>

          <button
            onClick={handleExportExcel}
            disabled={exporting || loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D8A4E] hover:bg-[#0A7340] text-white text-xs font-extrabold shadow-sm transition-all active:scale-98 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
            {exporting ? 'Generating Excel...' : '📥 Export GSTR-1 Excel (.xlsx)'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Company GSTR-1 Return Header Card */}
      {reportData && (
        <div className="bg-gradient-to-r from-[#163B5C] to-[#1E4D7B] text-white rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-[11px] font-mono tracking-wider font-bold uppercase">
                FORM GSTR-1
              </span>
              <span className="text-white/80 text-xs font-medium">
                Period: <strong className="text-white">{reportData.period.fromMonth} {reportData.period.fromYear}</strong>
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">{reportData.company.legalName}</h2>
            <p className="text-white/75 text-xs">
              GSTIN: <strong className="text-white font-mono">{reportData.company.gstin}</strong> | Place of Supply:{' '}
              <strong className="text-white">{reportData.company.stateName} ({reportData.company.stateCode})</strong>
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-xs px-5 py-3 rounded-xl border border-white/10">
            <div>
              <p className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Total Invoices</p>
              <p className="text-xl font-black">{reportData.summary.totalDocuments}</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Gross Value</p>
              <p className="text-xl font-black">₹{reportData.summary.totalValue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      {reportData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-[#E8EDF2] p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Taxable Value</p>
            <p className="text-lg font-black text-[#163B5C] mt-1">₹{reportData.summary.totalTaxableValue.toLocaleString('en-IN')}</p>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Net Tax Base
            </span>
          </div>

          <div className="bg-white border border-[#E8EDF2] p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Central Tax (CGST)</p>
            <p className="text-lg font-black text-[#163B5C] mt-1">₹{reportData.summary.totalCgst.toLocaleString('en-IN')}</p>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Intra-state
            </span>
          </div>

          <div className="bg-white border border-[#E8EDF2] p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">State Tax (SGST)</p>
            <p className="text-lg font-black text-[#163B5C] mt-1">₹{reportData.summary.totalSgst.toLocaleString('en-IN')}</p>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Intra-state
            </span>
          </div>

          <div className="bg-white border border-[#E8EDF2] p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Integrated Tax (IGST)</p>
            <p className="text-lg font-black text-[#163B5C] mt-1">₹{reportData.summary.totalIgst.toLocaleString('en-IN')}</p>
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Inter-state
            </span>
          </div>

          <div className="bg-white border border-[#E8EDF2] p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Tax</p>
            <p className="text-lg font-black text-[#ED3500] mt-1">
              ₹{(reportData.summary.totalCgst + reportData.summary.totalSgst + reportData.summary.totalIgst).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Output Liability
            </span>
          </div>

          <div className="bg-white border border-[#E8EDF2] p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">B2B vs B2C</p>
            <p className="text-lg font-black text-[#163B5C] mt-1">
              {reportData.summary.b2bInvoicesCount} <span className="text-xs font-normal text-[#94A3B8]">/</span> {reportData.summary.b2cInvoicesCount}
            </p>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">
              Reg / Unreg
            </span>
          </div>
        </div>
      )}

      {/* Multi-Sheet Selector Navigation Bar */}
      <div className="bg-white border border-[#E8EDF2] rounded-2xl p-3 shadow-xs">
        <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-2 py-1 mb-2 flex items-center justify-between">
          <span>Excel Template Sheets Preview (16 Sheets Exact Match)</span>
          <span className="text-[11px] text-[#0D8A4E] font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Reference Template Certified
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {SHEETS.map((sheet) => (
            <button
              key={sheet.key}
              onClick={() => setActiveSheetKey(sheet.key)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSheetKey === sheet.key
                  ? 'bg-[#163B5C] text-white shadow-xs'
                  : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#163B5C] hover:bg-slate-100'
              }`}
            >
              <span>{sheet.icon}</span>
              <span>{sheet.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeSheetKey === sheet.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {sheet.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sheet Table Viewer */}
      {loading ? (
        <div className="bg-white border border-[#E8EDF2] rounded-2xl p-16 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F5] border border-[#ED3500]/20 flex items-center justify-center mx-auto text-[#ED3500]">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-xs font-bold text-[#163B5C] uppercase tracking-wider mt-4">
            Aggregating GSTR-1 Real Data Across 16 Sheets...
          </p>
        </div>
      ) : reportData ? (
        <div className="bg-white border border-[#E8EDF2] rounded-2xl shadow-xs overflow-hidden">
          {/* Active Sheet Header Info */}
          <div className="p-4 border-b border-[#E8EDF2] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#163B5C] flex items-center gap-2">
                <span>{SHEETS.find((s) => s.key === activeSheetKey)?.icon}</span>
                <span>Worksheet: {SHEETS.find((s) => s.key === activeSheetKey)?.label}</span>
              </h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Exact cell structure populated with live e-commerce & billing data
              </p>
            </div>

            <div className="text-xs font-bold text-[#163B5C] bg-white border border-[#CBD5E1] px-3 py-1.5 rounded-lg shadow-2xs">
              Rows: {(reportData.sheets as any)[activeSheetKey]?.rows?.length || 0}
            </div>
          </div>

          {/* Render Active Sheet Table */}
          {renderSheetContent(activeSheetKey, reportData)}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Renders the contents of the chosen sheet
 */
function renderSheetContent(sheetKey: string, data: Gstr1Data) {
  const sheet = (data.sheets as any)[sheetKey];
  if (!sheet) return <div className="p-8 text-center text-xs text-[#64748B]">No sheet data</div>;

  // 1. GSTR1 Report
  if (sheetKey === 'gstr1Report') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#163B5C] text-white">
              {sheet.headers2.map((h: string, idx: number) => (
                <th key={idx} className="p-3 font-bold border-r border-white/10 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EDF2]">
            {sheet.rows.length === 0 ? (
              <tr>
                <td colSpan={sheet.headers2.length} className="p-8 text-center text-[#64748B] font-semibold">
                  No outward supply transactions recorded for this tax period.
                </td>
              </tr>
            ) : (
              sheet.rows.map((row: any[], rIdx: number) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {row.map((val: any, cIdx: number) => (
                    <td
                      key={cIdx}
                      className={`p-2.5 border-r border-[#E8EDF2] whitespace-nowrap ${
                        typeof val === 'number' ? 'text-right font-mono' : ''
                      } ${cIdx === 0 ? 'font-mono text-slate-700' : ''}`}
                    >
                      {typeof val === 'number' ? val.toFixed(2) : String(val || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {sheet.totals && sheet.rows.length > 0 && (
            <tfoot>
              <tr className="bg-[#FFF8F5] font-black text-[#163B5C] border-t-2 border-[#163B5C]">
                {sheet.totals.map((t: any, idx: number) => (
                  <td
                    key={idx}
                    className={`p-3 border-r border-[#E8EDF2] whitespace-nowrap ${
                      typeof t === 'number' ? 'text-right font-mono text-[#ED3500]' : ''
                    }`}
                  >
                    {typeof t === 'number' ? t.toFixed(2) : String(t || '')}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  }

  // 2. Summary Block Render (for b2b, b2cl, b2cs, cdnr, cdnur, hsn, docs, items)
  return (
    <div className="p-4 space-y-4">
      {sheet.summary && (
        <div className="bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(sheet.summary).map(([k, v]: any) => (
            <div key={k} className="bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
              <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider truncate">
                {k.replace(/([A-Z])/g, ' $1')}
              </p>
              <p className="text-sm font-black text-[#163B5C] mt-0.5 font-mono">
                {typeof v === 'number' ? v.toLocaleString('en-IN') : String(v)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto border border-[#E8EDF2] rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#475569] border-b border-[#E8EDF2]">
              {sheet.headers.map((h: string, idx: number) => (
                <th key={idx} className="p-3 font-bold border-r border-[#E8EDF2] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EDF2]">
            {sheet.rows.length === 0 ? (
              <tr>
                <td colSpan={sheet.headers.length} className="p-8 text-center text-[#64748B] font-medium">
                  No records in this section for the selected period.
                </td>
              </tr>
            ) : (
              sheet.rows.map((row: any[], rIdx: number) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {row.map((val: any, cIdx: number) => (
                    <td
                      key={cIdx}
                      className={`p-2.5 border-r border-[#E8EDF2] whitespace-nowrap ${
                        typeof val === 'number' ? 'text-right font-mono' : ''
                      }`}
                    >
                      {typeof val === 'number' ? val.toFixed(2) : String(val || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
