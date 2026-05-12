import "./table.scss";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../../api";

const Tabledata = () => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));

  const fetchData = async () => {
    const res = await fetch(apiUrl("/users"));
    if (!res.ok) throw new Error("error");
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  if (isCompact) {
    const cardMod =
      theme.palette.mode === "dark" ? "user-table-cards--dark" : "";

    return (
      <ul
        className={`user-table-cards ${cardMod}`.trim()}
        aria-label="Users list"
      >
        {data?.map((user) => {
          const firstName = user.name?.firstname || "";
          const lastName = user.name?.lastname || "";
          const city =
            typeof user.address === "object"
              ? user.address?.city
              : user.address || "N/A";

          return (
            <li key={user.id} className="user-table-cards__item">
              <div className="user-table-cards__row user-table-cards__row--header">
                <span className="user-table-cards__id">#{user.id}</span>
                <div className="user-table-cards__avatar" aria-hidden>
                  {firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="user-table-cards__name">
                  {firstName} {lastName}
                </div>
              </div>
              <dl className="user-table-cards__details">
                <div>
                  <dt>Email</dt>
                  <dd>{user.email || "N/A"}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{user.phone || "N/A"}</dd>
                </div>
                <div>
                  <dt>City</dt>
                  <dd>{city}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <TableContainer
      component={Paper}
      className="table-responsive-shell"
      elevation={1}
      sx={{
        maxWidth: "100%",
        borderRadius: 1,
      }}
    >
      <Table
        className="home-users-table"
        size="small"
        stickyHeader
        aria-label="Users table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 72 }}>ID</TableCell>
            <TableCell sx={{ minWidth: 160 }}>User</TableCell>
            <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
            <TableCell sx={{ minWidth: 130 }}>Phone</TableCell>
            <TableCell sx={{ minWidth: 100 }}>City</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((user) => {
            const firstName = user.name?.firstname || "";
            const lastName = user.name?.lastname || "";

            return (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>

                <TableCell>
                  <div className="home-users-table__user">
                    <div className="home-users-table__avatar" aria-hidden>
                      {firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="home-users-table__name">
                      {firstName} {lastName}
                    </span>
                  </div>
                </TableCell>

                <TableCell sx={{ wordBreak: "break-word" }}>
                  {user.email || "N/A"}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {user.phone || "N/A"}
                </TableCell>
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
