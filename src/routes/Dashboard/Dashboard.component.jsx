import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
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
import { Cancel, CheckCircle } from "@mui/icons-material";

const mockData = [
  {
    athlete: {
      pic: "/static/images/avatar/1.jpg",
      name: "Ali Connors",
    },
    info: "Next checkin: in 2 days",
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
      pic: "/static/images/avatar/2.jpg",
      name: "Travis Howard",
    },
    info: "Next checkin: in 3 days",
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
      pic: "/static/images/avatar/3.jpg",
    },
    name: "Sandra Adams",
    info: "Next checkin: in 4 days",
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
        {value.map((item) =>
          item === 1 ? (
            <CheckCircle style={{ width: 20, height: 20 }} color="success" />
          ) : (
            <Cancel style={{ width: 20, height: 20 }} color="error" />
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

const AthleteTable = ({ pic, name, info }) => (
  <Paper sx={{ overflow: "hidden" }} variant="outlined">
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box p={2} display="flex" alignItems="center">
        <Typography variant="subtitle">Athletes</Typography>
        <TextField
          id="standard-search"
          label="Search for athlete..."
          type="search"
          variant="standard"
          style={{ marginLeft: "auto", width: 240 }}
        />
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {cols.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {cols.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
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

export const DashboardComponent = () => {
  return (
    <PageContainer>
      <h1>Dashboard</h1>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12}>
          <AthleteTable />
        </Grid2>
        <Grid2 item xs={12}>
          Column 2
        </Grid2>
      </Grid2>
    </PageContainer>
  );
};
