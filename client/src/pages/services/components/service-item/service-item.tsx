import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material";
import * as React from 'react';
import {useState} from "react";
import TextField from "@mui/material/TextField";
import {AdminService} from "../../../../services/admin/admin-service";
import {useCookies} from "react-cookie";

interface ServiceItemProps {
  service: { description: String, priceRatio: Number, id: Number}
}

export function ServiceItem({ service }: ServiceItemProps): JSX.Element {
  const [cookies] = useCookies(["token"]);
  const [isEdited, setIsEdited] = useState(false);
  const [serviceName, setServiceName] = useState(service.description || "");
  const [priceRatio, setPriceRatio] = useState(service.priceRatio || 0);

  const adminService: AdminService = new AdminService(cookies);

  const handleEditService = () => {
    adminService.editService(service.id, serviceName, priceRatio).then(() => setIsEdited(false))
  }

  return (
    <Grid item xl={12} md={12} sm={12} xs={12} sx={{ position: 'relative' }} role="service-item">
      <Card>
        <CardContent>
          <Box>
            <List sx={{ bgcolor: "background.paper", display: 'flex', alignItems: 'center' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <HomeRepairServiceIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="service-item-name"
                  primary={
                    isEdited ?
                      <TextField
                        name="serviceName"
                        fullWidth
                        role='service-item-input-name'
                        value={serviceName}
                        onChange={(event) => setServiceName(event.target.value)}
                        id="serviceName"
                      /> : serviceName
                  }
                  secondary="Nazwa Usługi"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AttachMoneyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="service-item-price-ratio"
                  primary={
                    isEdited ?
                      <TextField
                        name="servicePrice"
                        fullWidth
                        type='number'
                        role='service-item-input-price'
                        value={priceRatio}
                        onChange={(event) => setPriceRatio(Number(event.target.value))}
                        id="servicePrice"
                      /> : <Typography>{priceRatio.toFixed(2)}zł/m<sup>2</sup></Typography>
                  }
                  secondary="Cena usługi"
                />
              </ListItem>
              {
                isEdited ? <Button
                    role="service-list-update-button"
                    variant="contained"
                    size="small"
                    onClick={handleEditService}
                    sx={{height: '36px', padding: '15px 35px', margin: '15px'}}
                  >Wyślij</Button> : <Button
                    role="service-list-open-dialog-button"
                    variant="contained"
                    size="small"
                    onClick={() => setIsEdited(true)}
                    sx={{height: '36px', padding: '15px 35px', margin: '15px'}}
                  >Edytuj</Button>
              }
            </List>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}