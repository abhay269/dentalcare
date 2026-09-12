import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';

export default function MyBills() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); const [pages, setPages] = useState(1); const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/invoices', { params: { page, limit: 10 } }); setInvoices(data.data); setPages(data.pages); setTotal(data.total); }
    catch {} finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalDue = invoices.filter(inv => inv.paymentStatus !== 'Paid').reduce((s, inv) => s + inv.total, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800">My Bills</h1><p className="text-slate-500 text-sm">{total} invoices</p></div>
      {totalDue > 0 && (
        <div className="card bg-orange-50 border-orange-200">
          <p className="text-orange-700 font-medium">💰 Total Amount Due: <span className="text-xl font-bold">₹{totalDue.toLocaleString('en-IN')}</span></p>
          <p className="text-sm text-orange-500 mt-1">Please contact the clinic to make payment</p>
        </div>
      )}
      <div className="card !p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : invoices.length===0 ? <EmptyState icon="🧾" title="No bills" description="Your billing history will appear here" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>{['Invoice','Date','Treatment','Subtotal','Discount','Total','Status'].map(h=><th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map(inv => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="table-cell font-mono text-xs">{inv.invoiceId}</td>
                    <td className="table-cell">{format(new Date(inv.createdAt),'dd MMM yyyy')}</td>
                    <td className="table-cell">{inv.treatment?.treatmentType||inv.items?.[0]?.description||'—'}</td>
                    <td className="table-cell">₹{inv.subtotal?.toLocaleString('en-IN')}</td>
                    <td className="table-cell">{inv.discount ? `-₹${inv.discount}` : '—'}</td>
                    <td className="table-cell font-semibold">₹{inv.total?.toLocaleString('en-IN')}</td>
                    <td className="table-cell"><StatusBadge status={inv.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} pages={pages} total={total} limit={10} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
