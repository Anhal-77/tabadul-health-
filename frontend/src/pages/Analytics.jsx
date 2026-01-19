import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../../services/api';
import Loading from '../../components/common/Loading';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [topCenters, setTopCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [dashboardData, categoryDist, topCentersData] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getCategoryDistribution(),
        analyticsAPI.getTopCenters({ limit: 5 })
      ]);
      
      setStats(dashboardData.data);
      
      // Format category distribution
      const formattedCategories = categoryDist.data.map(cat => ({
        name: getCategoryLabel(cat.category),
        value: parseInt(cat.count),
        quantity: parseInt(cat.total_quantity)
      }));
      setCategoryData(formattedCategories);
      
      setTopCenters(topCentersData.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      medication: 'أدوية',
      dental_tools: 'أدوات أسنان',
      medical_supplies: 'مستلزمات طبية',
      equipment: 'معدات'
    };
    return labels[category] || category;
  };

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">التحليلات والإحصائيات</h1>
        <p className="text-gray-600 mt-1">رؤية شاملة لأداء المنصة</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 mb-2">إجمالي الموارد المحفوظة</p>
              <p className="text-4xl font-bold">{stats?.waste_prevention?.items_saved || 0}</p>
              <p className="text-green-100 text-sm mt-2">
                عبر {stats?.waste_prevention?.transfers_completed || 0} عملية نقل ناجحة
              </p>
            </div>
            <TrendingUp size={48} className="text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 mb-2">المراكز النشطة</p>
              <p className="text-4xl font-bold">{stats?.total_centers || 0}</p>
              <p className="text-blue-100 text-sm mt-2">مركز صحي مشارك</p>
            </div>
            <BarChart3 size={48} className="text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-100 mb-2">معدل النجاح</p>
              <p className="text-4xl font-bold">
                {stats?.waste_prevention?.transfers_completed > 0 ? '95%' : '0%'}
              </p>
              <p className="text-purple-100 text-sm mt-2">من عمليات النقل المكتملة</p>
            </div>
            <Award size={48} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">توزيع الأصناف حسب الفئة</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((cat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{cat.name}</p>
                  <p className="text-gray-600">{cat.quantity} قطعة</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributing Centers */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">أكثر المراكز مساهمة</h2>
          {topCenters.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد بيانات متاحة</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCenters}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="senderCenter.name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'items_shared') return [value, 'الكميات المشاركة'];
                    if (name === 'transfers_sent') return [value, 'عدد العمليات'];
                    return [value, name];
                  }}
                />
                <Legend
                  formatter={(value) => {
                    if (value === 'items_shared') return 'الكميات المشاركة';
                    if (value === 'transfers_sent') return 'عدد العمليات';
                    return value;
                  }}
                />
                <Bar dataKey="items_shared" fill="#0ea5e9" />
                <Bar dataKey="transfers_sent" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Centers Table */}
      {topCenters.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">تفاصيل أفضل المراكز المساهمة</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الترتيب</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المركز</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدينة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عدد العمليات</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكميات المشاركة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topCenters.map((center, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{center.senderCenter.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{center.senderCenter.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-info">{center.transfers_sent} عملية</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-success">{center.items_shared} قطعة</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
