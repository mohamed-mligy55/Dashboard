import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './datatable.scss';
import { Link } from 'react-router-dom';

// 1. دالة جلب البيانات من السيرفر المحلي
const fetchUsers = async () => {
  const res = await fetch('http://localhost:4000/users'); // البورت الجديد
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  
  // نستخدم map لتحويل شكل البيانات ليتناسب مع الـ DataGrid
  return data.map((user, index) => ({
    id: user.id, // json-server يستخدم id
    orderId: index + 1,
    name: `${user.name.firstname} ${user.name.lastname}`,
    avatar: `https://ui-avatars.com/api/?name=${user.name.firstname}+${user.name.lastname}&background=random`, // صورة افتراضية تعتمد على الاسم
    email: user.email,
    city: user.address.city, // استخدام city من بياناتك
    phone: user.phone,
    status: ['active', 'passive', 'pending'][index % 3], // حالة افتراضية للتصميم
  }));
};

// 2. دالة الحذف الحقيقي من السيرفر المحلي
const deleteUserApi = async (id) => {
  const response = await fetch(`http://localhost:4000/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete');
  return id;
};

const UserTable = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: (deletedId) => {
      // تحديث الكاش فوراً لحذف الصف من الجدول أمام المستخدم
      queryClient.setQueryData(['users'], (prev) => 
        prev?.filter(user => user.id !== deletedId)
      );
    },
  });

  const columns = [
    { field: 'orderId', headerName: 'ID', width: 70 },
    { 
      field: 'user', 
      headerName: 'User', 
      width: 200,
      renderCell: (params) => (
        <div className="user-cell">
          <img 
            src={params.row.avatar} 
            alt="" 
            style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
          />
          <span>{params.row.name}</span>
        </div>
      )
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'city', headerName: 'City', width: 120 }, // تم التعديل ليتناسب مع البيانات
    { field: 'phone', headerName: 'Phone', width: 150 }, // إضافة رقم الهاتف
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <span className={`status-pill ${params.value}`}>
          {params.value}
        </span>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <div className="action-buttons">
          <Link to={`/product/${params.row.id}`} className="btn-view">View</Link>
          <button 
            onClick={() => {
            
                mutation.mutate(params.row.id);
              
            }} 
            className="btn-delete" 
            disabled={mutation.isPending}
          >
            {mutation.isPending && mutation.variables === params.row.id ? '...' : 'Delete'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="table-wrapper">
      <DataGrid
        rows={data || []}
        columns={columns}
        loading={isLoading}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold'
          },
        }}
      />
    </div>
  );
};

export default UserTable;