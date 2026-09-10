import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { calculateGstr1 } from '@/lib/gstr1Engine';
import { generateGstr1ExcelBuffer } from '@/lib/gstr1ExcelGenerator';

async function main() {
  console.log('--- 1. Testing GSTR-1 Calculation for June 2026 ---');
  const juneData = await calculateGstr1({ month: 6, year: 2026 });
  console.log('Company GSTIN:', juneData.company.gstin);
  console.log('Company Legal Name:', juneData.company.legalName);
  console.log('Summary KPIs:', juneData.summary);

  console.log('--- 2. Generating Excel Workbook Buffer ---');
  const buffer = await generateGstr1ExcelBuffer(juneData);
  console.log('Generated Buffer Size:', buffer.length, 'bytes');

  const outPath = path.join(process.cwd(), 'tests', 'test_output_gstr1.xlsx');
  fs.writeFileSync(outPath, buffer);
  console.log('Saved workbook to:', outPath);

  console.log('--- 3. Verifying Generated Workbook Using ExcelJS ---');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(outPath);

  const sheetNames = wb.worksheets.map((ws) => ws.name);
  console.log(`Total Sheets: ${sheetNames.length}`);
  console.log('Sheet Names:', sheetNames);

  const EXPECTED_SHEETS = [
    'GSTR1 Report',
    'b2b,sez,de',
    'b2cl',
    'b2cs',
    'cdnr',
    'cdnur',
    'exp',
    'at',
    'atadj',
    'exemp',
    'hsn(b2b)',
    'hsn(b2c)',
    'docs',
    'itemWiseSale',
    'itemWiseSaleReturn',
    'itemSummary',
  ];

  let allMatch = true;
  for (let i = 0; i < EXPECTED_SHEETS.length; i++) {
    const expected = EXPECTED_SHEETS[i];
    const actual = sheetNames[i];
    if (expected !== actual) {
      console.error(`Mismatch at sheet ${i}: expected "${expected}", got "${actual}"`);
      allMatch = false;
    } else {
      const ws = wb.getWorksheet(actual);
      console.log(`✓ [Sheet ${i + 1}/16] "${actual}" - Rows: ${ws?.rowCount}, Cols: ${ws?.columnCount}`);
    }
  }

  if (allMatch) {
    console.log('🎉 ALL 16 SHEETS MATCH THE REFERENCE TEMPLATE EXACTLY!');
  } else {
    console.error('❌ Some sheet names did not match!');
    process.exit(1);
  }

  console.log('--- 4. Testing GSTR-1 Calculation for September 2026 (Live Orders in DB) ---');
  const septData = await calculateGstr1({ month: 9, year: 2026 });
  console.log('Sept 2026 Total Documents:', septData.summary.totalDocuments);
  console.log('Sept 2026 Gross Sales:', septData.summary.totalValue);
  console.log('Sept 2026 Taxable Value:', septData.summary.totalTaxableValue);
  console.log('Sept 2026 CGST:', septData.summary.totalCgst, 'SGST:', septData.summary.totalSgst);
  console.log('Sept 2026 GSTR-1 Rows:', septData.sheets.gstr1Report.rows.length);
  console.log('Sept 2026 B2CS Rows:', septData.sheets.b2cs.rows.length);
  console.log('Sept 2026 ItemWiseSale Rows:', septData.sheets.itemWiseSale.rows.length);

  const septBuffer = await generateGstr1ExcelBuffer(septData);
  const septOutPath = path.join(process.cwd(), 'tests', 'sept_output_gstr1.xlsx');
  fs.writeFileSync(septOutPath, septBuffer);
  console.log('Sept 2026 Excel Export Generated Successfully! Size:', septBuffer.length);

  // Clean up test files
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  if (fs.existsSync(septOutPath)) fs.unlinkSync(septOutPath);

  process.exit(0);
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
