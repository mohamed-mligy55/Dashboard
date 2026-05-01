import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './datatable.scss';
import { Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";

// 1. دالة جلب البيانات من السيرفر المحلي
const fetchUsers = async () => {
  const res = await fetch('http://localhost:4000/users'); // البورت الجديد
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  
  // نستخدم map لتحويل شكل البيانات ليتناسب مع الـ DataGrid
return data.map((user, index) => ({
  id: user.id,
  orderId: index + 1,
  name: `${user?.name?.firstname ?? ""} ${user?.name?.lastname ?? ""}`.trim() || "Unknown",
  avatar: `https://ui-avatars.com/api/?name=${user?.name?.firstname ?? ""}+${user?.name?.lastname ?? ""}`,
  email: user.email || "N/A",
  city: user?.address?.city || "N/A",
  phone: user.phone || "N/A",
  status: ['active', 'passive', 'pending'][index % 3],
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

const Datatable = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  
  
  });

  const mutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: (deletedId) => {
      // تحديث الكاش فوراً لحذف الصف من الجدول أمام المستخدم
      queryClient.invalidateQueries({
        queryKey: ["users"]
      });
    }
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
        <span>
  {typeof params.row.name === "object"
    ? `${params.row.name.firstname} ${params.row.name.lastname}`
    : params.row.name}
</span>
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
          <Link to={`/user/${params.row.id}`} className='btn-view'>
         View
          </Link>
          <Link to={`/users/${params.row.id}` } className='btn-edit'>
         Edit
          </Link>
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
    const theme = useTheme();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className={`table-wrapper ${theme.palette.mode}`}>
   <DataGrid
  rows={data || []}
  columns={columns}
  loading={isLoading}
  checkboxSelection
  autoHeight
  sx={{
    border: 'none',

    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,

    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },

    "& .MuiDataGrid-row": {
      backgroundColor: theme.palette.background.paper,
    },

    "& .MuiDataGrid-footerContainer": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    }
  }}
/>
    </div>
  );
};

export default Datatable;