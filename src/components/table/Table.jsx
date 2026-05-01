import "./table.scss";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "@tanstack/react-query";

const Tabledata = () => {
  const fetchData = async () => {
    const res = await fetch("http://localhost:4000/users");
    if (!res.ok) throw new Error("error");
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>City</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((user) => {
            const firstName = user.name?.firstname || "";
            const lastName = user.name?.lastname || "";

            return (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>

                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: "#ccc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      {firstName?.[0]?.toUpperCase() || "U"}
                    </div>

                    <span>
                      {firstName} {lastName}
                    </span>
                  </div>
                </TableCell>

                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>
                  {typeof user.address === "object"
                    ? user.address?.city
                    : user.address || "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tabledata;