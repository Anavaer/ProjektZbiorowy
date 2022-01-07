import * as React from 'react';
import { Box, Typography, Avatar, Menu, MenuItem, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { OrderEmployeeProps } from "./order-employee-props";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useCookies } from 'react-cookie';
import { AdminService } from 'services/admin/admin-service';
import { User } from 'types';
import { UserRoleUtils } from 'utils/user-role-utils';

export function OrderEmployee(props: OrderEmployeeProps) {
  const { employee, client, onChangeAssignment } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>();
  const [cookies, setCookie, removeCookie] = useCookies(["token", "role", "id"]);
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);

  const optionsOpened: boolean = Boolean(anchorEl);
  const adminService: AdminService = new AdminService(cookies);
  const workerAbleToClick: boolean = Boolean(UserRoleUtils.isWorker(cookies.role) && client?.id != cookies.id);




  const openAssignWorkerDialog = (): void => {
    adminService.getUsers()
      .then(res => setUsers(res.filter(x => x.id != client?.id && (UserRoleUtils.isWorker(x.roles) || UserRoleUtils.isAdmin(x.roles)))))
      .then(() => setDialogOpened(true))
      .then(() => setAnchorEl(null));
  }

  
  



  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} role="order-employee-widget">
      {employee == null ? (
        <div>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              cursor: (workerAbleToClick ? 'pointer' : 'inherit')
            }}
            role="unassigned-employee-box"
            onClick={event => workerAbleToClick && setAnchorEl(event.currentTarget)}
            aria-controls="order-employee-menu">
            <Typography variant="body2" sx={{ fontStyle: 'oblique' }}>Nieprzypisany</Typography>
            <Avatar sx={{ bgcolor: grey[500], marginLeft: '10px' }} role="employee-avatar"></Avatar>
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
            {workerAbleToClick && (
              <MenuItem onClick={() => onChangeAssignment()} role="employee-assign-to-me-menu-item">
                <PersonAddAltIcon sx={{ marginRight: '10px' }} />
                Przypisz do mnie
              </MenuItem>
            )}
            {UserRoleUtils.isAdmin(cookies.role) && (
              <MenuItem onClick={openAssignWorkerDialog} role="employee-assign-to-employee-menu-item">
                <PersonAddAltIcon sx={{ marginRight: '10px' }} />
                Przypisz do pracownika
              </MenuItem>
            )}
          </Menu>
          <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)} role="employee-assign-to-employee-dialog">
            <DialogTitle>
              Wybierz pracownika
            </DialogTitle>
            <List>
              {users.map(user => (
                <ListItem key={"user-" + user.id} button onClick={() => onChangeAssignment(user)} role="employee-assign-to-employee-list-item">
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
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
          role="employee-data-box"
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {employee.firstName} {employee.lastName}
          </Typography>
          <Avatar sx={{ bgcolor: red[500], marginLeft: '10px' }} role="employee-avatar">
            <b>{employee.firstName[0]}</b>
          </Avatar>
        </Box>
      )}
    </Box>
  )
}