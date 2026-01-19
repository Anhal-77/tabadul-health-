import { useState, useEffect } from 'react';
import { transfersAPI } from '../services/api';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await transfersAPI.getAll();
      setTransfers(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      shipped: 'bg-blue-100 text-blue-800',
      received: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      pending: 'قيد الانتظار',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      shipped: 'تم الشحن',
      received: 'تم الاستلام'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">طلبات النقل</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم التتبع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصنف</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">من</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إلى</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">جاري التحميل...</td>
              </tr>
            ) : transfers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">لا توجد طلبات</td>
              </tr>
            ) : (
              transfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{transfer.tracking_number}</td>
                  <td className="px-6 py-4 text-sm">{transfer.inventory_item?.item_name}</td>
                  <td className="px-6 py-4 text-sm">{transfer.sender_center?.name}</td>
                  <td className="px-6 py-4 text-sm">{transfer.receiver_center?.name}</td>
                  <td className="px-6 py-4 text-sm">{transfer.quantity}</td>
                  <td className="px-6 py-4">{getStatusBadge(transfer.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transfers;
