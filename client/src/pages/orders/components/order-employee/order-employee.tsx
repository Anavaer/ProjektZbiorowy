import { Box, Typography, Avatar } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { OrderEmployeeProps } from "./order-employee-props";

export function OrderEmployee(props: OrderEmployeeProps) {
  const { employee } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center'}}>
      {employee == null ? (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <Typography variant="body2" sx={{ fontStyle: 'oblique' }}>Nieprzypisany</Typography>
          <Avatar sx={{ bgcolor: grey[500], marginLeft: '10px' }}></Avatar>
        </Box>
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