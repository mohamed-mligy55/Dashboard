import "./table.scss";
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useQuery } from "@tanstack/react-query";

const List = () => {
  const fetchData = async () => {
    // 1. تغيير البورت إلى 5000 والمسار إلى users
    const res = await fetch("http://localhost:4000/users"); 
    if (!res.ok) throw new Error("error");
    const data = await res.json();
    
    // 2. json-server يرجع المصفوفة مباشرة داخل المتغير 'data' 
    // لا يوجد مفتاح باسم .results في الهيكل الذي وضعناه
    return data; 
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchData
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>City</TableCell> {/* غيرنا Country لـ City بناءً على بياناتك */}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>

                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* بياناتك الجديدة لا تحتوي على صورة شخصية، يمكنك وضع أول حرف من الاسم أو أي صورة افتراضية */}
                    <div style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '12px'
                    }}>
                      {user.name.firstname[0].toUpperCase()}
                    </div>
                    {/* تصحيح الوصول للاسم: firstname و lastname */}
                    {user.name.firstname} {user.name.lastname}
                  </div>
                </TableCell>

                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                {/* تصحيح الوصول للموقع: address.city */}
                <TableCell>{user.address.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default List;