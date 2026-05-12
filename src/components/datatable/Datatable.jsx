import { useMemo } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './datatable.scss';
import { Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { apiUrl } from "../../api";

// 1. دالة جلب البيانات من السيرفر المحلي
const fetchUsers = async () => {
  const res = await fetch(apiUrl("/users"));
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
  const response = await fetch(apiUrl(`/users/${id}`), {
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
  
  
  });

  const mutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      // تحديث الكاش فوراً لحذف الصف من الجدول أمام المستخدم
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
          <span className="user-cell__name">
            {typeof params.row.name === "object"
              ? `${params.row.name.firstname} ${params.row.name.lastname}`
              : params.row.name}
          </span>
        </div>
      ),
    };

    const statusCol = {
      field: "status",
      headerName: "Status",
      width: isSmDown ? 88 : isMdDown ? 100 : 120,
      minWidth: isSmDown ? 80 : undefined,
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
      minWidth: isSmDown ? 120 : undefined,
      sortable: false,
      renderCell: (params) => (
        <div className={`action-buttons${isSmDown ? " action-buttons--compact" : ""}`}>
          <Link to={`/user/${params.row.id}`} className="btn-view">
            View
          </Link>
          <Link to={`/users/${params.row.id}`} className="btn-edit">
            Edit
          </Link>
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
      minWidth: isSmDown ? 48 : undefined,
    };

    const emailCol = {
      field: "email",
      headerName: "Email",
      flex: isMdDown && !isSmDown ? 1 : undefined,
      minWidth: isMdDown && !isSmDown ? 140 : 180,
      width: isMdDown && !isSmDown ? undefined : 200,
    };

    const cityCol = { field: "city", headerName: "City", width: 110, minWidth: 90 };
    const phoneCol = { field: "phone", headerName: "Phone", width: 130, minWidth: 100 };

    if (isSmDown) {
      return [idCol, userCol, statusCol, actionCol];
    }

    if (isMdDown) {
      return [idCol, userCol, emailCol, statusCol, actionCol];
    }

    return [
      idCol,
      userCol,
      emailCol,
      { ...cityCol, width: 120 },
      { ...phoneCol, width: 150 },
      statusCol,
      actionCol,
    ];
  }, [isSmDown, isMdDown, mutation]);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div className={`table-wrapper ${theme.palette.mode}`}>
        <p style={{ padding: 16 }}>
          تعذّر تحميل المستخدمين: {error?.message ?? "خطأ شبكة"} — تأكد أن الخادم
          يعمل (<code>npm run server</code>) وأعد تحميل الصفحة.
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
          columnHeaderHeight={isSmDown ? 40 : isMdDown ? 48 : 56}
          rowHeight={isSmDown ? 44 : isMdDown ? 48 : 52}
          pageSizeOptions={isSmDown ? [5, 10] : [10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: isSmDown ? 5 : 10 } },
          }}
          sx={{
            width: "100%",
            minWidth: isSmDown ? 0 : isMdDown ? 480 : 720,
            border: "none",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: isSmDown ? "0.8125rem" : isMdDown ? "0.875rem" : undefined,

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
            },

            "& .MuiDataGrid-cell": {
              alignItems: "center",
              display: "flex",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Datatable;