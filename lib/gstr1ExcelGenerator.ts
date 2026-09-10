import ExcelJS from 'exceljs';
import { Gstr1Data } from './gstr1Engine';

/**
 * Generates an Excel workbook buffer containing all 16 sheets exactly matching
 * the reference GSTR-1 offline Excel template format.
 */
export async function generateGstr1ExcelBuffer(data: Gstr1Data): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Indian Agriculture ERP';
  workbook.lastModifiedBy = 'Indian Agriculture ERP';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Helper to style worksheet columns
  const applyColumnWidths = (ws: ExcelJS.Worksheet, minWidth = 14) => {
    ws.columns.forEach((col) => {
      let maxLen = minWidth;
      col.eachCell?.({ includeEmpty: false }, (cell) => {
        const str = String(cell.value || '');
        if (str.length > maxLen && str.length < 50) {
          maxLen = str.length;
        }
      });
      col.width = Math.min(Math.max(maxLen + 3, minWidth), 35);
    });
  };

  // --------------------------------------------------------------------------
  // 1. SHEET: GSTR1 Report
  // --------------------------------------------------------------------------
  const wsReport = workbook.addWorksheet('GSTR1 Report', { views: [{ showGridLines: true }] });
  wsReport.addRow(['From Year', data.period.fromYear, 'To Year', data.period.toYear, '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['From Month', data.period.fromMonth, 'To Month', data.period.toMonth, '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['1.GSTIN:', data.company.gstin, '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['2.(a)Legal name of the registered person:', data.company.legalName, '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['   (b)Trade name, if any', data.company.tradeName, '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['3.(a)Aggregate Turnover in the preceeding Financial Year:', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['   (b)Aggregate Turnover - April to June, 2017:', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(data.sheets.gstr1Report.headers1);
  wsReport.addRow(data.sheets.gstr1Report.headers2);

  for (const row of data.sheets.gstr1Report.rows) {
    wsReport.addRow(row);
  }
  wsReport.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsReport.addRow(data.sheets.gstr1Report.totals);
  applyColumnWidths(wsReport, 12);

  // --------------------------------------------------------------------------
  // 2. SHEET: b2b,sez,de
  // --------------------------------------------------------------------------
  const wsB2b = workbook.addWorksheet('b2b,sez,de', { views: [{ showGridLines: true }] });
  wsB2b.addRow(['Summary For B2B, SEZ, DE (4A, 4B, 6B, 6C)', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsB2b.addRow(['No. of Recipients', '', 'No. of Invoices', '', 'Total Invoice Value', '', '', '', '', '', '', 'Total Taxable Value', 'Total Cess']);
  wsB2b.addRow([
    data.sheets.b2b.summary.recipientsCount,
    '',
    data.sheets.b2b.summary.invoicesCount,
    '',
    data.sheets.b2b.summary.totalValue,
    '',
    '',
    '',
    '',
    '',
    '',
    data.sheets.b2b.summary.taxableValue,
    data.sheets.b2b.summary.totalCess,
  ]);
  wsB2b.addRow(data.sheets.b2b.headers);
  for (const row of data.sheets.b2b.rows) {
    wsB2b.addRow(row);
  }
  applyColumnWidths(wsB2b, 15);

  // --------------------------------------------------------------------------
  // 3. SHEET: b2cl
  // --------------------------------------------------------------------------
  const wsB2cl = workbook.addWorksheet('b2cl', { views: [{ showGridLines: true }] });
  wsB2cl.addRow(['Summary For B2CL(5)', '', '', '', '', '', '', '', '']);
  wsB2cl.addRow(['No. of Invoices', '', 'Total Invoice Value', '', '', '', 'Total Taxable Value', 'Total Cess', '']);
  wsB2cl.addRow([
    data.sheets.b2cl.summary.invoicesCount,
    '',
    data.sheets.b2cl.summary.totalValue,
    '',
    '',
    '',
    data.sheets.b2cl.summary.taxableValue,
    data.sheets.b2cl.summary.totalCess,
    '',
  ]);
  wsB2cl.addRow(data.sheets.b2cl.headers);
  for (const row of data.sheets.b2cl.rows) {
    wsB2cl.addRow(row);
  }
  applyColumnWidths(wsB2cl, 14);

  // --------------------------------------------------------------------------
  // 4. SHEET: b2cs
  // --------------------------------------------------------------------------
  const wsB2cs = workbook.addWorksheet('b2cs', { views: [{ showGridLines: true }] });
  wsB2cs.addRow(['Summary For B2CS(7)', '', '', '', '', '', '']);
  wsB2cs.addRow(['', '', '', '', 'Total Taxable Value', 'Total Cess', '']);
  wsB2cs.addRow(['', '', '', '', data.sheets.b2cs.summary.taxableValue, data.sheets.b2cs.summary.totalCess, '']);
  wsB2cs.addRow(data.sheets.b2cs.headers);
  for (const row of data.sheets.b2cs.rows) {
    wsB2cs.addRow(row);
  }
  applyColumnWidths(wsB2cs, 14);

  // --------------------------------------------------------------------------
  // 5. SHEET: cdnr
  // --------------------------------------------------------------------------
  const wsCdnr = workbook.addWorksheet('cdnr', { views: [{ showGridLines: true }] });
  wsCdnr.addRow(['Summary For CDNR(9B)', '', '', '', '', '', '', '', '', '', '', '', '']);
  wsCdnr.addRow(['No. of Recipients', 'No. of Notes', '', '', '', '', '', 'Total Note Value', '', '', 'Total Taxable Value', 'Total Cess', '']);
  wsCdnr.addRow([
    data.sheets.cdnr.summary.recipientsCount,
    data.sheets.cdnr.summary.notesCount,
    '',
    '',
    '',
    '',
    '',
    data.sheets.cdnr.summary.totalValue,
    '',
    '',
    data.sheets.cdnr.summary.taxableValue,
    data.sheets.cdnr.summary.totalCess,
    '',
  ]);
  wsCdnr.addRow(data.sheets.cdnr.headers);
  for (const row of data.sheets.cdnr.rows) {
    wsCdnr.addRow(row);
  }
  applyColumnWidths(wsCdnr, 14);

  // --------------------------------------------------------------------------
  // 6. SHEET: cdnur
  // --------------------------------------------------------------------------
  const wsCdnur = workbook.addWorksheet('cdnur', { views: [{ showGridLines: true }] });
  wsCdnur.addRow(['Summary For CDNUR(9B)', '', '', '', '', '', '', '', '', '']);
  wsCdnur.addRow(['', 'No. of Notes/Vouchers', '', '', '', 'Total Note Value', '', '', 'Total Taxable Value', 'Total Cess']);
  wsCdnur.addRow([
    '',
    data.sheets.cdnur.summary.notesCount,
    '',
    '',
    '',
    data.sheets.cdnur.summary.totalValue,
    '',
    '',
    data.sheets.cdnur.summary.taxableValue,
    data.sheets.cdnur.summary.totalCess,
  ]);
  wsCdnur.addRow(data.sheets.cdnur.headers);
  for (const row of data.sheets.cdnur.rows) {
    wsCdnur.addRow(row);
  }
  applyColumnWidths(wsCdnur, 14);

  // --------------------------------------------------------------------------
  // 7. SHEET: exp
  // --------------------------------------------------------------------------
  const wsExp = workbook.addWorksheet('exp', { views: [{ showGridLines: true }] });
  wsExp.addRow(['Summary For EXP(6)', '', '', '', '', '', '', '', '']);
  wsExp.addRow(['', 'No. of Invoices', '', 'Total Invoice Value', '', 'No. of Shipping Bill', '', '', 'Total Taxable Value']);
  wsExp.addRow(['', '', '', '', '', '', '', '', '']);
  wsExp.addRow(data.sheets.exp.headers);
  for (const row of data.sheets.exp.rows) {
    wsExp.addRow(row);
  }
  applyColumnWidths(wsExp, 14);

  // --------------------------------------------------------------------------
  // 8. SHEET: at
  // --------------------------------------------------------------------------
  const wsAt = workbook.addWorksheet('at', { views: [{ showGridLines: true }] });
  wsAt.addRow(['Summary For Advance Received(11B)', '', '', '', '']);
  wsAt.addRow(['', '', '', 'Total Advance Received', 'Total Cess']);
  wsAt.addRow(['', '', '', '', '']);
  wsAt.addRow(data.sheets.at.headers);
  for (const row of data.sheets.at.rows) {
    wsAt.addRow(row);
  }
  applyColumnWidths(wsAt, 16);

  // --------------------------------------------------------------------------
  // 9. SHEET: atadj
  // --------------------------------------------------------------------------
  const wsAtadj = workbook.addWorksheet('atadj', { views: [{ showGridLines: true }] });
  wsAtadj.addRow(['Summary For Advance Adjusted(11B)', '', '', '', '']);
  wsAtadj.addRow(['', '', '', 'Total Advance Adjusted', 'Total Cess']);
  wsAtadj.addRow(['', '', '', '', '']);
  wsAtadj.addRow(data.sheets.atadj.headers);
  for (const row of data.sheets.atadj.rows) {
    wsAtadj.addRow(row);
  }
  applyColumnWidths(wsAtadj, 16);

  // --------------------------------------------------------------------------
  // 10. SHEET: exemp
  // --------------------------------------------------------------------------
  const wsExemp = workbook.addWorksheet('exemp', { views: [{ showGridLines: true }] });
  wsExemp.addRow(['Summary For Nil rated, exempted and non GST outward supplies (8)', '', '', '']);
  wsExemp.addRow(['', 'Total Nil Rated Supplies', 'Total Exempted Supplies', 'Total Non-GST Supplies']);
  wsExemp.addRow(['', '0.00', '0.00', '0']);
  wsExemp.addRow(data.sheets.exemp.headers);
  for (const row of data.sheets.exemp.rows) {
    wsExemp.addRow(row);
  }
  applyColumnWidths(wsExemp, 22);

  // --------------------------------------------------------------------------
  // 11. SHEET: hsn(b2b)
  // --------------------------------------------------------------------------
  const wsHsnB2b = workbook.addWorksheet('hsn(b2b)', { views: [{ showGridLines: true }] });
  wsHsnB2b.addRow(['Summary For HSN(12)', '', '', '', '', '', '', '', '', '', '']);
  wsHsnB2b.addRow(['No. of HSN', '', '', '', 'Total Value', '', 'Total Taxable Value', 'Total Integrated Tax', 'Total Central Tax', 'Total State/UT Tax', 'Total Cess']);
  wsHsnB2b.addRow([
    data.sheets.hsnB2b.summary.hsnCount,
    '',
    '',
    '',
    data.sheets.hsnB2b.summary.totalValue,
    '',
    data.sheets.hsnB2b.summary.taxableValue,
    data.sheets.hsnB2b.summary.totalIgst,
    data.sheets.hsnB2b.summary.totalCgst,
    data.sheets.hsnB2b.summary.totalSgst,
    data.sheets.hsnB2b.summary.totalCess,
  ]);
  wsHsnB2b.addRow(data.sheets.hsnB2b.headers);
  wsHsnB2b.addRow(['', '', '', '', '', '', '', '', '', '', '']);
  for (const row of data.sheets.hsnB2b.rows) {
    wsHsnB2b.addRow(row);
  }
  applyColumnWidths(wsHsnB2b, 14);

  // --------------------------------------------------------------------------
  // 12. SHEET: hsn(b2c)
  // --------------------------------------------------------------------------
  const wsHsnB2c = workbook.addWorksheet('hsn(b2c)', { views: [{ showGridLines: true }] });
  wsHsnB2c.addRow(['Summary For HSN(12)', '', '', '', '', '', '', '', '', '', '']);
  wsHsnB2c.addRow(['No. of HSN', '', '', '', 'Total Value', '', 'Total Taxable Value', 'Total Integrated Tax', 'Total Central Tax', 'Total State/UT Tax', 'Total Cess']);
  wsHsnB2c.addRow([
    data.sheets.hsnB2c.summary.hsnCount,
    '',
    '',
    '',
    data.sheets.hsnB2c.summary.totalValue,
    '',
    data.sheets.hsnB2c.summary.taxableValue,
    data.sheets.hsnB2c.summary.totalIgst,
    data.sheets.hsnB2c.summary.totalCgst,
    data.sheets.hsnB2c.summary.totalSgst,
    data.sheets.hsnB2c.summary.totalCess,
  ]);
  wsHsnB2c.addRow(data.sheets.hsnB2c.headers);
  wsHsnB2c.addRow(['', '', '', '', '', '', '', '', '', '', '']);
  for (const row of data.sheets.hsnB2c.rows) {
    wsHsnB2c.addRow(row);
  }
  applyColumnWidths(wsHsnB2c, 14);

  // --------------------------------------------------------------------------
  // 13. SHEET: docs
  // --------------------------------------------------------------------------
  const wsDocs = workbook.addWorksheet('docs', { views: [{ showGridLines: true }] });
  wsDocs.addRow(['Summary of documents issued during the tax period (13)', '', '', '', '']);
  wsDocs.addRow(['', '', '', 'Total Number', 'Total Cancelled']);
  wsDocs.addRow(['', '', '', data.sheets.docs.summary.totalNumber, data.sheets.docs.summary.totalCancelled]);
  wsDocs.addRow(data.sheets.docs.headers);
  for (const row of data.sheets.docs.rows) {
    wsDocs.addRow(row);
  }
  applyColumnWidths(wsDocs, 18);

  // --------------------------------------------------------------------------
  // 14. SHEET: itemWiseSale
  // --------------------------------------------------------------------------
  const wsItemSale = workbook.addWorksheet('itemWiseSale', { views: [{ showGridLines: true }] });
  wsItemSale.addRow(['Summary For HSN(12)', '', '', '', '', '', '', '', '', '', '']);
  wsItemSale.addRow(['No. of HSN', '', '', '', 'Total Value', '', 'Total Taxable Value', 'Total Integrated Tax', 'Total Central Tax', 'Total State/UT Tax', 'Total Cess']);
  wsItemSale.addRow([
    data.sheets.itemWiseSale.summary.hsnCount,
    '',
    '',
    '',
    data.sheets.itemWiseSale.summary.totalValue,
    '',
    data.sheets.itemWiseSale.summary.taxableValue,
    data.sheets.itemWiseSale.summary.totalIgst,
    data.sheets.itemWiseSale.summary.totalCgst,
    data.sheets.itemWiseSale.summary.totalSgst,
    data.sheets.itemWiseSale.summary.totalCess,
  ]);
  wsItemSale.addRow(data.sheets.itemWiseSale.headers);
  wsItemSale.addRow(['', '', '', '', '', '', '', '', '', '', '']);
  for (const row of data.sheets.itemWiseSale.rows) {
    wsItemSale.addRow(row);
  }
  applyColumnWidths(wsItemSale, 16);

  // --------------------------------------------------------------------------
  // 15. SHEET: itemWiseSaleReturn
  // --------------------------------------------------------------------------
  const wsItemReturn = workbook.addWorksheet('itemWiseSaleReturn', { views: [{ showGridLines: true }] });
  wsItemReturn.addRow(['Summary For HSN(12)', '', '', '', '', '', '', '', '', '', '']);
  wsItemReturn.addRow(['No. of HSN', '', '', '', 'Total Value', '', 'Total Taxable Value', 'Total Integrated Tax', 'Total Central Tax', 'Total State/UT Tax', 'Total Cess']);
  wsItemReturn.addRow([
    data.sheets.itemWiseSaleReturn.summary.hsnCount,
    '',
    '',
    '',
    data.sheets.itemWiseSaleReturn.summary.totalValue,
    '',
    data.sheets.itemWiseSaleReturn.summary.taxableValue,
    data.sheets.itemWiseSaleReturn.summary.totalIgst,
    data.sheets.itemWiseSaleReturn.summary.totalCgst,
    data.sheets.itemWiseSaleReturn.summary.totalSgst,
    data.sheets.itemWiseSaleReturn.summary.totalCess,
  ]);
  wsItemReturn.addRow(data.sheets.itemWiseSaleReturn.headers);
  for (const row of data.sheets.itemWiseSaleReturn.rows) {
    wsItemReturn.addRow(row);
  }
  applyColumnWidths(wsItemReturn, 16);

  // --------------------------------------------------------------------------
  // 16. SHEET: itemSummary
  // --------------------------------------------------------------------------
  const wsItemSummary = workbook.addWorksheet('itemSummary', { views: [{ showGridLines: true }] });
  wsItemSummary.addRow(['Summary For HSN(12)', '', '', '', '', '', '', '', '', '', '']);
  wsItemSummary.addRow(['No. of HSN', '', '', '', 'Total Value', '', 'Total Taxable Value', 'Total Integrated Tax', 'Total Central Tax', 'Total State/UT Tax', 'Total Cess']);
  wsItemSummary.addRow([
    data.sheets.itemSummary.summary.hsnCount,
    '',
    '',
    '',
    data.sheets.itemSummary.summary.totalValue,
    '',
    data.sheets.itemSummary.summary.taxableValue,
    data.sheets.itemSummary.summary.totalIgst,
    data.sheets.itemSummary.summary.totalCgst,
    data.sheets.itemSummary.summary.totalSgst,
    data.sheets.itemSummary.summary.totalCess,
  ]);
  wsItemSummary.addRow(data.sheets.itemSummary.headers);
  wsItemSummary.addRow(['', '', '', '', '', '', '', '', '', '', '']);
  for (const row of data.sheets.itemSummary.rows) {
    wsItemSummary.addRow(row);
  }
  applyColumnWidths(wsItemSummary, 16);

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
