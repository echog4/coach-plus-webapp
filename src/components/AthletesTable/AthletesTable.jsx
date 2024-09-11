import {
  Avatar,
  Box,
  Button,
  Chip,
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
import { PersonAdd, Pool, Warning } from "@mui/icons-material";
import { useState } from "react";

const mockData = [
  {
    athlete: {
      id: 1,
      pic: "/static/images/avatar/1.jpg",
      name: "Ali Connors",
    },
    info: <Chip label="2 days" color="info" />,
  },
  {
    athlete: {
      id: 2,
      pic: "/static/images/avatar/2.jpg",
      name: "Travis Howard",
    },
    info: (
      <Chip
        label="No schedule"
        color="warning"
        icon={<Warning color="warning" sx={{ height: 18 }} />}
      />
    ),
  },
  {
    athlete: {
      id: 3,
      pic: "/static/images/avatar/3.jpg",
      name: "Sandra Adams",
    },
    info: <Chip label="4 days" color="info" />,
  },
  {
    athlete: {
      id: 4,
      pic: "/static/images/avatar/1.jpg",
      name: "Ali Connors",
    },
    info: <Chip label="2 days" color="info" />,
  },
  {
    athlete: {
      id: 5,
      pic: "/static/images/avatar/2.jpg",
      name: "Travis Howard",
    },
    info: <Chip label="2 days" color="info" />,
  },
  {
    athlete: {
      id: 6,
      pic: "/static/images/avatar/3.jpg",
      name: "Sandra Adams",
    },
    info: <Chip label="2 days" color="info" />,
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
    label: "Next Event",
  },
];

export const AthletesTable = ({ pic, name, info }) => {
  const [search, setSearch] = useState("");

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box p={2} pb={1} display="flex" alignItems="center">
        <Pool style={{ marginRight: 12 }} />
        <Typography variant="subtitle" fontWeight="900">
          Your Athletes
        </Typography>
        <Button
          startIcon={<PersonAdd />}
          size="small"
          sx={{ marginLeft: "auto" }}
        >
          Invite
        </Button>
      </Box>
      <Box px={2} pb={2}>
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
      <TableContainer sx={{ maxHeight: 300 }}>
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
    </Paper>
  );
};
