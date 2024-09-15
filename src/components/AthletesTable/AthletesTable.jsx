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
import {
  CalendarMonth,
  Info,
  PersonAdd,
  Pool,
  WarningRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import AthleteInviteModal from "../AthleteInvitationModal/AthleteInvitationModal";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { getAthletesByCoachId } from "../../services/query";
import { getDistanceText } from "../../utils/calendar";

export const searchInObjects = (searchTerm, objectsArray) => {
  // Convert the search term to lowercase for case-insensitive search
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Filter the array of objects based on whether the search term is found in any string value
  return objectsArray.filter((obj) => {
    return Object.keys(obj.athletes).some((key) => {
      const value = obj.athletes[key];

      // Check if the value is a string, and if the search term is a substring of it
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(lowerSearchTerm)
      );
    });
  });
};

const cols = [
  {
    id: "athletes",
    label: "Athlete",
    format: (athlete) => {
      const name = athlete.first_name
        ? `${athlete.first_name} ${athlete.last_name}`
        : athlete.full_name
        ? athlete.full_name
        : athlete.email;
      return (
        <Box display="flex" alignItems="center">
          <Avatar
            alt={name}
            src={name}
            style={{ width: 30, height: 30, marginRight: 16 }}
          />
          <span>{name}</span>
        </Box>
      );
    },
  },
  {
    id: "athletes",
    label: "Status",
    format: (athlete) => <GetAthleteStatus athlete={athlete} />,
  },
];

export const GetAthleteStatus = ({ athlete }) =>
  athlete.status === "PENDING" ? (
    <Chip
      size="small"
      color="info"
      label="Pending Onboarding"
      icon={<Info />}
    />
  ) : athlete.calendars.length === 0 ? (
    <Chip
      size="small"
      color="error"
      label="No Calendar"
      icon={<WarningRounded />}
      sx={{ pl: 0.2 }}
    />
  ) : athlete.events.length === 0 ? (
    <Chip
      size="small"
      color="warning"
      label="No Scheduled Events"
      icon={<CalendarMonth />}
      sx={{ pl: 0.2 }}
    />
  ) : (
    <Chip
      size="small"
      color="success"
      label={`${getDistanceText(athlete.events[0].date)}`}
      icon={<CalendarMonth />}
      sx={{ pl: 0.2 }}
    />
  );

export const AthletesTable = ({ pic, name, info, onAthletesLoad }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const supabase = useSupabase();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getAthletes = () => {
    getAthletesByCoachId(supabase, user.id).then(({ data }) => {
      setAthletes(data || []);
      onAthletesLoad && onAthletesLoad(data || []);
    });
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    getAthletes();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <AthleteInviteModal
        onSuccess={getAthletes}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Box p={2} pb={1} display="flex" alignItems="center">
        <Pool style={{ marginRight: 12 }} />
        <Typography variant="subtitle" fontWeight="900">
          Your Athletes
        </Typography>
        <Button
          startIcon={<PersonAdd />}
          size="small"
          sx={{ marginLeft: "auto" }}
          onClick={() => setOpen(true)}
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
          fullWidth
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
            {searchInObjects(search, athletes).map((row, i) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={i}
                  onClick={() => navigate(`/athlete/${row.athletes.id}`)}
                  sx={{ cursor: "pointer" }}
                >
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
