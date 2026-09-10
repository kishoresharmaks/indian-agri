'use client';

import React, { useState } from 'react';
import { X, Printer, Share2 } from 'lucide-react';
import { getCompanyConfig, numberToWords } from '@/lib/companyConfig';

interface PrintableDocumentModalProps {
  document?: any;
  doc?: any;
  onClose: () => void;
}

export default function PrintableDocumentModal({
  document: documentProp,
  doc: docProp,
  onClose,
}: PrintableDocumentModalProps) {
  const doc = documentProp || docProp;
  const company = getCompanyConfig();

  const [printMode, setPrintMode] = useState<'A4' | 'THERMAL'>('A4');

  const handlePrint = () => {
    window.print();
  };

  // Determine Exact Title matching PDF templates
  const getDocumentTitle = () => {
    if (!doc?.docType && !doc?.orderType && !doc?.paymentType) return 'Tax Invoice';
    const type = (doc.docType || doc.paymentType || doc.orderType || '').toUpperCase();
    if (type.includes('ESTIMATE') || type.includes('QUOTATION')) return 'Estimate';
    if (type.includes('PAYMENT_IN') || type.includes('PAYMENT_RECEIVED')) return 'Payment-In';
    if (type.includes('PAYMENT_OUT') || type.includes('PAYMENT_PAID')) return 'Payment-Out';
    if (type.includes('CREDIT_NOTE')) return 'Credit Note';
    if (type.includes('PURCHASE_ORDER')) return 'Purchase Order';
    if (type.includes('PURCHASE')) return 'Purchase Invoice';
    if (type.includes('POS')) return 'Tax Invoice';
    return 'Tax Invoice';
  };

  const docTitle = getDocumentTitle();

  const formatCur = (val: number | string | undefined | null) => {
    const num = Number(val || 0);
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const grandTotalNum = Number(doc?.grandTotal || doc?.totalAmount || doc?.amount || 0);
  const totalGstNum = Number(doc?.totalGst !== undefined ? doc.totalGst : 0);
  const subtotalNum = Number(doc?.subtotal !== undefined ? doc.subtotal : (grandTotalNum - totalGstNum));
  const discountNum = Number(doc?.discountAmount || doc?.discount || 0);

  const paidAmountNum = Number(
    doc?.paidAmount !== undefined
      ? doc.paidAmount
      : doc?.received !== undefined
      ? doc.received
      : (doc?.paymentStatus === 'PAID' || doc?.paymentStatus === 'COMPLETED' ? grandTotalNum : 0)
  );

  const balanceNum = Number(
    doc?.balanceAmount !== undefined
      ? doc.balanceAmount
      : Math.max(0, grandTotalNum - paidAmountNum)
  );

  const clientName = doc?.customerName || doc?.vendorName || doc?.partyName || doc?.partyId?.name || 'Walk-in Customer';
  const clientPhone = doc?.customerPhone || doc?.vendorPhone || doc?.partyPhone || doc?.partyId?.phone || '';
  const clientAddress = doc?.shippingAddress || doc?.billingAddress || doc?.partyId?.address || '';
  const clientGstin = doc?.partyId?.gstin || doc?.gstin || '';
  const clientState = doc?.partyId?.state || doc?.state || company.state;

  const isInterState = Boolean(
    doc?.isInterState ||
    (clientState && company.state && clientState.toLowerCase().replace(/[^a-z]/g, '') !== company.state.toLowerCase().replace(/[^a-z]/g, ''))
  );

  const docDate = new Date(doc?.createdAt || doc?.date || Date.now());
  const docDateStr = docDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const docTimeStr = docDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const getWhatsappText = () => {
    let msg = `*${company.name}*\n`;
    msg += `Document: *${docTitle}*\n`;
    msg += `Doc No: *${doc?.docNumber || doc?.invoiceNumber || doc?.orderId || doc?.referenceNo || '1'}*\n`;
    msg += `Date: ${docDateStr}\n`;
    msg += `Party: ${clientName}\n`;
    msg += `--------------------------------\n`;
    doc?.items?.forEach((i: any, idx: number) => {
      const q = Number(i.quantity || i.qty || 1);
      const p = Number(i.price || i.purchasePrice || i.rate || 0);
      const t = Number(i.lineTotal || i.total || q * p);
      msg += `${idx + 1}. ${i.name || i.productName}${i.variantName ? ` (${i.variantName})` : ''} x ${q} = ${formatCur(t)}\n`;
    });
    msg += `--------------------------------\n`;
    msg += `Subtotal: ${formatCur(subtotalNum)}\n`;
    msg += `GST: ${formatCur(totalGstNum)}\n`;
    msg += `*Grand Total: ${formatCur(grandTotalNum)}*\n`;
    msg += `Balance Due: ${formatCur(balanceNum)}\n`;
    msg += `Payment Status: ${doc?.paymentStatus || (balanceNum <= 0 ? 'PAID' : 'PENDING')}\n`;
    msg += `Thank you for doing business with us! 🌿🌾`;
    return encodeURIComponent(msg);
  };

  return (
    <div id="printable-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-hidden print:p-0 print:bg-white print:overflow-visible">
      {/* Exact PDF / Thermal Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: ${printMode === 'THERMAL' ? '80mm auto' : 'A4 portrait'};
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            width: ${printMode === 'THERMAL' ? '80mm' : '100%'} !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
          }

          /* HIDE ALL BACKGROUND PAGE CONTENT */
          body * {
            visibility: hidden !important;
          }

          /* UN-STYLE MODAL PARENT CONTAINERS SO THEY DON'T CLIP */
          #printable-modal-backdrop,
          #printable-modal-dialog,
          #printable-modal-canvas {
            visibility: visible !important;
            position: static !important;
            display: block !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            max-height: none !important;
            height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            inset: auto !important;
          }

          /* UNHIDE PRINTABLE DOCUMENT & ALL ITS CHILDREN */
          #printable-document-area,
          #printable-document-area * {
            visibility: visible !important;
          }

          /* POSITION PRINT TEMPLATE AT TOP OF PAGE 1 */
          #printable-document-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            display: block !important;
            width: ${printMode === 'THERMAL' ? '80mm' : '100%'} !important;
            max-width: ${printMode === 'THERMAL' ? '80mm' : '100%'} !important;
            padding: ${printMode === 'THERMAL' ? '3mm 4mm' : '12mm 15mm'} !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            font-family: ${printMode === 'THERMAL' ? "Courier, 'Courier New', monospace" : 'Arial, Helvetica, sans-serif'} !important;
            font-size: ${printMode === 'THERMAL' ? '11px' : '12px'} !important;
            line-height: ${printMode === 'THERMAL' ? '1.3' : '1.4'} !important;
            z-index: 99999999 !important;
          }

          .print-control-bar,
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
          }

          .pdf-print-flex {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
          }
          .pdf-print-grid {
            display: flex !important;
            justify-content: space-between !important;
          }
          .pdf-header-bg {
            background-color: #8F8DF5 !important;
            color: #ffffff !important;
          }
        }
      `}</style>

      <div id="printable-modal-dialog" className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col border border-[#E8EDF2] shadow-2xl relative print:border-none print:shadow-none print:p-0 print:my-0 print:max-w-full print:max-h-none overflow-hidden">
        {/* Sticky Control Bar */}
        <div className="print-control-bar p-4 sm:p-5 border-b border-[#E8EDF2] flex items-center justify-between shrink-0 bg-white print:hidden z-10 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8F8DF5]/15 text-[#7B78ED] flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#163B5C]">
                {docTitle} — {doc?.docNumber || doc?.invoiceNumber || doc?.orderId || doc?.referenceNo}
              </h3>
              <p className="text-xs text-[#64748B]">
                {printMode === 'THERMAL' ? 'Thermal 80mm POS Receipt Slip' : 'Formal A4 Tax Invoice / PDF Template'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintMode(printMode === 'A4' ? 'THERMAL' : 'A4')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                printMode === 'THERMAL'
                  ? 'bg-[#163B5C] text-white border-[#163B5C]'
                  : 'border-[#E8EDF2] text-[#163B5C] hover:bg-gray-50'
              }`}
            >
              Format: {printMode === 'A4' ? '📄 A4 Format' : '🧾 Thermal 80mm'}
            </button>
            <a
              href={`https://wa.me/91${clientPhone}?text=${getWhatsappText()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-[#7B78ED] hover:bg-[#6865D8] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#7B78ED]/20"
            >
              <Printer className="w-3.5 h-3.5" /> {printMode === 'THERMAL' ? 'Print 80mm Slip' : 'Print PDF'}
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-[#64748B]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div id="printable-modal-canvas" className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70 print:p-0 print:bg-white print:overflow-visible">

          <div
            id="printable-document-area"
            className={
              printMode === 'THERMAL'
                ? 'bg-white p-4 sm:p-5 rounded-2xl border border-gray-300 shadow-xl text-black font-mono max-w-[360px] mx-auto print:border-none print:shadow-none print:p-0 print:max-w-full'
                : 'bg-white p-8 sm:p-10 rounded-xl border border-gray-200 shadow-md text-slate-800 space-y-5 max-w-3xl mx-auto text-xs sm:text-sm font-sans print:border-none print:shadow-none print:p-0 print:max-w-full'
            }
          >
            {printMode === 'THERMAL' ? (
              /* ========================================================================= */
              /* DEDICATED 80MM THERMAL RECEIPT LAYOUT                                     */
              /* ========================================================================= */
              <div className="space-y-3 text-black">
                {/* 1. Brand Header */}
                <div className="text-center pb-3 border-b border-dashed border-gray-400">
                  {company.logoUrl && (
                    <div className="flex justify-center mb-1.5">
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-12 h-12 object-contain rounded-full border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <h2 className="font-extrabold text-sm uppercase tracking-tight text-black leading-tight">
                    {company.name}
                  </h2>
                  {company.owner && (
                    <p className="text-[10px] font-semibold text-gray-700">{company.owner}</p>
                  )}
                  <p className="text-[9.5px] text-gray-600 leading-tight mt-0.5 max-w-[280px] mx-auto">
                    {company.address}
                  </p>
                  <div className="text-[9px] text-gray-600 mt-1 space-y-0.5">
                    <div><strong>FSSAI:</strong> {company.fssai} | <strong>IEC:</strong> {company.iec}</div>
                    <div><strong>GSTIN:</strong> {company.gstin} | <strong>State:</strong> {company.state}</div>
                    <div><strong>Ph:</strong> {company.phone} | <strong>Email:</strong> {company.email}</div>
                    {company.certifications && (
                      <div className="font-semibold text-gray-700 text-[8.5px]">{company.certifications}</div>
                    )}
                  </div>

                  {/* Document Title Badge */}
                  <div className="mt-2.5">
                    <span className="inline-block px-3 py-0.5 bg-black text-white font-bold text-[11px] uppercase tracking-wider rounded">
                      {docTitle}
                    </span>
                  </div>
                </div>

                {/* 2. Metadata & Client Info */}
                <div className="py-2.5 border-b border-dashed border-gray-400 text-[10.5px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">{docTitle} No:</span>
                    <span className="font-bold font-mono">{doc?.docNumber || doc?.invoiceNumber || doc?.orderId || doc?.referenceNo || '1'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Date & Time:</span>
                    <span className="font-mono">{docDateStr} {docTimeStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Place of Supply:</span>
                    <span>{clientState}</span>
                  </div>
                  {doc?.poNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">PO Number:</span>
                      <span className="font-mono">{doc.poNumber}</span>
                    </div>
                  )}

                  {/* Party Details */}
                  <div className="pt-2 mt-1 border-t border-dotted border-gray-300 space-y-0.5">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 font-medium">
                        {docTitle.includes('Payment-In') || docTitle.includes('Receipt') ? 'Received From:' : 'Bill To:'}
                      </span>
                      <span className="font-bold text-right uppercase max-w-[200px] break-words">{clientName}</span>
                    </div>
                    {clientPhone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-mono">{clientPhone}</span>
                      </div>
                    )}
                    {clientGstin && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">GSTIN:</span>
                        <span className="font-mono font-semibold">{clientGstin}</span>
                      </div>
                    )}
                    {clientAddress && (
                      <div className="text-[9.5px] text-gray-500 text-left pt-0.5 leading-tight">
                        {clientAddress}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Items List */}
                <div className="py-2.5 border-b border-dashed border-gray-400">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-800 pb-1 mb-2 border-b border-gray-300">
                    <span>ITEM / DESCRIPTION</span>
                    <span className="text-right">AMOUNT</span>
                  </div>

                  <div className="space-y-2.5">
                    {doc?.items && doc.items.length > 0 ? (
                      doc.items.map((item: any, idx: number) => {
                        const qty = Number(item.quantity || item.qty || 1);
                        const unitPrice = Number(item.price || item.purchasePrice || item.rate || 0);
                        const gstPct = item.gst !== undefined ? Number(item.gst) : item.gstRate !== undefined ? Number(item.gstRate) : item.gstPercent !== undefined ? Number(item.gstPercent) : 5.0;
                        const lineSubtotal = Number(item.lineSubtotal || (qty * unitPrice));
                        const gstVal = Number(item.lineGst !== undefined ? item.lineGst : item.gstAmount !== undefined ? item.gstAmount : ((lineSubtotal * gstPct) / 100));
                        const lineAmt = Number(item.lineTotal || item.total || (lineSubtotal + gstVal));
                        const hsn = item.hsnCode || item.hsn || '08041030';
                        const unit = item.unit || 'Kg';
                        const itemName = item.name || item.productName || 'Organic Item';
                        const variant = item.variantName || item.variant || '';

                        return (
                          <div key={idx} className="border-b border-dotted border-gray-200 pb-2 last:border-b-0 last:pb-0">
                            {/* Row 1: Item Name & Line Total */}
                            <div className="flex justify-between items-start gap-2">
                              <div className="font-bold text-slate-900 text-[11px] leading-snug">
                                <span>{idx + 1}. {itemName}</span>
                                {variant && <span className="text-slate-600 font-normal ml-1">({variant})</span>}
                              </div>
                              <div className="font-black font-mono text-[11.5px] text-black whitespace-nowrap text-right">
                                {formatCur(lineAmt)}
                              </div>
                            </div>

                            {/* Row 2: HSN & Quantity x Rate */}
                            <div className="flex justify-between items-center text-[10px] text-gray-600 mt-0.5 font-mono">
                              <span>HSN: {hsn}</span>
                              <span>{qty} {unit} × {formatCur(unitPrice)}</span>
                            </div>

                            {/* Row 3: Taxable & GST Breakdown */}
                            <div className="flex justify-between items-center text-[9px] text-gray-500 mt-0.5">
                              <span>Taxable: {formatCur(lineSubtotal)}</span>
                              <span>GST ({gstPct}%): {formatCur(gstVal)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-2 text-center text-gray-400 italic text-[11px]">
                        No line items recorded.
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Financial Totals & Tax Breakdown */}
                <div className="py-2.5 border-b border-dashed border-gray-400 text-[11px] space-y-1">
                  <div className="flex justify-between text-gray-700">
                    <span>Total Quantity:</span>
                    <span className="font-bold font-mono">
                      {doc?.items?.reduce((acc: number, i: any) => acc + Number(i.quantity || i.qty || 1), 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-medium">{formatCur(subtotalNum)}</span>
                  </div>

                  {/* GST Breakdown */}
                  {isInterState ? (
                    <div className="flex justify-between text-gray-600 text-[10px]">
                      <span>IGST (5%):</span>
                      <span className="font-mono">{formatCur(totalGstNum)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-gray-600 text-[10px]">
                        <span>CGST (2.5%):</span>
                        <span className="font-mono">{formatCur(totalGstNum / 2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-[10px]">
                        <span>SGST (2.5%):</span>
                        <span className="font-mono">{formatCur(totalGstNum / 2)}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Total Tax (GST):</span>
                    <span className="font-mono font-medium">{formatCur(totalGstNum)}</span>
                  </div>

                  {discountNum > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount Applied:</span>
                      <span className="font-mono">-{formatCur(discountNum)}</span>
                    </div>
                  )}

                  {/* Final Grand Total Banner */}
                  <div className="pt-2 mt-1.5 border-t-2 border-black flex justify-between items-center text-black">
                    <span className="text-xs font-black uppercase tracking-wide">GRAND TOTAL:</span>
                    <span className="text-base font-black font-mono">{formatCur(grandTotalNum)}</span>
                  </div>
                </div>

                {/* 5. Amount in Words & Settlement */}
                <div className="py-2.5 border-b border-dashed border-gray-400 text-[10px] space-y-1.5">
                  <div>
                    <span className="text-gray-500 uppercase text-[9px] block">Amount In Words:</span>
                    <p className="font-bold italic text-slate-800 leading-tight">
                      {numberToWords(grandTotalNum)}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-dotted border-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Mode:</span>
                      <span className="font-bold uppercase">{doc?.paymentMethod || doc?.paymentMode || 'CASH'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-mono font-semibold">{formatCur(paidAmountNum)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balance Due:</span>
                      <span className={`font-mono font-bold ${balanceNum > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {formatCur(balanceNum)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Bank Details */}
                {company.bankAccountNo && (
                  <div className="py-2 border-b border-dashed border-gray-400 text-[9.5px] space-y-0.5">
                    <span className="font-bold text-gray-700 uppercase text-[9px] block">Bank Details for Direct Transfer:</span>
                    <div className="flex justify-between"><span className="text-gray-600">Bank Name:</span><span className="font-medium">{company.bankName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Account No:</span><span className="font-mono font-bold">{company.bankAccountNo}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">IFSC Code:</span><span className="font-mono font-bold">{company.bankIfsc}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Holder:</span><span className="font-medium">{company.bankHolder}</span></div>
                    {company.upiId && (
                      <div className="flex justify-between"><span className="text-gray-600">UPI ID:</span><span className="font-mono">{company.upiId}</span></div>
                    )}
                  </div>
                )}

                {/* 7. Footer Signoff */}
                <div className="pt-2 text-center text-[9.5px] text-gray-600 space-y-1">
                  <p className="font-medium">Thank you for doing business with us!</p>
                  <p className="text-[8.5px] text-gray-500">100% Pure Organic & Certified Agricultural Produce</p>
                  <div className="pt-2 mt-2 border-t border-dashed border-gray-300 flex justify-between items-end">
                    <div className="text-left text-[8.5px] text-gray-500">
                      <p>E. & O.E.</p>
                      <p>Goods once sold are not returnable</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black text-[9px]">For {company.name}</p>
                      <div className="mt-3.5 border-t border-gray-400 pt-0.5 text-[8px] font-semibold text-gray-700">
                        Authorized Signatory
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* CLASSIC FORMAL A4 TAX INVOICE / ESTIMATE LAYOUT                          */
              /* ========================================================================= */
              <>
                {/* 1. TOP HEADER SECTION */}
                <div className="pdf-print-flex flex justify-between items-start border-b-2 border-[#8F8DF5] pb-4">
                  {/* Left Column: Company Details */}
                  <div className="space-y-0.5 text-xs text-left">
                    <h1 className="font-extrabold text-xl text-slate-900 uppercase tracking-tight">
                      {company.name}
                    </h1>
                    {company.owner && <p className="font-semibold text-slate-700">{company.owner}</p>}
                    <p className="text-[11px] text-slate-600 max-w-md leading-tight">{company.address}</p>
                    <p className="text-[10px] text-slate-600">
                      <strong>FSSAI :</strong> {company.fssai} &nbsp;|&nbsp; <strong>IEC :</strong> {company.iec}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>Manufacturing :</strong> {company.manufacturing}
                    </p>
                    <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mt-1">
                      {company.certifications}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      <strong>Phone no.:</strong> {company.phone}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      <strong>Email:</strong> {company.email}
                    </p>
                    <p className="text-[11px] text-slate-700">
                      <strong>GSTIN:</strong> {company.gstin}
                    </p>
                    <p className="text-[11px] text-slate-700">
                      <strong>State:</strong> {company.state}
                    </p>
                  </div>

                  {/* Right Column: Company Logo */}
                  <div className="text-right flex-shrink-0">
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="w-24 h-24 object-contain rounded-xl border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* 2. CENTERED DOCUMENT TITLE BANNER */}
                <div className="text-center my-3">
                  <h2 className="font-serif font-bold text-2xl text-[#7B78ED] tracking-wide">
                    {docTitle}
                  </h2>
                </div>

                {/* 3. BILL TO & INVOICE DETAILS ROW */}
                <div className="pdf-print-grid flex justify-between gap-6 text-xs border-b border-slate-200 pb-4">
                  {/* Left Side: Client / Bill To Info */}
                  <div className="space-y-1 text-left w-1/2">
                    <span className="font-bold text-slate-900 block mb-1">
                      {docTitle.includes('Payment-In') || docTitle.includes('Receipt') ? 'Received From' : 'Bill To'}
                    </span>
                    <p className="font-bold text-slate-900 uppercase text-sm">{clientName}</p>
                    {clientAddress && <p className="text-slate-600 leading-tight">{clientAddress}</p>}
                    {clientPhone && <p className="text-slate-600">Contact No.: {clientPhone}</p>}
                    {clientGstin && <p className="text-slate-700 font-semibold">GSTIN Number: {clientGstin}</p>}
                    <p className="text-slate-600">State: {clientState}</p>
                  </div>

                  {/* Right Side: Invoice Details */}
                  <div className="text-right space-y-1 w-1/2">
                    <span className="font-bold text-slate-900 block mb-1">
                      {docTitle} Details
                    </span>
                    <p><strong>{docTitle} No.:</strong> {doc?.docNumber || doc?.invoiceNumber || doc?.orderId || doc?.referenceNo || '1'}</p>
                    <p><strong>Date:</strong> {docDateStr}</p>
                    <p><strong>Place of Supply:</strong> {clientState}</p>
                    {doc?.poNumber && <p><strong>PO Number:</strong> {doc.poNumber}</p>}
                    {doc?.poDate && <p><strong>PO Date:</strong> {new Date(doc.poDate).toLocaleDateString('en-IN')}</p>}
                  </div>
                </div>

                {/* 4. LINE ITEMS TABLE (Purple Accent Header matching PDF Template) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-200">
                    <thead>
                      <tr className="pdf-header-bg bg-[#8F8DF5] text-white font-bold text-[11px] uppercase">
                        <th className="py-2.5 px-3 border border-slate-300">#</th>
                        <th className="py-2.5 px-3 border border-slate-300">Item Name</th>
                        <th className="py-2.5 px-3 border border-slate-300 text-center">HSN/ SAC</th>
                        <th className="py-2.5 px-3 border border-slate-300 text-center">Quantity</th>
                        <th className="py-2.5 px-3 border border-slate-300 text-center">Unit</th>
                        <th className="py-2.5 px-3 border border-slate-300 text-right">Price/ Unit</th>
                        <th className="py-2.5 px-3 border border-slate-300 text-center">GST</th>
                        <th className="py-2.5 px-3 border border-slate-300 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {doc?.items && doc.items.length > 0 ? (
                        doc.items.map((item: any, idx: number) => {
                          const qty = Number(item.quantity || item.qty || 1);
                          const unitPrice = Number(item.price || item.purchasePrice || item.rate || 0);
                          const gstPct = item.gst !== undefined ? Number(item.gst) : item.gstRate !== undefined ? Number(item.gstRate) : item.gstPercent !== undefined ? Number(item.gstPercent) : 5.0;
                          const lineSubtotal = Number(item.lineSubtotal || (qty * unitPrice));
                          const gstVal = Number(item.lineGst !== undefined ? item.lineGst : item.gstAmount !== undefined ? item.gstAmount : ((lineSubtotal * gstPct) / 100));
                          const lineAmt = Number(item.lineTotal || item.total || (lineSubtotal + gstVal));

                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 border border-slate-200 text-slate-500 font-medium">{idx + 1}</td>
                              <td className="py-2.5 px-3 border border-slate-200 font-bold text-slate-800">
                                {item.name || item.productName || 'Organic Product Item'}
                                {item.variantName && (
                                  <span className="block text-[10px] text-slate-500 font-normal">({item.variantName})</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 border border-slate-200 text-center text-slate-600 font-mono">{item.hsnCode || item.hsn || '08041030'}</td>
                              <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-slate-800">{qty}</td>
                              <td className="py-2.5 px-3 border border-slate-200 text-center text-slate-600">{item.unit || 'Kg'}</td>
                              <td className="py-2.5 px-3 border border-slate-200 text-right text-slate-700">{formatCur(unitPrice)}</td>
                              <td className="py-2.5 px-3 border border-slate-200 text-center text-slate-600">
                                {formatCur(gstVal)}
                                <span className="block text-[10px] text-slate-400">({gstPct}%)</span>
                              </td>
                              <td className="py-2.5 px-3 border border-slate-200 text-right font-bold text-slate-900">{formatCur(lineAmt)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-4 text-center text-slate-400 italic border border-slate-200">
                            No line items recorded for this invoice.
                          </td>
                        </tr>
                      )}

                      {/* Aggregated Total Row */}
                      <tr className="border-t-2 border-slate-400 font-bold bg-slate-50">
                        <td colSpan={3} className="py-2.5 px-3 border border-slate-300 text-slate-900 font-extrabold">Total</td>
                        <td className="py-2.5 px-3 border border-slate-300 text-center text-slate-900 font-extrabold">
                          {doc?.items?.reduce((acc: number, i: any) => acc + Number(i.quantity || i.qty || 1), 0) || 0}
                        </td>
                        <td colSpan={2} className="border border-slate-300"></td>
                        <td className="py-2.5 px-3 border border-slate-300 text-center text-slate-900 font-extrabold">
                          {formatCur(totalGstNum)}
                        </td>
                        <td className="py-2.5 px-3 border border-slate-300 text-right text-slate-900 font-black text-sm">
                          {formatCur(grandTotalNum)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 5. FINANCIAL BREAKDOWN & TERMS SECTION */}
                <div className="pdf-print-grid flex justify-between gap-6 text-xs pt-2">
                  {/* Left Column: Words, Terms & Bank Details */}
                  <div className="space-y-3 text-left w-1/2">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Invoice Amount In Words</span>
                      <p className="text-slate-800 italic font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {numberToWords(grandTotalNum)}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Terms And Conditions</span>
                      <p className="text-slate-600">Thank you for doing business with us.</p>
                    </div>

                    {/* Bank Pay To Details */}
                    {company.bankAccountNo && (
                      <div className="pt-2 border-t border-slate-200 space-y-0.5">
                        <span className="font-bold text-slate-900 block mb-1">Pay To:</span>
                        <p className="text-slate-600"><strong>Bank Name:</strong> {company.bankName}</p>
                        <p className="text-slate-600"><strong>Bank Account No.:</strong> {company.bankAccountNo}</p>
                        <p className="text-slate-600"><strong>Bank IFSC code:</strong> {company.bankIfsc}</p>
                        <p className="text-slate-600"><strong>Account Holder's Name:</strong> {company.bankHolder}</p>
                        {company.upiId && <p className="text-slate-600"><strong>UPI ID:</strong> {company.upiId}</p>}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Calculations Card & Signature */}
                  <div className="space-y-4 w-1/2 flex flex-col justify-between">
                    <div className="space-y-1 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between text-slate-600 py-0.5">
                        <span>Sub Total</span>
                        <span>{formatCur(subtotalNum)}</span>
                      </div>
                      {isInterState ? (
                        <div className="flex justify-between text-slate-600 py-0.5">
                          <span>IGST@5%</span>
                          <span>{formatCur(totalGstNum)}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between text-slate-600 py-0.5">
                            <span>SGST@2.5%</span>
                            <span>{formatCur(totalGstNum / 2)}</span>
                          </div>
                          <div className="flex justify-between text-slate-600 py-0.5">
                            <span>CGST@2.5%</span>
                            <span>{formatCur(totalGstNum / 2)}</span>
                          </div>
                        </>
                      )}

                      {/* Grand Total Bar */}
                      <div className="pdf-header-bg flex justify-between text-sm font-black bg-[#8F8DF5] text-white p-2 rounded-lg my-1.5 shadow-2xs">
                        <span>Total</span>
                        <span>{formatCur(grandTotalNum)}</span>
                      </div>

                      <div className="flex justify-between text-slate-700 py-0.5">
                        <span>Received</span>
                        <span>{formatCur(paidAmountNum)}</span>
                      </div>
                      <div className="flex justify-between text-slate-700 py-0.5">
                        <span>Balance</span>
                        <span>{formatCur(balanceNum)}</span>
                      </div>
                      <div className="flex justify-between text-slate-700 py-0.5">
                        <span>Payment Mode</span>
                        <span className="font-semibold">{doc?.paymentMethod || doc?.paymentMode || 'Cash'}</span>
                      </div>
                    </div>

                    {/* Authorized Signatory Block */}
                    <div className="text-right pt-2 space-y-6">
                      <p className="font-bold text-slate-800 text-xs">For: {company.name}</p>
                      <div className="inline-block border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-700">
                        Authorized Signatory
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
