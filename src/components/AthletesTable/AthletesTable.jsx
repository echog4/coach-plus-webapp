import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Cancel, CheckCircle, Pool } from "@mui/icons-material";
import { useState } from "react";

const mockData = [
  {
    athlete: {
      id: 1,
      pic: "/static/images/avatar/1.jpg",
      name: "Ali Connors",
    },
    info: "in 2 days",
    checkins: [1, 1, 0, 1, 1],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 2,
      pic: "/static/images/avatar/2.jpg",
      name: "Travis Howard",
    },
    info: "in 3 days",
    checkins: [1, 1, 0, 0, 0],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 3,
      pic: "/static/images/avatar/3.jpg",
      name: "Sandra Adams",
    },
    info: "in 4 days",
    checkins: [1, 0, 0, 1, 1],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 4,
      pic: "/static/images/avatar/1.jpg",
      name: "Ali Connors",
    },
    info: "in 2 days",
    checkins: [1, 1, 0, 1, 1],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 5,
      pic: "/static/images/avatar/2.jpg",
      name: "Travis Howard",
    },
    info: "in 3 days",
    checkins: [1, 1, 0, 0, 0],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 6,
      pic: "/static/images/avatar/3.jpg",
      name: "Sandra Adams",
    },
    info: "in 4 days",
    checkins: [1, 0, 0, 1, 1],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 9,
      pic: "/static/images/avatar/1.jpg",
      name: "Ali Connors",
    },
    info: "in 2 days",
    checkins: [1, 1, 0, 1, 1],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 7,
      pic: "/static/images/avatar/2.jpg",
      name: "Travis Howard",
    },
    info: "in 3 days",
    checkins: [1, 1, 0, 0, 0],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
  {
    athlete: {
      id: 8,
      pic: "/static/images/avatar/3.jpg",
      name: "Sandra Adams",
    },
    info: "in 4 days",
    checkins: [1, 0, 0, 1, 1],
    weight: [
      {
        date: "2021-10-01",
        weight: 150,
      },
      {
        date: "2021-10-02",
        weight: 145,
      },
      {
        date: "2021-10-03",
        weight: 138,
      },
      {
        date: "2021-10-04",
        weight: 137,
      },
      {
        date: "2021-10-05",
        weight: 130,
      },
    ],
  },
];

const cols = [
  {
    id: "athlete",
    label: "Athlete",
    format: ({ pic, name }) => (
      <Box display="flex" alignItems="center">
        <Avatar
          alt={name}
          src={pic}
          style={{ width: 30, height: 30, marginRight: 16 }}
        />
        <span>{name}</span>
      </Box>
    ),
  },
  {
    id: "info",
    label: "Next Checkin",
  },
  {
    id: "checkins",
    label: "Last 5 Checkins",
    format: (value) => (
      <Box display="flex" alignItems="center">
        {value.map((item, i) =>
          item === 1 ? (
            <CheckCircle
              key={i}
              style={{ width: 20, height: 20 }}
              color="success"
            />
          ) : (
            <Cancel key={i} style={{ width: 20, height: 20 }} color="error" />
          )
        )}
      </Box>
    ),
  },
  {
    id: "weight",
    label: "Weight",
    format: (value) => {
      return <div>1</div>;
    },
  },
];

export const AthletesTable = ({ pic, name, info }) => {
  const [search, setSearch] = useState("");

  return (
    <Paper sx={{ overflow: "hidden", height: 520 }} variant="outlined">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box p={2} display="flex" alignItems="center" height="80px">
          <Pool style={{ marginRight: 12 }} />
          <Typography variant="h6" fontWeight="900">
            Your Athletes
          </Typography>
          <TextField
            id="standard-search"
            label="Search for athlete..."
            type="search"
            variant="standard"
            style={{ marginLeft: "auto", width: 240 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {cols.map((column, i) => (
                  <TableCell
                    key={i}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData
                .filter((row) =>
                  row.athlete.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      {cols.map((column, i) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={i} align={column.align}>
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
      </Paper>
    </Paper>
  );
};
