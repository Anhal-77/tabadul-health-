import { useEffect, useState } from 'react';
import { inventoryAPI, transfersAPI } from '../services/api';
import { FaSearch, FaFilter, FaExchangeAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const Marketplace = () => {
  const [surplusItems, setSurplusItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    search: ''
  });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchSurplusItems();
  }, [filters]);

  const fetchSurplusItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getSurplus(filters);
      setSurplusItems(response.data.data);
    } catch (error) {
      console.error('Error fetching surplus items:', error);
      toast.error('حدث خطأ في جلب الأصناف');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTransfer = (item) => {
    setSelectedItem(item);
    setShowRequestModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">سوق الفائض</h1>
        <p className="text-gray-600">استعرض الأصناف المتاحة للنقل من المراكز الأخرى</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن صنف..."
              className="w-full pr-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Category Filter */}
          <select
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">جميع التصنيفات</option>
            <option value="medications">أدوية</option>
            <option value="dental_supplies">مستلزمات طب الأسنان</option>
            <option value="medical_equipment">معدات طبية</option>
            <option value="consumables">مستهلكات</option>
            <option value="vaccines">لقاحات</option>
            <option value="other">أخرى</option>
          </select>

          {/* City Filter */}
          <input
            type="text"
            placeholder="المدينة..."
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : surplusItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">لا توجد أصناف متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surplusItems.map((item) => (
            <SurplusItemCard
              key={item.id}
              item={item}
              onRequest={handleRequestTransfer}
            />
          ))}
        </div>
      )}

      {/* Transfer Request Modal */}
      {showRequestModal && (
        <TransferRequestModal
          item={selectedItem}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            fetchSurplusItems();
            toast.success('تم إرسال الطلب بنجاح');
          }}
        />
      )}
    </div>
  );
};

// Surplus Item Card Component
const SurplusItemCard = ({ item, onRequest }) => {
  const daysUntilExpiry = Math.ceil(
    (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const getExpiryColor = () => {
    if (daysUntilExpiry <= 30) return 'text-red-600 bg-red-100';
    if (daysUntilExpiry <= 60) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800">{item.item_name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExpiryColor()}`}>
          {daysUntilExpiry} يوم متبقي
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="ml-2 text-primary-500" />
          <span className="text-sm">{item.health_center?.name}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaClock className="ml-2 text-secondary-500" />
          <span className="text-sm">
            تاريخ الانتهاء: {new Date(item.expiry_date).toLocaleDateString('ar-SA')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">الكمية</p>
          <p className="font-bold text-gray-800">{item.quantity} {item.unit}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">رقم الدفعة</p>
          <p className="font-bold text-gray-800">{item.batch_number}</p>
        </div>
      </div>

      {item.manufacturer && (
        <p className="text-sm text-gray-600 mb-4">الشركة: {item.manufacturer}</p>
      )}

      <button
        onClick={() => onRequest(item)}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <FaExchangeAlt />
        طلب نقل
      </button>
    </div>
  );
};

// Transfer Request Modal Component
const TransferRequestModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    receiver_center_id: '',
    priority: 'medium',
    requester_name: '',
    requester_email: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await transfersAPI.create({
        item_id: item.id,
        sender_center_id: item.center_id,
        ...formData
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating transfer request:', error);
      toast.error('حدث خطأ في إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">طلب نقل صنف</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="font-bold text-gray-800">{item.item_name}</p>
          <p className="text-sm text-gray-600">الكمية المتاحة: {item.quantity} {item.unit}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">الكمية المطلوبة</label>
              <input
                type="number"
                min="1"
                max={item.quantity}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">الأولوية</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">اسم مقدم الطلب</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.requester_name}
              onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.requester_email}
              onChange={(e) => setFormData({ ...formData, requester_email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">سبب الطلب</label>
            <textarea
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Marketplace;
