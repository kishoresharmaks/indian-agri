import connectToDatabase from '@/lib/db';
import SaleDocument from '@/models/SaleDocument';
import Order from '@/models/Order';
import Party from '@/models/Party';
import Product from '@/models/Product';
import { getCompanyConfig } from '@/lib/companyConfig';

// Standard Indian GST State Code Dictionary
export const GST_STATE_MAP: Record<string, string> = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
};

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface NormalizedItem {
  name: string;
  hsn: string;
  uqc: string;
  quantity: number;
  rate: number;
  taxableValue: number;
  lineTotal: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
}

export interface NormalizedDoc {
  id: string;
  docNumber: string;
  docType: 'Sale' | 'Sale Return' | 'Credit Note';
  isReturn: boolean;
  date: Date;
  dateStr: string; // DD-MM-YYYY
  dateFormatted: string; // DD-MMM-YYYY (e.g. 01-Jun-2026)
  customerName: string;
  customerGstin: string;
  isB2B: boolean;
  stateCode: string; // e.g. "33"
  stateName: string; // e.g. "Tamil Nadu"
  placeOfSupply: string; // e.g. "33-Tamil Nadu"
  isInterState: boolean;
  totalValue: number;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  items: NormalizedItem[];
}

export interface Gstr1Data {
  company: {
    gstin: string;
    legalName: string;
    tradeName: string;
    stateCode: string;
    stateName: string;
  };
  period: {
    fromYear: number;
    toYear: number;
    fromMonth: string;
    toMonth: string;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalDocuments: number;
    b2bInvoicesCount: number;
    b2cInvoicesCount: number;
    creditNotesCount: number;
    totalValue: number;
    totalTaxableValue: number;
    totalIgst: number;
    totalCgst: number;
    totalSgst: number;
    totalCess: number;
  };
  sheets: {
    gstr1Report: {
      headers1: string[];
      headers2: string[];
      rows: (string | number)[][];
      totals: (string | number)[];
    };
    b2b: {
      summary: {
        recipientsCount: number;
        invoicesCount: number;
        totalValue: number;
        taxableValue: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    b2cl: {
      summary: {
        invoicesCount: number;
        totalValue: number;
        taxableValue: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    b2cs: {
      summary: {
        taxableValue: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    cdnr: {
      summary: {
        recipientsCount: number;
        notesCount: number;
        totalValue: number;
        taxableValue: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    cdnur: {
      summary: {
        notesCount: number;
        totalValue: number;
        taxableValue: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    exp: {
      summary: {
        invoicesCount: number;
        totalValue: number;
        shippingBillsCount: number;
        taxableValue: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    at: {
      headers: string[];
      rows: (string | number)[][];
    };
    atadj: {
      headers: string[];
      rows: (string | number)[][];
    };
    exemp: {
      headers: string[];
      rows: (string | number)[][];
    };
    hsnB2b: {
      summary: {
        hsnCount: number;
        totalValue: number;
        taxableValue: number;
        totalIgst: number;
        totalCgst: number;
        totalSgst: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    hsnB2c: {
      summary: {
        hsnCount: number;
        totalValue: number;
        taxableValue: number;
        totalIgst: number;
        totalCgst: number;
        totalSgst: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    docs: {
      summary: {
        totalNumber: number;
        totalCancelled: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    itemWiseSale: {
      summary: {
        hsnCount: number;
        totalValue: number;
        taxableValue: number;
        totalIgst: number;
        totalCgst: number;
        totalSgst: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    itemWiseSaleReturn: {
      summary: {
        hsnCount: number;
        totalValue: number;
        taxableValue: number;
        totalIgst: number;
        totalCgst: number;
        totalSgst: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
    itemSummary: {
      summary: {
        hsnCount: number;
        totalValue: number;
        taxableValue: number;
        totalIgst: number;
        totalCgst: number;
        totalSgst: number;
        totalCess: number;
      };
      headers: string[];
      rows: (string | number)[][];
    };
  };
}

/**
 * Format date helpers matching Excel template exact formats
 */
function formatDateDDMMYYYY(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatDateDDMMMYYYY(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = SHORT_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function round2(num: number): number {
  return Math.round((Number(num) || 0) * 100) / 100;
}

/**
 * Heuristic fallback for HSN code and UQC if missing on product
 */
function resolveHsnAndUqc(name: string, category?: string): { hsn: string; uqc: string } {
  const lower = (name + ' ' + (category || '')).toLowerCase();

  // Oils
  if (lower.includes('oil') || lower.includes('castor') || lower.includes('neem')) {
    if (lower.includes('500ml') || lower.includes('can') || lower.includes('bulk')) {
      return { hsn: '15159099', uqc: 'OTH-OTHERS' };
    }
    return { hsn: '15159099', uqc: 'PCS-PIECES' };
  }
  // Shampoo / Personal care
  if (lower.includes('shampoo') || lower.includes('soap') || lower.includes('gel')) {
    return { hsn: '33051090', uqc: 'PCS-PIECES' };
  }
  // Honey
  if (lower.includes('honey')) {
    return { hsn: '04090000', uqc: 'PCS-PIECES' };
  }
  // Dates / Flour / Powder
  if (lower.includes('date') || lower.includes('powder') || lower.includes('mix') || lower.includes('soup')) {
    return { hsn: '11063090', uqc: 'PCS-PIECES' };
  }
  // Banana / Agricultural produce
  if (lower.includes('banana')) {
    if (lower.includes('nantgiram')) {
      return { hsn: '', uqc: 'OTH-OTHERS' };
    }
    return { hsn: '', uqc: 'PCS-PIECES' };
  }
  // Tea / Leaves / Moringa
  if (lower.includes('tea') || lower.includes('leaf') || lower.includes('moringa') || lower.includes('capsule')) {
    return { hsn: '12119029', uqc: 'PCS-PIECES' };
  }

  return { hsn: '15159099', uqc: 'PCS-PIECES' };
}

/**
 * Main calculation engine
 */
export async function calculateGstr1(options?: {
  startDate?: string;
  endDate?: string;
  month?: number; // 1-12
  year?: number;
}): Promise<Gstr1Data> {
  await connectToDatabase();
  const company = getCompanyConfig();

  // Determine period
  const now = new Date();
  let start: Date;
  let end: Date;

  if (options?.startDate && options?.endDate) {
    start = new Date(options.startDate);
    start.setHours(0, 0, 0, 0);
    end = new Date(options.endDate);
    end.setHours(23, 59, 59, 999);
  } else if (options?.month && options?.year) {
    const m = options.month - 1;
    const y = options.year;
    start = new Date(y, m, 1, 0, 0, 0, 0);
    end = new Date(y, m + 1, 0, 23, 59, 59, 999);
  } else {
    // Current month default
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const fromYear = start.getFullYear();
  const toYear = end.getFullYear();
  const fromMonth = MONTH_NAMES[start.getMonth()];
  const toMonth = MONTH_NAMES[end.getMonth()];

  // Parse company state & GSTIN
  const companyGstin = company.gstin || '33AAOCB0453D1Z3';
  const companyLegalName = company.name || 'INDIAN AGRICULTURE';
  const companyTradeName = company.owner || companyLegalName;
  const companyStateStr = company.state || '33-Tamil Nadu';
  const companyStateCode = companyStateStr.split('-')[0]?.trim() || companyGstin.substring(0, 2) || '33';
  const companyStateName = companyStateStr.includes('-')
    ? companyStateStr.split('-')[1]?.trim()
    : GST_STATE_MAP[companyStateCode] || 'Tamil Nadu';

  // Fetch all parties for GSTIN mapping
  const parties = await Party.find({}).lean();
  const partyMapById = new Map<string, any>();
  const partyMapByPhone = new Map<string, any>();
  const partyMapByName = new Map<string, any>();

  for (const p of parties) {
    if (p._id) partyMapById.set(String(p._id), p);
    if (p.phone) partyMapByPhone.set(p.phone.trim().replace(/\D/g, '').slice(-10), p);
    if (p.name) partyMapByName.set(p.name.trim().toLowerCase(), p);
  }

  // Fetch all products for HSN/category mapping
  const products = await Product.find({}).lean();
  const productMapById = new Map<string, any>();
  for (const pr of products) {
    if (pr._id) productMapById.set(String(pr._id), pr);
  }

  // Query SaleDocuments
  const saleDocs = await SaleDocument.find({
    status: { $ne: 'Cancelled' },
    createdAt: { $gte: start, $lte: end },
  })
    .sort({ createdAt: 1 })
    .lean();

  // Query Orders (storefront & POS counter)
  const orders = await Order.find({
    status: { $ne: 'Cancelled' },
    createdAt: { $gte: start, $lte: end },
  })
    .sort({ createdAt: 1 })
    .lean();

  const normalizedDocs: NormalizedDoc[] = [];

  // Helper to resolve party
  const findParty = (pId?: string, phone?: string, name?: string) => {
    if (pId && partyMapById.has(pId)) return partyMapById.get(pId);
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      if (partyMapByPhone.has(cleanPhone)) return partyMapByPhone.get(cleanPhone);
    }
    if (name && partyMapByName.has(name.trim().toLowerCase())) {
      return partyMapByName.get(name.trim().toLowerCase());
    }
    return null;
  };

  // 1. Process SaleDocuments
  for (const doc of saleDocs) {
    const isReturn = doc.docType === 'SALE_RETURN';
    const party = findParty(doc.partyId, doc.customerPhone, doc.customerName);
    const gstin = (party?.gstin || (doc as any).gstin || '').trim().toUpperCase();
    const isB2B = Boolean(gstin && gstin.length === 15);

    let stateCode = companyStateCode;
    let stateName = companyStateName;

    if (gstin && gstin.length >= 2) {
      const code = gstin.substring(0, 2);
      if (GST_STATE_MAP[code]) {
        stateCode = code;
        stateName = GST_STATE_MAP[code];
      }
    } else if (doc.billingAddress) {
      for (const [code, name] of Object.entries(GST_STATE_MAP)) {
        if (doc.billingAddress.toLowerCase().includes(name.toLowerCase())) {
          stateCode = code;
          stateName = name;
          break;
        }
      }
    }

    const isInterState = stateCode !== companyStateCode;
    const docDate = new Date(doc.createdAt || Date.now());

    const normItems: NormalizedItem[] = [];
    let docTaxable = 0;
    let docIgst = 0;
    let docCgst = 0;
    let docSgst = 0;
    let docValue = 0;

    for (const item of doc.items || []) {
      const pObj = productMapById.get(item.productId);
      const hsnInfo = resolveHsnAndUqc(item.name, pObj?.category);
      const hsn = (pObj as any)?.hsnCode || (item as any).hsnCode || hsnInfo.hsn;
      const uqc = (pObj as any)?.uqc || (item as any).uqc || hsnInfo.uqc;
      const rate = Number(item.gst || 0);
      const qty = Number(item.quantity || 1);
      const taxable = round2(Number(item.lineSubtotal || item.price * qty));
      const total = round2(Number(item.lineTotal || taxable + (taxable * rate) / 100));

      let igst = 0;
      let cgst = 0;
      let sgst = 0;

      if (isInterState) {
        igst = round2((taxable * rate) / 100);
      } else {
        cgst = round2((taxable * (rate / 2)) / 100);
        sgst = round2((taxable * (rate / 2)) / 100);
      }

      normItems.push({
        name: item.name,
        hsn,
        uqc,
        quantity: qty,
        rate,
        taxableValue: taxable,
        lineTotal: total,
        igst,
        cgst,
        sgst,
        cess: 0,
      });

      docTaxable += taxable;
      docIgst += igst;
      docCgst += cgst;
      docSgst += sgst;
      docValue += total;
    }

    normalizedDocs.push({
      id: String(doc._id),
      docNumber: doc.docNumber || 'DOC',
      docType: isReturn ? 'Sale Return' : 'Sale',
      isReturn,
      date: docDate,
      dateStr: formatDateDDMMYYYY(docDate),
      dateFormatted: formatDateDDMMMYYYY(docDate),
      customerName: doc.customerName || 'Walk-in Customer',
      customerGstin: gstin,
      isB2B,
      stateCode,
      stateName: stateName || 'Tamil Nadu',
      placeOfSupply: `${stateCode}-${stateName || 'Tamil Nadu'}`,
      isInterState,
      totalValue: round2(doc.grandTotal || docValue),
      taxableValue: round2(docTaxable),
      igst: round2(docIgst),
      cgst: round2(docCgst),
      sgst: round2(docSgst),
      cess: 0,
      items: normItems,
    });
  }

  // 2. Process Orders (e-commerce & POS counter orders)
  for (const ord of orders) {
    const party = findParty(undefined, ord.customerPhone, ord.customerName);
    const gstin = (party?.gstin || '').trim().toUpperCase();
    const isB2B = Boolean(gstin && gstin.length === 15);

    let stateCode = companyStateCode;
    let stateName = companyStateName;

    if (gstin && gstin.length >= 2) {
      const code = gstin.substring(0, 2);
      if (GST_STATE_MAP[code]) {
        stateCode = code;
        stateName = GST_STATE_MAP[code];
      }
    } else if (ord.shippingAddress) {
      for (const [code, name] of Object.entries(GST_STATE_MAP)) {
        if (ord.shippingAddress.toLowerCase().includes(name.toLowerCase())) {
          stateCode = code;
          stateName = name;
          break;
        }
      }
    }

    const isInterState = stateCode !== companyStateCode;
    const docDate = new Date(ord.createdAt || Date.now());

    const normItems: NormalizedItem[] = [];
    let ordTaxable = 0;
    let ordIgst = 0;
    let ordCgst = 0;
    let ordSgst = 0;
    let ordValue = 0;

    for (const item of ord.items || []) {
      const pObj = productMapById.get(item.productId);
      const hsnInfo = resolveHsnAndUqc(item.name, pObj?.category);
      const hsn = (pObj as any)?.hsnCode || hsnInfo.hsn;
      const uqc = (pObj as any)?.uqc || hsnInfo.uqc;
      const rate = Number(item.gst || 0);
      const qty = Number(item.quantity || 1);
      const total = round2(item.price * qty);
      const taxable = rate > 0 ? round2(total / (1 + rate / 100)) : total;

      let igst = 0;
      let cgst = 0;
      let sgst = 0;

      if (isInterState) {
        igst = round2(total - taxable);
      } else {
        const half = round2((total - taxable) / 2);
        cgst = half;
        sgst = half;
      }

      normItems.push({
        name: item.name,
        hsn,
        uqc,
        quantity: qty,
        rate,
        taxableValue: taxable,
        lineTotal: total,
        igst,
        cgst,
        sgst,
        cess: 0,
      });

      ordTaxable += taxable;
      ordIgst += igst;
      ordCgst += cgst;
      ordSgst += sgst;
      ordValue += total;
    }

    normalizedDocs.push({
      id: String(ord._id),
      docNumber: ord.invoiceNumber || ord.orderId || 'ORD',
      docType: 'Sale',
      isReturn: false,
      date: docDate,
      dateStr: formatDateDDMMYYYY(docDate),
      dateFormatted: formatDateDDMMMYYYY(docDate),
      customerName: ord.customerName || (ord.orderType === 'POS' ? 'Walk-in Counter' : 'Online Shopper'),
      customerGstin: gstin,
      isB2B,
      stateCode,
      stateName: stateName || 'Tamil Nadu',
      placeOfSupply: `${stateCode}-${stateName || 'Tamil Nadu'}`,
      isInterState,
      totalValue: round2(ord.totalAmount || ordValue),
      taxableValue: round2(ordTaxable),
      igst: round2(ordIgst),
      cgst: round2(ordCgst),
      sgst: round2(ordSgst),
      cess: 0,
      items: normItems,
    });
  }

  // Sort docs chronologically
  normalizedDocs.sort((a, b) => a.date.getTime() - b.date.getTime());

  // --------------------------------------------------------------------------
  // SHEET 1: GSTR1 Report
  // --------------------------------------------------------------------------
  const gstr1Headers1 = [
    'GSTIN/UIN No.',
    'Party Name',
    'Transaction Type',
    'Invoice',
    '',
    '',
    'Rate',
    'CESS Rate',
    'Taxable Value',
    'Reverse Charge',
    'Amount',
    '',
    '',
    '',
    'Place Of Supply',
  ];
  const gstr1Headers2 = [
    'GSTIN/UIN No.',
    'Party Name',
    'Transaction Type',
    'No.',
    'Date',
    'Value',
    'Rate',
    'CESS Rate',
    'Taxable Value',
    'Reverse Charge',
    'Integrated Tax',
    'Central Tax',
    'State/UT Tax',
    'CESS',
    'Place Of Supply',
  ];

  const gstr1Rows: (string | number)[][] = [];
  let gstr1SumVal = 0;
  let gstr1SumTaxable = 0;
  let gstr1SumIgst = 0;
  let gstr1SumCgst = 0;
  let gstr1SumSgst = 0;
  let gstr1SumCess = 0;

  for (const doc of normalizedDocs) {
    const rateGroups = new Map<
      number,
      { val: number; taxable: number; igst: number; cgst: number; sgst: number; cess: number }
    >();

    for (const item of doc.items) {
      const curr = rateGroups.get(item.rate) || { val: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 };
      curr.val += item.lineTotal;
      curr.taxable += item.taxableValue;
      curr.igst += item.igst;
      curr.cgst += item.cgst;
      curr.sgst += item.sgst;
      curr.cess += item.cess;
      rateGroups.set(item.rate, curr);
    }

    if (rateGroups.size === 0) {
      rateGroups.set(5.0, {
        val: doc.totalValue,
        taxable: doc.taxableValue,
        igst: doc.igst,
        cgst: doc.cgst,
        sgst: doc.sgst,
        cess: doc.cess,
      });
    }

    for (const [rate, grp] of rateGroups.entries()) {
      const val = round2(grp.val);
      const taxable = round2(grp.taxable);
      const igst = round2(grp.igst);
      const cgst = round2(grp.cgst);
      const sgst = round2(grp.sgst);
      const cess = round2(grp.cess);

      gstr1Rows.push([
        doc.customerGstin,
        doc.customerName,
        doc.docType,
        doc.docNumber,
        doc.dateStr,
        val,
        rate,
        0.0,
        taxable,
        'N',
        igst,
        cgst,
        sgst,
        cess,
        doc.customerGstin ? doc.stateName : '',
      ]);

      gstr1SumVal += val;
      gstr1SumTaxable += taxable;
      gstr1SumIgst += igst;
      gstr1SumCgst += cgst;
      gstr1SumSgst += sgst;
      gstr1SumCess += cess;
    }
  }

  const gstr1Totals = [
    'Totals',
    '',
    '',
    '',
    '',
    round2(gstr1SumVal),
    '',
    '',
    round2(gstr1SumTaxable),
    '',
    round2(gstr1SumIgst),
    round2(gstr1SumCgst),
    round2(gstr1SumSgst),
    round2(gstr1SumCess),
    '',
  ];

  // --------------------------------------------------------------------------
  // SHEET 2: b2b,sez,de
  // --------------------------------------------------------------------------
  const b2bDocs = normalizedDocs.filter((d) => d.isB2B && !d.isReturn);
  const b2bRecipients = new Set(b2bDocs.map((d) => d.customerGstin));
  let b2bTotalVal = 0;
  let b2bTotalTaxable = 0;
  let b2bTotalCess = 0;

  const b2bHeaders = [
    'GSTIN/UIN of Recipient',
    'Receiver Name',
    'Invoice Number',
    'Invoice date',
    'Invoice Value',
    'Place Of Supply',
    'Reverse Charge',
    'Applicable % of Tax Rate',
    'Invoice Type',
    'E-Commerce GSTIN',
    'Rate',
    'Taxable Value',
    'Cess Amount',
  ];

  const b2bRows: (string | number)[][] = [];

  for (const doc of b2bDocs) {
    const rateGroups = new Map<number, { val: number; taxable: number; cess: number }>();
    for (const item of doc.items) {
      const curr = rateGroups.get(item.rate) || { val: 0, taxable: 0, cess: 0 };
      curr.val += item.lineTotal;
      curr.taxable += item.taxableValue;
      curr.cess += item.cess;
      rateGroups.set(item.rate, curr);
    }
    if (rateGroups.size === 0) rateGroups.set(5.0, { val: doc.totalValue, taxable: doc.taxableValue, cess: 0 });

    for (const [rate, grp] of rateGroups.entries()) {
      const val = round2(grp.val);
      const taxable = round2(grp.taxable);
      const cess = round2(grp.cess);

      b2bRows.push([
        doc.customerGstin,
        doc.customerName,
        doc.docNumber,
        doc.dateFormatted,
        val,
        doc.placeOfSupply,
        'N',
        '',
        'Regular B2B',
        '',
        rate,
        taxable,
        cess,
      ]);

      b2bTotalVal += val;
      b2bTotalTaxable += taxable;
      b2bTotalCess += cess;
    }
  }

  // --------------------------------------------------------------------------
  // SHEET 3: b2cl (B2C Large: Inter-state unregistered > ₹2,50,000)
  // --------------------------------------------------------------------------
  const b2clHeaders = [
    'Invoice Number',
    'Invoice date',
    'Invoice Value',
    'Place Of Supply',
    'Applicable % of Tax Rate',
    'Rate',
    'Taxable Value',
    'Cess Amount',
    'E-Commerce GSTIN',
  ];

  const b2clDocs = normalizedDocs.filter((d) => !d.isB2B && !d.isReturn && d.isInterState && d.totalValue > 250000);
  const b2clRows: (string | number)[][] = [];
  let b2clTotalVal = 0;
  let b2clTotalTaxable = 0;
  let b2clTotalCess = 0;

  for (const doc of b2clDocs) {
    b2clRows.push([
      doc.docNumber,
      doc.dateFormatted,
      doc.totalValue,
      doc.placeOfSupply,
      '',
      5.0,
      doc.taxableValue,
      0.0,
      '',
    ]);
    b2clTotalVal += doc.totalValue;
    b2clTotalTaxable += doc.taxableValue;
    b2clTotalCess += doc.cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 4: b2cs (B2C Small: All other unregistered sales, aggregated by POS & Rate)
  // --------------------------------------------------------------------------
  const b2csHeaders = [
    'Type',
    'Place Of Supply',
    'Applicable % of Tax Rate',
    'Rate',
    'Taxable Value',
    'Cess Amount',
    'E-Commerce GSTIN',
  ];

  const b2csDocs = normalizedDocs.filter((d) => !d.isB2B && !d.isReturn && !(d.isInterState && d.totalValue > 250000));
  const b2csAggMap = new Map<string, { pos: string; rate: number; taxable: number; cess: number }>();

  for (const doc of b2csDocs) {
    for (const item of doc.items) {
      const key = `${doc.placeOfSupply}_${item.rate}`;
      const curr = b2csAggMap.get(key) || { pos: doc.placeOfSupply, rate: item.rate, taxable: 0, cess: 0 };
      curr.taxable += item.taxableValue;
      curr.cess += item.cess;
      b2csAggMap.set(key, curr);
    }
  }

  const b2csRows: (string | number)[][] = [];
  let b2csTotalTaxable = 0;
  let b2csTotalCess = 0;

  for (const entry of b2csAggMap.values()) {
    const taxable = round2(entry.taxable);
    const cess = round2(entry.cess);
    b2csRows.push(['OE', entry.pos, '', entry.rate, taxable, cess, '']);
    b2csTotalTaxable += taxable;
    b2csTotalCess += cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 5: cdnr (Credit/Debit Notes Registered)
  // --------------------------------------------------------------------------
  const cdnrHeaders = [
    'GSTIN/UIN of Recipient',
    'Receiver Name',
    'Note Number',
    'Note Date',
    'Note Type',
    'Place Of Supply',
    'Reverse Charge',
    'Note Supply Type',
    'Note Value',
    'Applicable % of Tax Rate',
    'Rate',
    'Taxable Value',
    'Cess Amount',
  ];

  const cdnrDocs = normalizedDocs.filter((d) => d.isB2B && d.isReturn);
  const cdnrRecipients = new Set(cdnrDocs.map((d) => d.customerGstin));
  const cdnrRows: (string | number)[][] = [];
  let cdnrTotalVal = 0;
  let cdnrTotalTaxable = 0;
  let cdnrTotalCess = 0;

  for (const doc of cdnrDocs) {
    cdnrRows.push([
      doc.customerGstin,
      doc.customerName,
      doc.docNumber,
      doc.dateFormatted,
      'C',
      doc.placeOfSupply,
      'N',
      'Regular',
      doc.totalValue,
      '',
      5.0,
      doc.taxableValue,
      doc.cess,
    ]);
    cdnrTotalVal += doc.totalValue;
    cdnrTotalTaxable += doc.taxableValue;
    cdnrTotalCess += doc.cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 6: cdnur (Credit/Debit Notes Unregistered)
  // --------------------------------------------------------------------------
  const cdnurHeaders = [
    'UR Type',
    'Note Number',
    'Note Date',
    'Note Type',
    'Place Of Supply',
    'Note Value',
    'Applicable % of Tax Rate',
    'Rate',
    'Taxable Value',
    'Cess Amount',
  ];

  const cdnurDocs = normalizedDocs.filter((d) => !d.isB2B && d.isReturn);
  const cdnurRows: (string | number)[][] = [];
  let cdnurTotalVal = 0;
  let cdnurTotalTaxable = 0;
  let cdnurTotalCess = 0;

  for (const doc of cdnurDocs) {
    cdnurRows.push([
      'B2CS',
      doc.docNumber,
      doc.dateFormatted,
      'C',
      doc.placeOfSupply,
      doc.totalValue,
      '',
      5.0,
      doc.taxableValue,
      doc.cess,
    ]);
    cdnurTotalVal += doc.totalValue;
    cdnurTotalTaxable += doc.taxableValue;
    cdnurTotalCess += doc.cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 7: exp (Exports)
  // --------------------------------------------------------------------------
  const expHeaders = [
    'Export Type',
    'Invoice Number',
    'Invoice date',
    'Invoice Value',
    'Port Code',
    'Shipping Bill Number',
    'Shipping Bill Date',
    'Rate',
    'Taxable Value',
  ];
  const expRows: (string | number)[][] = [];

  // --------------------------------------------------------------------------
  // SHEET 8 & 9: at & atadj (Advances)
  // --------------------------------------------------------------------------
  const atHeaders = ['Place Of Supply', 'Applicable % of Tax Rate', 'Rate', 'Gross Advance Received', 'Cess Amount'];
  const atRows: (string | number)[][] = [];

  const atadjHeaders = ['Place Of Supply', 'Applicable % of Tax Rate', 'Rate', 'Gross Advance Adjusted', 'Cess Amount'];
  const atadjRows: (string | number)[][] = [];

  // --------------------------------------------------------------------------
  // SHEET 10: exemp (Nil Rated / Exempt)
  // --------------------------------------------------------------------------
  const exempHeaders = [
    'Description',
    'Nil Rated Supplies',
    'Exempted(other than nil rated/non GST supply)',
    'Non-GST Supplies',
  ];
  const exempRows: (string | number)[][] = [
    ['', '', '', ''],
    ['Inter-State supplies to registered persons', '0.00', '0.00', '0'],
    ['Intra-State supplies to registered persons', '0.00', '0.00', '0'],
    ['Inter-State supplies to unregistered persons', '0.00', '0.00', '0'],
    ['Intra-State supplies to unregistered persons', '0.00', '0.00', '0'],
  ];

  // --------------------------------------------------------------------------
  // SHEET 11: hsn(b2b) (HSN Summary for B2B)
  // --------------------------------------------------------------------------
  const hsnHeaders = [
    'HSN',
    'Description',
    'UQC',
    'Total Quantity',
    'Total Value',
    'Rate',
    'Taxable Value',
    'Integrated Tax Amount',
    'Central Tax Amount',
    'State/UT Tax Amount',
    'Cess Amount',
  ];

  const hsnB2bMap = new Map<
    string,
    {
      hsn: string;
      desc: string;
      uqc: string;
      qty: number;
      val: number;
      rate: number;
      taxable: number;
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    }
  >();

  for (const doc of b2bDocs) {
    for (const item of doc.items) {
      const key = `${item.hsn}_${item.uqc}_${item.rate}`;
      const curr = hsnB2bMap.get(key) || {
        hsn: item.hsn,
        desc: '',
        uqc: item.uqc,
        qty: 0,
        val: 0,
        rate: item.rate,
        taxable: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        cess: 0,
      };
      curr.qty += item.quantity;
      curr.val += item.lineTotal;
      curr.taxable += item.taxableValue;
      curr.igst += item.igst;
      curr.cgst += item.cgst;
      curr.sgst += item.sgst;
      curr.cess += item.cess;
      hsnB2bMap.set(key, curr);
    }
  }

  const hsnB2bRows: (string | number)[][] = [];
  let hsnB2bSumVal = 0;
  let hsnB2bSumTaxable = 0;
  let hsnB2bSumIgst = 0;
  let hsnB2bSumCgst = 0;
  let hsnB2bSumSgst = 0;
  let hsnB2bSumCess = 0;

  for (const entry of hsnB2bMap.values()) {
    const val = round2(entry.val);
    const taxable = round2(entry.taxable);
    const igst = round2(entry.igst);
    const cgst = round2(entry.cgst);
    const sgst = round2(entry.sgst);
    const cess = round2(entry.cess);

    hsnB2bRows.push([
      entry.hsn,
      entry.desc,
      entry.uqc,
      round2(entry.qty),
      val,
      entry.rate,
      taxable,
      igst,
      cgst,
      sgst,
      cess,
    ]);

    hsnB2bSumVal += val;
    hsnB2bSumTaxable += taxable;
    hsnB2bSumIgst += igst;
    hsnB2bSumCgst += cgst;
    hsnB2bSumSgst += sgst;
    hsnB2bSumCess += cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 12: hsn(b2c) (HSN Summary for B2C)
  // --------------------------------------------------------------------------
  const hsnB2cMap = new Map<
    string,
    {
      hsn: string;
      desc: string;
      uqc: string;
      qty: number;
      val: number;
      rate: number;
      taxable: number;
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    }
  >();

  const b2cDocs = normalizedDocs.filter((d) => !d.isB2B && !d.isReturn);
  for (const doc of b2cDocs) {
    for (const item of doc.items) {
      const key = `${item.hsn}_${item.uqc}_${item.rate}`;
      const curr = hsnB2cMap.get(key) || {
        hsn: item.hsn,
        desc: '',
        uqc: item.uqc,
        qty: 0,
        val: 0,
        rate: item.rate,
        taxable: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        cess: 0,
      };
      curr.qty += item.quantity;
      curr.val += item.lineTotal;
      curr.taxable += item.taxableValue;
      curr.igst += item.igst;
      curr.cgst += item.cgst;
      curr.sgst += item.sgst;
      curr.cess += item.cess;
      hsnB2cMap.set(key, curr);
    }
  }

  const hsnB2cRows: (string | number)[][] = [];
  let hsnB2cSumVal = 0;
  let hsnB2cSumTaxable = 0;
  let hsnB2cSumIgst = 0;
  let hsnB2cSumCgst = 0;
  let hsnB2cSumSgst = 0;
  let hsnB2cSumCess = 0;

  for (const entry of hsnB2cMap.values()) {
    const val = round2(entry.val);
    const taxable = round2(entry.taxable);
    const igst = round2(entry.igst);
    const cgst = round2(entry.cgst);
    const sgst = round2(entry.sgst);
    const cess = round2(entry.cess);

    hsnB2cRows.push([
      entry.hsn,
      entry.desc,
      entry.uqc,
      round2(entry.qty),
      val,
      entry.rate,
      taxable,
      igst,
      cgst,
      sgst,
      cess,
    ]);

    hsnB2cSumVal += val;
    hsnB2cSumTaxable += taxable;
    hsnB2cSumIgst += igst;
    hsnB2cSumCgst += cgst;
    hsnB2cSumSgst += sgst;
    hsnB2cSumCess += cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 13: docs (Documents Summary)
  // --------------------------------------------------------------------------
  const docsHeaders = ['Nature of Document', 'Sr. No. From', 'Sr. No. To', 'Total Number', 'Cancelled'];

  const invoiceDocs = normalizedDocs.filter((d) => !d.isReturn);
  const creditNoteDocs = normalizedDocs.filter((d) => d.isReturn);

  const invFrom = invoiceDocs.length > 0 ? (invoiceDocs[0]?.docNumber || '') : '';
  const invTo = invoiceDocs.length > 0 ? (invoiceDocs[invoiceDocs.length - 1]?.docNumber || '') : '';
  const cdnFrom = creditNoteDocs.length > 0 ? (creditNoteDocs[0]?.docNumber || '') : '';
  const cdnTo = creditNoteDocs.length > 0 ? (creditNoteDocs[creditNoteDocs.length - 1]?.docNumber || '') : '';

  const docsRows: (string | number)[][] = [
    ['Credit Note', cdnFrom, cdnTo, creditNoteDocs.length, 0.0],
    ['Invoices for outward supply', invFrom, invTo, invoiceDocs.length, 0.0],
  ];

  // --------------------------------------------------------------------------
  // SHEET 14: itemWiseSale (Product-wise Sales Breakdown)
  // --------------------------------------------------------------------------
  const itemWiseSaleMap = new Map<
    string,
    {
      hsn: string;
      desc: string;
      uqc: string;
      qty: number;
      val: number;
      rate: number;
      taxable: number;
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    }
  >();

  for (const doc of invoiceDocs) {
    for (const item of doc.items) {
      const key = `${item.name}_${item.rate}`;
      const curr = itemWiseSaleMap.get(key) || {
        hsn: item.hsn,
        desc: item.name,
        uqc: item.uqc,
        qty: 0,
        val: 0,
        rate: item.rate,
        taxable: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        cess: 0,
      };
      curr.qty += item.quantity;
      curr.val += item.lineTotal;
      curr.taxable += item.taxableValue;
      curr.igst += item.igst;
      curr.cgst += item.cgst;
      curr.sgst += item.sgst;
      curr.cess += item.cess;
      itemWiseSaleMap.set(key, curr);
    }
  }

  const itemWiseSaleRows: (string | number)[][] = [];
  let itemSaleSumVal = 0;
  let itemSaleSumTaxable = 0;
  let itemSaleSumIgst = 0;
  let itemSaleSumCgst = 0;
  let itemSaleSumSgst = 0;
  let itemSaleSumCess = 0;

  for (const entry of itemWiseSaleMap.values()) {
    const val = round2(entry.val);
    const taxable = round2(entry.taxable);
    const igst = round2(entry.igst);
    const cgst = round2(entry.cgst);
    const sgst = round2(entry.sgst);
    const cess = round2(entry.cess);

    itemWiseSaleRows.push([
      entry.hsn,
      entry.desc,
      entry.uqc,
      round2(entry.qty),
      val,
      entry.rate,
      taxable,
      igst,
      cgst,
      sgst,
      cess,
    ]);

    itemSaleSumVal += val;
    itemSaleSumTaxable += taxable;
    itemSaleSumIgst += igst;
    itemSaleSumCgst += cgst;
    itemSaleSumSgst += sgst;
    itemSaleSumCess += cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 15: itemWiseSaleReturn (Product-wise Sales Returns Breakdown)
  // --------------------------------------------------------------------------
  const itemWiseReturnMap = new Map<
    string,
    {
      hsn: string;
      desc: string;
      uqc: string;
      qty: number;
      val: number;
      rate: number;
      taxable: number;
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    }
  >();

  for (const doc of creditNoteDocs) {
    for (const item of doc.items) {
      const key = `${item.name}_${item.rate}`;
      const curr = itemWiseReturnMap.get(key) || {
        hsn: item.hsn,
        desc: item.name,
        uqc: item.uqc,
        qty: 0,
        val: 0,
        rate: item.rate,
        taxable: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        cess: 0,
      };
      curr.qty += item.quantity;
      curr.val += item.lineTotal;
      curr.taxable += item.taxableValue;
      curr.igst += item.igst;
      curr.cgst += item.cgst;
      curr.sgst += item.sgst;
      curr.cess += item.cess;
      itemWiseReturnMap.set(key, curr);
    }
  }

  const itemWiseReturnRows: (string | number)[][] = [];
  let itemRetSumVal = 0;
  let itemRetSumTaxable = 0;
  let itemRetSumIgst = 0;
  let itemRetSumCgst = 0;
  let itemRetSumSgst = 0;
  let itemRetSumCess = 0;

  for (const entry of itemWiseReturnMap.values()) {
    const val = round2(entry.val);
    const taxable = round2(entry.taxable);
    const igst = round2(entry.igst);
    const cgst = round2(entry.cgst);
    const sgst = round2(entry.sgst);
    const cess = round2(entry.cess);

    itemWiseReturnRows.push([
      entry.hsn,
      entry.desc,
      entry.uqc,
      round2(entry.qty),
      val,
      entry.rate,
      taxable,
      igst,
      cgst,
      sgst,
      cess,
    ]);

    itemRetSumVal += val;
    itemRetSumTaxable += taxable;
    itemRetSumIgst += igst;
    itemRetSumCgst += cgst;
    itemRetSumSgst += sgst;
    itemRetSumCess += cess;
  }

  // --------------------------------------------------------------------------
  // SHEET 16: itemSummary (Net Product Summary = Sale - Return)
  // --------------------------------------------------------------------------
  const itemSummaryMap = new Map<
    string,
    {
      hsn: string;
      desc: string;
      uqc: string;
      qty: number;
      val: number;
      rate: number;
      taxable: number;
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    }
  >();

  for (const [key, s] of itemWiseSaleMap.entries()) {
    itemSummaryMap.set(key, { ...s });
  }
  for (const [key, r] of itemWiseReturnMap.entries()) {
    const curr = itemSummaryMap.get(key);
    if (curr) {
      curr.qty = Math.max(0, curr.qty - r.qty);
      curr.val = Math.max(0, curr.val - r.val);
      curr.taxable = Math.max(0, curr.taxable - r.taxable);
      curr.igst = Math.max(0, curr.igst - r.igst);
      curr.cgst = Math.max(0, curr.cgst - r.cgst);
      curr.sgst = Math.max(0, curr.sgst - r.sgst);
      curr.cess = Math.max(0, curr.cess - r.cess);
    }
  }

  const itemSummaryRows: (string | number)[][] = [];
  let itemSumVal = 0;
  let itemSumTaxable = 0;
  let itemSumIgst = 0;
  let itemSumCgst = 0;
  let itemSumSgst = 0;
  let itemSumCess = 0;

  for (const entry of itemSummaryMap.values()) {
    const val = round2(entry.val);
    const taxable = round2(entry.taxable);
    const igst = round2(entry.igst);
    const cgst = round2(entry.cgst);
    const sgst = round2(entry.sgst);
    const cess = round2(entry.cess);

    itemSummaryRows.push([
      entry.hsn,
      entry.desc,
      entry.uqc,
      round2(entry.qty),
      val,
      entry.rate,
      taxable,
      igst,
      cgst,
      sgst,
      cess,
    ]);

    itemSumVal += val;
    itemSumTaxable += taxable;
    itemSumIgst += igst;
    itemSumCgst += cgst;
    itemSumSgst += sgst;
    itemSumCess += cess;
  }

  const countUniqueHsn = (rows: (string | number)[][]) => {
    const set = new Set<string>();
    for (const r of rows) {
      const hsn = String(r[0] || '').trim();
      if (hsn) set.add(hsn);
    }
    return set.size;
  };

  return {
    company: {
      gstin: companyGstin,
      legalName: companyLegalName,
      tradeName: companyTradeName,
      stateCode: companyStateCode,
      stateName: companyStateName || 'Tamil Nadu',
    },
    period: {
      fromYear,
      toYear,
      fromMonth: fromMonth || 'June',
      toMonth: toMonth || 'June',
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    },
    summary: {
      totalDocuments: normalizedDocs.length,
      b2bInvoicesCount: b2bDocs.length,
      b2cInvoicesCount: b2csDocs.length + b2clDocs.length,
      creditNotesCount: creditNoteDocs.length,
      totalValue: round2(gstr1SumVal),
      totalTaxableValue: round2(gstr1SumTaxable),
      totalIgst: round2(gstr1SumIgst),
      totalCgst: round2(gstr1SumCgst),
      totalSgst: round2(gstr1SumSgst),
      totalCess: round2(gstr1SumCess),
    },
    sheets: {
      gstr1Report: {
        headers1: gstr1Headers1,
        headers2: gstr1Headers2,
        rows: gstr1Rows,
        totals: gstr1Totals,
      },
      b2b: {
        summary: {
          recipientsCount: b2bRecipients.size,
          invoicesCount: b2bDocs.length,
          totalValue: round2(b2bTotalVal),
          taxableValue: round2(b2bTotalTaxable),
          totalCess: round2(b2bTotalCess),
        },
        headers: b2bHeaders,
        rows: b2bRows,
      },
      b2cl: {
        summary: {
          invoicesCount: b2clDocs.length,
          totalValue: round2(b2clTotalVal),
          taxableValue: round2(b2clTotalTaxable),
          totalCess: round2(b2clTotalCess),
        },
        headers: b2clHeaders,
        rows: b2clRows,
      },
      b2cs: {
        summary: {
          taxableValue: round2(b2csTotalTaxable),
          totalCess: round2(b2csTotalCess),
        },
        headers: b2csHeaders,
        rows: b2csRows,
      },
      cdnr: {
        summary: {
          recipientsCount: cdnrRecipients.size,
          notesCount: cdnrDocs.length,
          totalValue: round2(cdnrTotalVal),
          taxableValue: round2(cdnrTotalTaxable),
          totalCess: round2(cdnrTotalCess),
        },
        headers: cdnrHeaders,
        rows: cdnrRows,
      },
      cdnur: {
        summary: {
          notesCount: cdnurDocs.length,
          totalValue: round2(cdnurTotalVal),
          taxableValue: round2(cdnurTotalTaxable),
          totalCess: round2(cdnurTotalCess),
        },
        headers: cdnurHeaders,
        rows: cdnurRows,
      },
      exp: {
        summary: {
          invoicesCount: 0,
          totalValue: 0.0,
          shippingBillsCount: 0,
          taxableValue: 0.0,
        },
        headers: expHeaders,
        rows: expRows,
      },
      at: {
        headers: atHeaders,
        rows: atRows,
      },
      atadj: {
        headers: atadjHeaders,
        rows: atadjRows,
      },
      exemp: {
        headers: exempHeaders,
        rows: exempRows,
      },
      hsnB2b: {
        summary: {
          hsnCount: countUniqueHsn(hsnB2bRows),
          totalValue: round2(hsnB2bSumVal),
          taxableValue: round2(hsnB2bSumTaxable),
          totalIgst: round2(hsnB2bSumIgst),
          totalCgst: round2(hsnB2bSumCgst),
          totalSgst: round2(hsnB2bSumSgst),
          totalCess: round2(hsnB2bSumCess),
        },
        headers: hsnHeaders,
        rows: hsnB2bRows,
      },
      hsnB2c: {
        summary: {
          hsnCount: countUniqueHsn(hsnB2cRows),
          totalValue: round2(hsnB2cSumVal),
          taxableValue: round2(hsnB2cSumTaxable),
          totalIgst: round2(hsnB2cSumIgst),
          totalCgst: round2(hsnB2cSumCgst),
          totalSgst: round2(hsnB2cSumSgst),
          totalCess: round2(hsnB2cSumCess),
        },
        headers: hsnHeaders,
        rows: hsnB2cRows,
      },
      docs: {
        summary: {
          totalNumber: normalizedDocs.length,
          totalCancelled: 0.0,
        },
        headers: docsHeaders,
        rows: docsRows,
      },
      itemWiseSale: {
        summary: {
          hsnCount: countUniqueHsn(itemWiseSaleRows),
          totalValue: round2(itemSaleSumVal),
          taxableValue: round2(itemSaleSumTaxable),
          totalIgst: round2(itemSaleSumIgst),
          totalCgst: round2(itemSaleSumCgst),
          totalSgst: round2(itemSaleSumSgst),
          totalCess: round2(itemSaleSumCess),
        },
        headers: hsnHeaders,
        rows: itemWiseSaleRows,
      },
      itemWiseSaleReturn: {
        summary: {
          hsnCount: countUniqueHsn(itemWiseReturnRows),
          totalValue: round2(itemRetSumVal),
          taxableValue: round2(itemRetSumTaxable),
          totalIgst: round2(itemRetSumIgst),
          totalCgst: round2(itemRetSumCgst),
          totalSgst: round2(itemRetSumSgst),
          totalCess: round2(itemRetSumCess),
        },
        headers: hsnHeaders,
        rows: itemWiseReturnRows,
      },
      itemSummary: {
        summary: {
          hsnCount: countUniqueHsn(itemSummaryRows),
          totalValue: round2(itemSumVal),
          taxableValue: round2(itemSumTaxable),
          totalIgst: round2(itemSumIgst),
          totalCgst: round2(itemSumCgst),
          totalSgst: round2(itemSumSgst),
          totalCess: round2(itemSumCess),
        },
        headers: hsnHeaders,
        rows: itemSummaryRows,
      },
    },
  };
}
