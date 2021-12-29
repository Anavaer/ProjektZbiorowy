import * as React from 'react';
import { Box, Typography, Avatar, Menu, MenuItem, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { OrderEmployeeProps } from "./order-employee-props";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useCookies } from 'react-cookie';
import { AdminService } from 'services/admin-service';
import { User } from 'types';

export function OrderEmployee(props: OrderEmployeeProps) {
  const { employee, client, onChangeAssignment } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);

  const optionsOpened: boolean = Boolean(anchorEl);
  const adminService: AdminService = new AdminService(cookies);




  const openAssignWorkerDialog = (): void => {
    adminService.getUsers()
      .then(res => setUsers(res.filter(x => x.id != client?.id)))
      .then(() => setDialogOpened(true))
      .then(() => setAnchorEl(null));
  }

  
  



  return (
    <Box sx={{ display: 'flex', alignItems: 'center'}}>
      {employee == null ? (
        <div>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              cursor: 'pointer'
            }}
            onClick={event => setAnchorEl(event.currentTarget)}
            aria-controls="order-employee-menu">
            <Typography variant="body2" sx={{ fontStyle: 'oblique' }}>Nieprzypisany</Typography>
            <Avatar sx={{ bgcolor: grey[500], marginLeft: '10px' }}></Avatar>
          </Box>
          <Menu
            id="order-employee-menu"
            MenuListProps={{ 'aria-labelledby': "order-employee-menu" }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            anchorEl={anchorEl}
            open={optionsOpened}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => onChangeAssignment()}>
              <PersonAddAltIcon sx={{ marginRight: '10px' }} />
              Przypisz do mnie
            </MenuItem>
            {/* TODO: enable option for admin */}
            {/* <MenuItem onClick={openAssignWorkerDialog}>
              <PersonAddAltIcon sx={{ marginRight: '10px' }} />
              Przypisz do...
            </MenuItem> */}
          </Menu>
          <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)}>
            <DialogTitle>
              Wybierz pracownika
            </DialogTitle>
            <List>
              {users.map(user => (
                <ListItem button onClick={() => onChangeAssignment(user)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: red[500] }}>
                      {user.firstName && user.firstName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.firstName + " " + user.lastName} />
                </ListItem>
              ))}
            </List>
          </Dialog>
        </div>
      ) : (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {employee.firstName} {employee.lastName}
          </Typography>
          <Avatar sx={{ bgcolor: red[500], marginLeft: '10px' }}>
            <b>{employee.firstName[0]}</b>
          </Avatar>
        </Box>
      )}
    </Box>
  )
}