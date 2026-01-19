import { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { FaHospital, FaBoxes, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const COLORS = ['#00af9b', '#f59610', '#ef4444', '#3b82f6', '#8b5cf6'];

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم الرئيسية</h1>
        <p className="text-gray-600">نظرة شاملة على إدارة الموارد الصحية</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="المراكز الصحية"
          value={analytics?.overview?.total_centers || 0}
          icon={<FaHospital />}
          color="bg-primary-500"
        />
        <StatCard
          title="إجمالي المخزون"
          value={analytics?.overview?.total_inventory_items || 0}
          icon={<FaBoxes />}
          color="bg-secondary-500"
        />
        <StatCard
          title="طلبات النقل"
          value={analytics?.overview?.total_transfer_requests || 0}
          icon={<FaExchangeAlt />}
          color="bg-blue-500"
        />
        <StatCard
          title="أصناف قريبة الانتهاء"
          value={analytics?.overview?.items_expiring_soon || 0}
          icon={<FaChartLine />}
          color="bg-red-500"
        />
      </div>

      {/* Waste Prevention Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <FaChartLine className="text-green-600" />
          الهدر المالي الذي تم تجنبه
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 mb-2">إجمالي القيمة المحفوظة</p>
            <p className="text-4xl font-bold text-green-600">
              {parseFloat(analytics?.waste_prevention?.total_value_saved || 0).toLocaleString('ar-SA')} ريال
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 mb-2">عدد الأصناف المحفوظة</p>
            <p className="text-4xl font-bold text-green-600">
              {analytics?.waste_prevention?.total_items_saved || 0} صنف
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Surplus by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">الفائض حسب التصنيف</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.surplus_by_category || []}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => getCategoryName(entry.category)}
              >
                {analytics?.surplus_by_category?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, getCategoryName(name)]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transfers by Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">طلبات النقل حسب الحالة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.transfers_by_status || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" tickFormatter={getStatusName} />
              <YAxis />
              <Tooltip labelFormatter={getStatusName} />
              <Legend formatter={getStatusName} />
              <Bar dataKey="count" fill="#00af9b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع المخزون حسب التصنيف</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics?.category_distribution || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tickFormatter={getCategoryName} />
            <YAxis />
            <Tooltip labelFormatter={getCategoryName} />
            <Legend />
            <Bar dataKey="count" fill="#00af9b" name="عدد الأصناف" />
            <Bar dataKey="total_quantity" fill="#f59610" name="الكمية الإجمالية" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`${color} text-white p-4 rounded-lg ml-4`}>
      <div className="text-3xl">{icon}</div>
    </div>
    <div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Helper functions for translations
const getCategoryName = (category) => {
  const categories = {
    medications: 'أدوية',
    dental_supplies: 'مستلزمات طب الأسنان',
    medical_equipment: 'معدات طبية',
    consumables: 'مستهلكات',
    vaccines: 'لقاحات',
    other: 'أخرى'
  };
  return categories[category] || category;
};

const getStatusName = (status) => {
  const statuses = {
    pending: 'قيد الانتظار',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    shipped: 'تم الشحن',
    received: 'تم الاستلام',
    cancelled: 'ملغي',
    available: 'متوفر',
    surplus: 'فائض',
    critical: 'حرج',
    expired: 'منتهي',
    reserved: 'محجوز'
  };
  return statuses[status] || status;
};

export default Dashboard;
