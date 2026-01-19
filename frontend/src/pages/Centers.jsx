import { useState, useEffect } from 'react';
import { healthCentersAPI } from '../services/api';
import { FaHospital, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Centers = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await healthCentersAPI.getAll();
      setCenters(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">المراكز الصحية</h1>
        <p className="text-gray-600">جميع المراكز الصحية المسجلة في المنصة</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div key={center.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start mb-4">
                <div className="bg-primary-100 p-3 rounded-lg ml-4">
                  <FaHospital className="text-primary-600 text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{center.name}</h3>
                  {center.name_ar && (
                    <p className="text-sm text-gray-600">{center.name_ar}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="ml-2 text-primary-500" />
                  <span className="text-sm">{center.city}</span>
                </div>
                {center.manager_email && (
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="ml-2 text-secondary-500" />
                    <span className="text-sm">{center.manager_email}</span>
                  </div>
                )}
                {center.contact_info?.phone && (
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="ml-2 text-green-500" />
                    <span className="text-sm">{center.contact_info.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  center.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {center.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Centers;
