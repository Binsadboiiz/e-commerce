import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRightLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import axiosClient from '@/shared/features/auth/api/axiosClient';
import Button from '@/shared/components/ui/Button';
import SEOHead from '@/shared/components/SEOHead';

export const AdminRedirectManagerPage = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    sourceUrl: '',
    targetUrl: '',
    statusCode: 301,
    isRegex: false,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/redirects');
      setRules(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Failed to fetch redirect rules:', error);
      toast.error('Không thể tải danh sách quy tắc redirect.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleOpenModal = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        sourceUrl: rule.sourceUrl,
        targetUrl: rule.targetUrl,
        statusCode: rule.statusCode || 301,
        isRegex: rule.isRegex || false,
        isActive: rule.isActive ?? true
      });
    } else {
      setEditingRule(null);
      setFormData({
        sourceUrl: '',
        targetUrl: '',
        statusCode: 301,
        isRegex: false,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.sourceUrl.trim() || !formData.targetUrl.trim()) {
      toast.error('Vui lòng nhập đầy đủ Source URL và Target URL');
      return;
    }

    if (formData.sourceUrl.trim().toLowerCase() === formData.targetUrl.trim().toLowerCase()) {
      toast.error('Source URL và Target URL không được giống nhau');
      return;
    }

    try {
      setSaving(true);
      if (editingRule) {
        await axiosClient.put(`/admin/redirects/${editingRule.id}`, formData);
        toast.success('Cập nhật quy tắc chuyển hướng thành công!');
      } else {
        await axiosClient.post('/admin/redirects', formData);
        toast.success('Tạo quy tắc chuyển hướng mới thành công!');
      }
      handleCloseModal();
      fetchRules();
    } catch (error) {
      console.error('Error saving redirect rule:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu quy tắc.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/admin/redirects/${id}/toggle`);
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isActive: res.isActive } : r))
      );
      toast.success(res.isActive ? 'Đã kích hoạt quy tắc' : 'Đã tạm dừng quy tắc');
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast.error('Không thể thay đổi trạng thái.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quy tắc redirect này?')) return;

    try {
      await axiosClient.delete(`/admin/redirects/${id}`);
      setRules((prev) => prev.filter((r) => r.id !== id));
      toast.success('Đã xóa quy tắc chuyển hướng thành công.');
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Không thể xóa quy tắc này.');
    }
  };

  // Filtered Rules
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.sourceUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.targetUrl.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || String(rule.statusCode) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Analytics stats
  const totalRules = rules.length;
  const activeRules = rules.filter((r) => r.isActive).length;
  const total301 = rules.filter((r) => r.statusCode === 301).length;
  const total302 = rules.filter((r) => r.statusCode === 302).length;
  const totalHits = rules.reduce((acc, r) => acc + (r.hitCount || 0), 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <SEOHead title="Quản Lý Redirect Engine (301/302)" />

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ArrowRightLeft style={{ color: '#2563eb' }} size={26} />
            Redirect Engine & Canonical Tags System
          </h1>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
            Quản lý quy tắc chuyển hướng URL (301 Permanent / 302 Temporary) bảo toàn thứ hạng SEO E-commerce
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={fetchRules} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Tải lại
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Thêm quy tắc mới
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500' }}>Tổng số quy tắc</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>{totalRules}</div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500' }}>Đang hoạt động</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>{activeRules}</div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500' }}>301 Permanent</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb', marginTop: '4px' }}>{total301}</div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500' }}>302 Temporary</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706', marginTop: '4px' }}>{total302}</div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} color="#7c3aed" />
            Tổng lượt chuyển hướng
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed', marginTop: '4px' }}>
            {totalHits.toLocaleString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Tìm kiếm URL nguồn hoặc URL đích..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>Mã trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#fff', outline: 'none' }}
          >
            <option value="ALL">Tất cả (301 & 302)</option>
            <option value="301">301 Moved Permanently</option>
            <option value="302">302 Found (Temporary)</option>
          </select>
        </div>
      </div>

      {/* Rules Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
              <th style={{ padding: '14px 20px', fontWeight: '600' }}>URL Nguồn (Source Path)</th>
              <th style={{ padding: '14px 20px', fontWeight: '600' }}>URL Đích (Target Path)</th>
              <th style={{ padding: '14px 16px', fontWeight: '600' }}>Mã Trạng Thái</th>
              <th style={{ padding: '14px 16px', fontWeight: '600' }}>Loại Khớp</th>
              <th style={{ padding: '14px 16px', fontWeight: '600' }}>Lượt Hits</th>
              <th style={{ padding: '14px 16px', fontWeight: '600' }}>Trạng Thái</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', textAlign: 'right' }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Đang tải danh sách quy tắc chuyển hướng...
                </td>
              </tr>
            ) : filteredRules.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Không tìm thấy quy tắc redirect nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredRules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}>
                  <td style={{ padding: '14px 20px', fontWeight: '500', color: '#111827', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <code>{rule.sourceUrl}</code>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#2563eb', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={rule.targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563eb', textDecoration: 'none' }}>
                      <code>{rule.targetUrl}</code>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: rule.statusCode === 301 ? '#eff6ff' : '#fffbeb',
                        color: rule.statusCode === 301 ? '#1d4ed8' : '#b45309',
                        border: `1px solid ${rule.statusCode === 301 ? '#bfdbfe' : '#fef3c7'}`
                      }}
                    >
                      {rule.statusCode} {rule.statusCode === 301 ? 'Permanent' : 'Temporary'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#4b5563', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f3f4f6' }}>
                      {rule.isRegex ? 'Regex' : 'Chính xác'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '500', color: '#4b5563' }}>
                    {rule.hitCount ? rule.hitCount.toLocaleString('vi-VN') : 0}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleToggleStatus(rule.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '13px',
                        color: rule.isActive ? '#059669' : '#9ca3af'
                      }}
                    >
                      {rule.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {rule.isActive ? 'Bật' : 'Tắt'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenModal(rule)}
                        title="Chỉnh sửa quy tắc"
                        style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', color: '#374151' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        title="Xóa quy tắc"
                        style={{ padding: '6px', border: '1px solid #fca5a5', borderRadius: '6px', backgroundColor: '#fef2f2', cursor: 'pointer', color: '#dc2626' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Rule */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '540px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827' }}>
                {editingRule ? 'Chỉnh sửa quy tắc Redirect' : 'Tạo quy tắc Redirect mới'}
              </h3>
              <button onClick={handleCloseModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px', color: '#9ca3af' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  URL Nguồn (Source Path) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: /san-pham-cu hoặc /category-old"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                />
                <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Đường dẫn cũ cần bắt truy cập (VD: /san-pham-old)
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  URL Đích (Target Path) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: /san-pham-moi hoặc https://polarisx.com/products/new"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                />
                <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Đường dẫn mới người dùng và bot SEO sẽ được chuyển tới
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Mã trạng thái HTTP (Status Code)
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="radio"
                      name="statusCode"
                      value={301}
                      checked={Number(formData.statusCode) === 301}
                      onChange={(e) => setFormData({ ...formData, statusCode: Number(e.target.value) })}
                    />
                    <span><strong>301</strong> Moved Permanently (Khuyến nghị cho SEO)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="radio"
                      name="statusCode"
                      value={302}
                      checked={Number(formData.statusCode) === 302}
                      onChange={(e) => setFormData({ ...formData, statusCode: Number(e.target.value) })}
                    />
                    <span><strong>302</strong> Found (Tạm thời)</span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isRegex}
                    onChange={(e) => setFormData({ ...formData, isRegex: e.target.checked })}
                  />
                  <span>Khớp bằng biểu thức chính quy (Regex)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Kích hoạt ngay</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={saving}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Đang lưu...' : editingRule ? 'Cập nhật' : 'Tạo quy tắc'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRedirectManagerPage;
