import { useEffect, useState } from 'react';
import { inventoryAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });

  useEffect(() => {
    fetchInventory();
  }, [filters]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAll(filters);
      setInventory(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('حدث خطأ في جلب المخزون');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      surplus: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      reserved: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      available: 'متوفر',
      surplus: 'فائض',
      critical: 'حرج',
      expired: 'منتهي',
      reserved: 'محجوز'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المخزون</h1>
          <p className="text-gray-600">عرض وإدارة جميع أصناف المخزون</p>
        </div>
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
          <FaPlus />
          إضافة صنف جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن صنف..."
              className="w-full pr-10 p-2 border border-gray-300 rounded-lg"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">جميع التصنيفات</option>
            <option value="medications">أدوية</option>
            <option value="dental_supplies">مستلزمات طب الأسنان</option>
            <option value="medical_equipment">معدات طبية</option>
            <option value="consumables">مستهلكات</option>
          </select>
          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">جميع الحالات</option>
            <option value="available">متوفر</option>
            <option value="surplus">فائض</option>
            <option value="critical">حرج</option>
            <option value="expired">منتهي</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصنف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المركز</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الانتهاء</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    لا توجد أصناف متاحة
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.item_name}</div>
                        <div className="text-sm text-gray-500">رقم الدفعة: {item.batch_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.health_center?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(item.expiry_date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
