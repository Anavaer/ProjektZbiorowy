import * as React from 'react';
import { Box, Typography, Avatar, Menu, MenuItem, Dialog } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { OrderEmployeeProps } from "./order-employee-props";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

export function OrderEmployee(props: OrderEmployeeProps) {
  const { employee, onChangeAssignment } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>();
  const optionsOpened: boolean = Boolean(anchorEl);



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
            <MenuItem onClick={onChangeAssignment}>
              <PersonAddAltIcon sx={{ marginRight: '10px' }} />
              Przypisz do mnie
            </MenuItem>
            <MenuItem onClick={() => console.log("sad")}>
              <PersonAddAltIcon sx={{ marginRight: '10px' }} />
              Przypisz do...
            </MenuItem>
          </Menu>
          <Dialog open={false}>
            
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