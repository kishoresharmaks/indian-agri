import connectToDatabase from '@/lib/db';
import SaleDocument from '@/models/SaleDocument';
import PurchaseDocument from '@/models/PurchaseDocument';
import Expense from '@/models/Expense';
import Order from '@/models/Order';

export interface PnLSummary {
  startDate?: string;
  endDate?: string;
  grossSalesRevenue: number; // Sale Invoices + POS Sales - Sale Returns
  onlineStoreSales: number;
  posCounterSales: number;
  salesReturnTotal: number;
  netSalesRevenue: number;

  purchaseBillTotal: number; // Purchase Bills - Purchase Returns
  purchaseReturnTotal: number;
  costOfGoodsSold: number; // COGS

  grossProfit: number; // Net Sales Revenue - COGS

  totalExpenses: number;
  expenseByCategory: { category: string; amount: number }[];

  netProfit: number;
  isProfit: boolean;

  outputGstCollected: number;
  inputGstCredit: number;
  netGstPayable: number;
}

export async function calculatePnL(startDate?: string, endDate?: string): Promise<PnLSummary> {
  await connectToDatabase();

  const queryFilter: any = {};
  if (startDate || endDate) {
    queryFilter.createdAt = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      queryFilter.createdAt.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      queryFilter.createdAt.$lte = end;
    }
  }

function round2(num: number): number {
  return Math.round((Number(num) || 0) * 100) / 100;
}

  // 1. Sales Calculation (Net Taxable Revenue excluding GST)
  const saleDocs = await SaleDocument.find(queryFilter).lean();
  let b2bSaleInvoiceTotal = 0;
  let salesReturnTotal = 0;
  let saleOutputGst = 0;

  for (const doc of saleDocs) {
    const netDocTaxable = Math.max(0, (doc.subtotal || 0) - (doc.discountAmount || 0));
    if (doc.docType === 'SALE_INVOICE') {
      b2bSaleInvoiceTotal += netDocTaxable;
      saleOutputGst += doc.totalGst || 0;
    } else if (doc.docType === 'SALE_RETURN') {
      salesReturnTotal += netDocTaxable;
      saleOutputGst -= doc.totalGst || 0;
    }
  }

  // Also include storefront e-commerce orders & POS sales from Order collection
  const orderFilter: any = { status: { $ne: 'Cancelled' } };
  if (startDate || endDate) {
    orderFilter.createdAt = queryFilter.createdAt;
  }
  const allOrders = await Order.find(orderFilter).lean();

  let onlineStoreSales = 0;
  let posCounterSales = 0;

  for (const ord of allOrders) {
    const netOrderTaxable = Math.max(0, (ord.subtotal || 0) - (ord.discountAmount || 0));
    if (ord.orderType === 'POS') {
      posCounterSales += netOrderTaxable;
    } else {
      onlineStoreSales += netOrderTaxable;
    }

    // Exact GST liability from items or totalGst
    const orderGst =
      ord.items && ord.items.length > 0
        ? ord.items.reduce(
            (sum: number, itm: any) =>
              sum + (Number(itm.price || 0) * Number(itm.quantity || 1) * Number(itm.gst || 0)) / 100,
            0
          )
        : ord.totalGst || 0;
    saleOutputGst += orderGst;
  }

  const grossSalesRevenue = round2(b2bSaleInvoiceTotal + onlineStoreSales + posCounterSales);
  const netSalesRevenue = round2(Math.max(0, grossSalesRevenue - salesReturnTotal));

  // 2. Purchases Calculation (COGS - Net Taxable Cost excluding ITC GST)
  const purchaseDocs = await PurchaseDocument.find(queryFilter).lean();
  let purchaseBillTotal = 0;
  let purchaseReturnTotal = 0;
  let purchaseInputGst = 0;

  for (const doc of purchaseDocs) {
    const netPurchaseTaxable = Math.max(0, (doc.subtotal || 0) - (doc.discountAmount || 0));
    if (doc.docType === 'PURCHASE_BILL') {
      purchaseBillTotal += netPurchaseTaxable;
      purchaseInputGst += doc.totalGst || 0;
    } else if (doc.docType === 'PURCHASE_RETURN') {
      purchaseReturnTotal += netPurchaseTaxable;
      purchaseInputGst -= doc.totalGst || 0;
    }
  }

  const costOfGoodsSold = round2(Math.max(0, purchaseBillTotal - purchaseReturnTotal));
  const grossProfit = round2(netSalesRevenue - costOfGoodsSold);

  // 3. Operating Expenses Calculation
  const expFilter: any = {};
  if (startDate || endDate) {
    expFilter.$or = [{ date: queryFilter.createdAt }, { createdAt: queryFilter.createdAt }];
  }
  const expenses = await Expense.find(expFilter).lean();

  const categoryMap: { [cat: string]: number } = {};
  let totalExpenses = 0;

  for (const exp of expenses) {
    const cat = exp.categoryName || 'General';
    const amt = exp.amount || 0;
    categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    totalExpenses += amt;
  }

  const expenseByCategory = Object.keys(categoryMap).map((cat) => ({
    category: cat,
    amount: round2(categoryMap[cat] ?? 0),
  }));

  // 4. Net Profit / Loss
  totalExpenses = round2(totalExpenses);
  const netProfit = round2(grossProfit - totalExpenses);
  const isProfit = netProfit >= 0;

  // 5. Net GST Payable (Output GST - Input Tax Credit)
  const netGstPayable = round2(Math.max(0, saleOutputGst - purchaseInputGst));

  return {
    startDate,
    endDate,
    grossSalesRevenue,
    onlineStoreSales: round2(onlineStoreSales),
    posCounterSales: round2(posCounterSales),
    salesReturnTotal: round2(salesReturnTotal),
    netSalesRevenue,
    purchaseBillTotal: round2(purchaseBillTotal),
    purchaseReturnTotal: round2(purchaseReturnTotal),
    costOfGoodsSold,
    grossProfit,
    totalExpenses,
    expenseByCategory,
    netProfit,
    isProfit,
    outputGstCollected: round2(saleOutputGst),
    inputGstCredit: round2(purchaseInputGst),
    netGstPayable,
  };
}
