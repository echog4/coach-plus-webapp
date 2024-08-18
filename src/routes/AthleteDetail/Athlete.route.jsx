import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Close, Mail, Phone } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts";
import { useState } from "react";

const tileStyle = {
  padding: 2,
  border: "1px solid #ccc",
  borderRadius: 4,
  mr: 2,
};

export const AthleteRoute = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
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
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ padding: 4 }}>
            <Grid2 container>
              <Grid2 sx={{ marginRight: "auto" }}>
                <Box display="flex" flexDirection="row">
                  <Avatar
                    alt="Mark Fox"
                    src="/static/images/avatar/1.jpg"
                    style={{ width: 64, height: 64, marginRight: 16 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="900">
                      Mark Fox
                    </Typography>
                    <Box>
                      <IconButton aria-label="delete" color="info">
                        <Phone />
                      </IconButton>
                      <IconButton aria-label="delete" color="info">
                        <Mail />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid2>
              <Grid2>
                <Box display="flex" flexDirection="row">
                  <Box sx={tileStyle}>
                    <Typography variant="body1" fontWeight="900">
                      in 2 days
                    </Typography>
                    <Typography variant="caption" fontWeight="900">
                      Next Check-In
                    </Typography>
                  </Box>
                  <Box sx={tileStyle}>
                    <Typography variant="body1" fontWeight="900">
                      54
                    </Typography>
                    <Typography variant="caption" fontWeight="900">
                      Total Check-Ins
                    </Typography>
                  </Box>
                  <Box sx={{ ...tileStyle, padding: 0 }}>
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
                    <Typography
                      variant="caption"
                      fontWeight="900"
                      sx={{ pl: 2 }}
                    >
                      Weight over time
                    </Typography>
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        </Paper>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ overflow: "auto", height: 320, mb: 4 }}>
              <Box>
                <Box>
                  <List
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}
                    subheader={<ListSubheader>Latest feedback</ListSubheader>}
                  >
                    {Array.from({ length: 8 }).map(() => (
                      <ListItemButton>
                        <ListItemText
                          onClick={() => setOpen(true)}
                          primary="Sent a new feedback. Click here to see it"
                          secondary="Jan 9, 2014"
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Box>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ overflow: "auto", height: 320, mb: 4 }}>
              <Box>
                <Box>
                  <List
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}
                    subheader={<ListSubheader>Activity</ListSubheader>}
                  >
                    <ListItem>
                      <ListItemText
                        primary="Checked in for his session"
                        secondary="Jan 9, 2014"
                      />
                    </ListItem>
                    <Divider></Divider>
                    <ListItem>
                      <ListItemText
                        primary="Missed his session"
                        secondary="Jan 9, 2014"
                      />
                    </ListItem>
                    <Divider></Divider>
                    <ListItem>
                      <ListItemText
                        primary="Checked in for his session"
                        secondary="Jan 9, 2014"
                      />
                    </ListItem>
                    <Divider></Divider>
                    <ListItem>
                      <ListItemText
                        primary="Missed his session"
                        secondary="Jan 9, 2014"
                      />
                    </ListItem>
                    <Divider></Divider>
                    <ListItem>
                      <ListItemText
                        primary="Missed his session"
                        secondary="Jan 9, 2014"
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>
        <Paper>
          <Box p={4}>
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
          </Box>
        </Paper>
      </PageContainer>
    </div>
  );
};
