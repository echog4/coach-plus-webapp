import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  Cancel,
  CheckCircle,
  Close,
  Edit,
  Mail,
  Phone,
  WarningRounded,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { useParams } from "react-router-dom";
import { useCalendar } from "../../providers/CalendarProvider";
import { getAthleteName } from "../../utils/selectors";
import { CalendarComponent } from "../../components/Calendar/Calendar";

import {
  getAthleteProfile,
  getCalendarsByCoachIdAthleteId,
  insertCalendar,
  upsertAthlete,
} from "../../services/query";
import { getTimeZone } from "../../utils/calendar";
import { CreateEventModal } from "../../components/CreateEventModal/CreateEventModal";
import { noop } from "../../utils/noop";
import { GetAthleteStatus } from "../../components/AthletesTable/AthletesTable";
import { Controller, useForm } from "react-hook-form";
import { MobileDatePicker } from "@mui/x-date-pickers";

const EditModal = ({ editModalOpen, setEditModalOpen, athlete, onSuccess }) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      first_name: athlete.first_name,
      last_name: athlete.last_name,
      city: athlete.city,
      country: athlete.country,
      phone_number: athlete.phone_number,
      dob: new Date(athlete.dob),
    },
  });

  const supabase = useSupabase();

  const onSubmit = handleSubmit(async (data) => {
    await upsertAthlete(supabase, {
      id: athlete.id,
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: `${data.first_name} ${data.last_name}`,
      city: data.city,
      country: data.country,
      phone_number: data.phone_number,
      dob: data.dob,
    });
    setEditModalOpen(false);
    onSuccess && onSuccess();
  });
  return (
    <Dialog
      onClose={() => setEditModalOpen(false)}
      aria-labelledby="customized-dialog-title"
      open={editModalOpen}
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Edit Athlete
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setEditModalOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <Box sx={{ mt: 2 }}>
            <TextField
              {...register("first_name")}
              label="First Name"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              {...register("last_name")}
              label="Last Name"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              {...register("city")}
              label="City"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              {...register("country")}
              label="Country"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              {...register("phone_number")}
              label="Phone Number"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ maxWidth: 400, mt: 2, mb: 2 }}>
            <Controller
              control={control}
              name="dob"
              rules={{ required: true }}
              render={({ field }) => {
                console.log({ field });
                return (
                  <MobileDatePicker
                    label="Date of Birth"
                    format="yyyy-MM-dd"
                    value={field.value && new Date(field.value)}
                    inputRef={field.ref}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    fullWidth
                  />
                );
              }}
            />
          </Box>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AthleteRoute = () => {
  const [open, setOpen] = useState(false);
  const [athlete, setAthlete] = useState(null);

  const params = useParams();
  const supabase = useSupabase();
  const { user } = useAuth();
  const [calendars, setCalendars] = useState([]);
  const { createCalendar, getCalendar, gapiInited } = useCalendar();
  const [createCalendarLoading, setCreateCalendarLoading] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const [editModal, setEditModal] = useState(true);

  const reloadCalendars = () =>
    getCalendarsByCoachIdAthleteId(supabase, user.id, params.id).then(
      (calendars) => {
        setCalendars(calendars.data);
      }
    );
  useEffect(() => {
    // TODO: handle calendar data
    if (!user) {
      return;
    }
    reloadCalendars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createAthleteCalendar = async () => {
    setCreateCalendarLoading(true);
    try {
      const calendarData = {
        summary: `C+ ${getAthleteName(athlete)}`,
        description: `Coach+ Training Calendar for ${getAthleteName(athlete)}`,
        timeZone: getTimeZone(),
      };

      const calendar = await createCalendar(calendarData);
      const the_calendar = await getCalendar(calendar.id);

      const sbCalendar = {
        gcal_id: calendar.id,
        payload: the_calendar,
        enabled: true,
        public_url: `https://calendar.google.com/calendar/embed?src=${decodeURIComponent(
          calendar.id
        )}&ctz=${decodeURIComponent(calendar.timeZone)}`,
        athlete_id: params.id,
        coach_id: user.id,
        time_zone: calendarData.timeZone,
      };

      await insertCalendar(supabase, sbCalendar);
      await fetchAthlete();
      createCalendarLoading(false);
    } catch (e) {
      console.error(e);
      setCreateCalendarLoading(false);
    }
  };

  const fetchAthlete = async () => {
    const { data: athletes } = await getAthleteProfile(supabase, params.id);
    console.log(athletes[0]);
    setAthlete(athletes[0]);
  };

  useEffect(() => {
    if (gapiInited) {
      fetchAthlete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gapiInited]);

  const isWaitingOnboarding =
    athlete && athlete.onboarding_form_response[0].status !== "completed";

  if (!athlete) {
    return null;
  }

  return (
    <div>
      {eventModalOpen && (
        <CreateEventModal
          open={eventModalOpen}
          handleClose={() => setEventModalOpen(false)}
          onSuccess={() => {
            reloadCalendars();
          }}
          athleteId={params.id}
        />
      )}
      {editModal && (
        <EditModal
          editModalOpen={editModal}
          setEditModalOpen={setEditModal}
          athlete={athlete}
          onSuccess={() => fetchAthlete()}
        />
      )}
      <Dialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Feedback for 29 June 2024
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
            auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
            cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
            dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
        </DialogContent>
      </Dialog>
      <PageContainer>
        <Paper sx={{ mb: 4 }} variant="outlined">
          <Box sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="900" sx={{ mr: 2, mb: 1 }}>
                  {getAthleteName(athlete)}
                </Typography>
                <GetAthleteStatus athlete={athlete} />
                {isWaitingOnboarding && (
                  <Button
                    target="_blank"
                    href={`/onboarding-form/${athlete.onboarding_form_response[0].id}`}
                  >
                    Go to Onboarding Form
                  </Button>
                )}
              </Box>
              <IconButton
                size="small"
                href={`tel:${athlete.phone_number}`}
                sx={{ mr: 1, marginLeft: "auto" }}
              >
                <Phone />
              </IconButton>
              <IconButton size="small" href={`mailto:${athlete.email}`}>
                <Mail />
              </IconButton>
              <IconButton size="small" onClick={() => setEditModal(true)}>
                <Edit />
              </IconButton>
            </Box>

            {!isWaitingOnboarding && (
              <Box>
                <Typography variant="subtitle2">
                  <Box display="flex" alignItems="center" mb={3}>
                    {athlete.events[0] ? (
                      <>
                        <CheckCircle
                          color="success"
                          sx={{ mr: 1, height: 26, width: "auto" }}
                        />
                        {/* TODO: add next session in days */}
                        {getAthleteName(athlete)} has an upcoming session in 2
                        days!
                      </>
                    ) : (
                      <>
                        <WarningRounded
                          color="warning"
                          sx={{ mr: 1, height: 30, width: "auto" }}
                        />{" "}
                        {getAthleteName(athlete)} has no upcoming sessions
                        scheduled!
                      </>
                    )}
                  </Box>
                </Typography>
                {athlete.calendars.length === 0 && (
                  <Typography variant="subtitle2">
                    <Box display="flex" alignItems="center" mb={3}>
                      <WarningRounded
                        color="warning"
                        sx={{ mr: 1, height: 30, width: "auto" }}
                      />{" "}
                      {getAthleteName(athlete)} has no Calendars!
                      <Button
                        onClick={() => createAthleteCalendar()}
                        sx={{ ml: 2 }}
                        color="success"
                        disabled={createCalendarLoading}
                      >
                        Create Calendar
                      </Button>
                      {createCalendarLoading && (
                        <CircularProgress
                          size={20}
                          sx={{ ml: 2 }}
                          color="info"
                        />
                      )}
                    </Box>
                  </Typography>
                )}
                <Box display="flex" flexWrap="wrap">
                  <Box mr={4}>
                    <Typography variant="subtitle2" mb={2}>
                      Height
                    </Typography>
                    <Typography variant="h5">
                      {athlete.onboarding_form_response[0].height} cm
                    </Typography>
                  </Box>
                  <Box mr={4}>
                    <Typography variant="subtitle2" mb={2}>
                      Weight
                    </Typography>
                    <Typography variant="h5">
                      {athlete.onboarding_form_response[0].weight} kg
                    </Typography>
                  </Box>
                  <Box mr={4}>
                    <Typography variant="subtitle2" mb={2}>
                      Last 5 check-ins:
                    </Typography>
                    <Box display="flex" mb={2}>
                      {[1, 1, 0, 0, 1].map((a, i) => (
                        <Box key={i} sx={{ mr: 1 }}>
                          {a === 1 ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="warning" />
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  {false && (
                    <Box>
                      <Typography variant="subtitle2" mb={0.5}>
                        Weight over time:
                      </Typography>
                      <Box mb={2}>
                        <LineChart
                          width={200}
                          height={50}
                          leftAxis={null}
                          bottomAxis={null}
                          series={[{ data: [65, 64, 73, 71, 72], label: "kg" }]}
                          slotProps={{ legend: { hidden: true } }}
                          margin={{
                            left: 10,
                            right: 10,
                            top: 0,
                            bottom: 0,
                          }}
                          xAxis={[
                            {
                              scaleType: "point",
                              data: [
                                "May 1",
                                "May 8",
                                "May 15",
                                "May 22",
                                "June 2",
                              ],
                            },
                          ]}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
        {!isWaitingOnboarding && (
          <Grid2 container spacing={2}>
            <Grid2 xs={12} md={6}>
              <Paper variant="outlined" sx={{ overflow: "auto", height: 320 }}>
                <Box>
                  <List
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}
                    subheader={<ListSubheader>Check-ins</ListSubheader>}
                  >
                    {/* TODO Implement check-ins */}
                    {Array.from({ length: 8 }).map((a, i) => (
                      <React.Fragment key={i}>
                        <ListItemButton>
                          <ListItemText
                            onClick={() => setOpen(true)}
                            primary="Sent a new feedback. Click here to see it"
                            secondary="Jan 9, 2014"
                          />
                        </ListItemButton>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Grid2>
            <Grid2 xs={12} md={6}>
              {athlete && athlete.calendars.length > 0 && (
                <CalendarComponent
                  height={240}
                  title="This month"
                  defaultView="agenda"
                  calendars={calendars}
                  toggles={calendars.length > 1}
                  views={["agenda"]}
                  onNewEventClick={() => {
                    setEventModalOpen(true);
                  }}
                  onCalendarToggle={noop}
                />
              )}
            </Grid2>
          </Grid2>
        )}
        <Paper>
          {/* <Box p={4}>
            <Typography variant="h6" fontWeight="900">
              Calendar
            </Typography>
            <iframe
              title="calendar"
              src="https://calendar.google.com/calendar/u/0/embed?src=bmZsXy1tLTA1ZzN2XyU0ZWV3KyU0ZnJsZWFucyslNTNhaW50cyNzcG9ydHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t"
              style={{ width: "100%", height: 600 }}
              width="100%"
              frameborder="0"
              scrolling="no"
            ></iframe>
          </Box> */}
        </Paper>
      </PageContainer>
    </div>
  );
};
