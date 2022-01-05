import InfoIcon from '@mui/icons-material/Info';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Button, Card, CardActions, CardContent, Grid, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import * as React from 'react';
import WorkIcon from '@mui/icons-material/Work';

interface UserItemProps {
  user: {
    companyName?: String,
    firstName: String,
    lastName: String,
    id: Number,
    roles?: string[]
  },
  handleUserDetails: Function
}
interface Roles {Client: string, Worker: string, Administrator: string}
const roleMapping: Roles = {
  Client: 'Klient',
  Worker: 'Pracownik',
  Administrator: 'Administrator'
}

export function UserItem({ user, handleUserDetails }: UserItemProps): JSX.Element {
  return (
    <Grid item xl={12} md={12} sm={12} xs={12} sx={{ position: 'relative' }} role="user-item">
      <Card sx={{ minWidth: 200, maxHeight: 250 }}>
        <CardContent>
          <Box>
            <List sx={{ bgcolor: "background.paper", display: 'flex' }}>
              <ListItem sx={{flexBasis: '33%'}}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="user-item-person-details"
                  primary={user.firstName + " " + user.lastName}
                  secondary="Imię i nazwisko"
                />
              </ListItem>
              <ListItem sx={{flexBasis: '33%'}}>
                <ListItemAvatar>
                  <Avatar>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="user-item-person-role"
                  primary={user.roles?.map(role => roleMapping[role as keyof Roles]).join(', ')}
                  secondary="Role"
                />
              </ListItem>
              {
                user.companyName && <ListItem sx={{flexBasis: '33%'}}>
                <ListItemAvatar>
                  <Avatar>
                    <MapIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="user-item-company"
                  primary={user.companyName}
                  secondary="Firma"
                />
              </ListItem>
              }
            </List>
          </Box>
        </CardContent>
        <CardActions disableSpacing sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button
            variant="contained"
            disableElevation
            aria-controls={"order-menu-" + user.id}
            aria-haspopup="true"
            startIcon={<InfoIcon />}
            role="user-item-details-button"
            onClick={() => handleUserDetails(user.id)}>
            Szczegóły
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}