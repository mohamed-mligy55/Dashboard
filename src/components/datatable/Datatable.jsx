import { useMemo } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './datatable.scss';
import { Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { apiUrl } from "../../api";

// 1. دالة جلب البيانات من MockAPI
const fetchUsers = async () => {
  const res = await fetch("https://6a03a27c2afe8349b4b5654c.mockapi.io/api/users/user");
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  
  // تحويل البيانات لتناسب عرض الـ DataGrid بناءً على هيكلة MockAPI الجديدة
  return data.map((user, index) => {
    // استخراج الأسماء مع دعم المفاتيح التي تحتوي على شرطة أو المفاتيح العادية
    const fName = user["first-name"] || user.firstname || "";
    const lName = user["last-name"] || user.lastname || "";
    
    return {
      id: user.id,
      orderId: user.id + "D", // التنسيق الذي طلبته 4D, 5D...
      name: `${fName} ${lName}`.trim() || "Unknown User",
      avatar: `https://ui-avatars.com/api/?name=${fName}+${lName}&background=random`,
      email: user.email || "N/A",
      city: user.city || "N/A",
      phone: user.phone || "N/A",
      status: user.status || ['active', 'passive', 'pending'][index % 3],
    };
  });
};

// 2. دالة الحذف من MockAPI
const deleteUserApi = async (id) => {
  const response = await fetch(`https://6a03a27c2afe8349b4b5654c.mockapi.io/api/users/user/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete');
  return id;
};

const Datatable = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
     refetchOnMount: true,
  refetchOnWindowFocus: true,
  staleTime: 0,
  });

  const mutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      // إعادة جلب البيانات فوراً بعد الحذف لتحديث الجدول
      queryClient.invalidateQueries({
        queryKey: ["users"]
      });
    }
  });

  const columns = useMemo(() => {
    const userCol = {
      field: "user",
      headerName: "User",
      flex: isSmDown || (isMdDown && !isSmDown) ? 1 : undefined,
      minWidth: isSmDown ? 120 : isMdDown ? 140 : 160,
      width: !isMdDown ? 200 : undefined,
      renderCell: (params) => (
        <div className={`user-cell${isSmDown ? " user-cell--compact" : ""}`}>
          <img src={params.row.avatar} alt="" className="user-cell__avatar" />
          <span className="user-cell__name">{params.row.name}</span>
        </div>
      ),
    };

    const statusCol = {
      field: "status",
      headerName: "Status",
      width: isSmDown ? 88 : isMdDown ? 100 : 120,
      renderCell: (params) => (
        <span className={`status-pill ${params.value}${isSmDown ? " status-pill--compact" : ""}`}>
          {params.value}
        </span>
      ),
    };

    const actionCol = {
      field: "action",
      headerName: "Action",
      width: isSmDown ? 132 : isMdDown ? 150 : 180,
      sortable: false,
      renderCell: (params) => (
        <div className={`action-buttons${isSmDown ? " action-buttons--compact" : ""}`}>
          <Link to={`/user/${params.row.id}`} className="btn-view">View</Link>
          <Link to={`/users/${params.row.id}`} className="btn-edit">Edit</Link>
          <button
            type="button"
            onClick={() => mutation.mutate(params.row.id)}
            className="btn-delete"
            disabled={mutation.isPending}
          >
            {mutation.isPending && mutation.variables === params.row.id ? "..." : "Delete"}
          </button>
        </div>
      ),
    };

    const idCol = {
      field: "orderId",
      headerName: "ID",
      width: isSmDown ? 52 : 70,
    };

    const emailCol = {
      field: "email",
      headerName: "Email",
      flex: isMdDown && !isSmDown ? 1 : undefined,
      minWidth: 140,
      width: 200,
    };

    const cityCol = { field: "city", headerName: "City", width: 110 };
    const phoneCol = { field: "phone", headerName: "Phone", width: 130 };

    if (isSmDown) return [idCol, userCol, statusCol, actionCol];
    if (isMdDown) return [idCol, userCol, emailCol, statusCol, actionCol];

    return [idCol, userCol, emailCol, cityCol, phoneCol, statusCol, actionCol];
  }, [isSmDown, isMdDown, mutation]);

  if (isLoading) return <div style={{ padding: 20 }}>Loading...</div>;
  
  if (isError)
    return (
      <div className={`table-wrapper ${theme.palette.mode}`}>
        <p style={{ padding: 16 }}>
          تعذّر تحميل البيانات من MockAPI: {error?.message}
        </p>
      </div>
    );

  return (
    <div className={`table-wrapper ${theme.palette.mode}`}>
      <div className="data-grid-shell">
      <DataGrid
  rows={data || []}
  columns={columns}
  loading={isLoading}
  checkboxSelection={!isSmDown}
  disableRowSelectionOnClick
  autoHeight
  density={isSmDown ? "compact" : "standard"}
  initialState={{
    pagination: {
      paginationModel: {
        pageSize: isSmDown ? 5 : 10,
      },
    },
  }}
  pageSizeOptions={isSmDown ? [5] : [5, 10, 20]}
  sx={{
    width: "100%",
    border: "none",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.background.default,
    },
    "& .MuiDataGrid-cell": {
      display: "flex",
      alignItems: "center",
    },
  }}
/>
      </div>
    </div>
  );
};

export default Datatable;