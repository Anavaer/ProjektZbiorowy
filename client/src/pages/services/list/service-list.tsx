import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import 'moment/locale/pl';
import * as React from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import {AdminService} from 'services/admin/admin-service';
import {ServicePrice} from 'types';
import {CustomSnackbarOptions} from '../../../utils/CustomSnackbarOptions';
import {ServiceItem} from '../components/service-item/service-item';
import { UserRoleUtils } from 'utils/user-role-utils';

export const ServiceList = () => {
  const [cookies] = useCookies(["token", "role"]);
  const [modalOpened, setModalOpened] = React.useState(false);
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({
    message: "",
    opened: false,
    severity: "success"
  });
  const [services, setServices] = React.useState<ServicePrice[]>([]);
  const [createdService, setCreatedService] = React.useState({
    description: "",
    priceRatio: 0
  });

  const navigate = useNavigate();
  const createOrderValid: boolean = Boolean(
    createdService.description.length > 0 &&
    createdService.priceRatio > 0
  );

  const adminService: AdminService = new AdminService(cookies);

  React.useEffect(() => {
    document.title = "Lista Usług | Cleanny";

    if (cookies.token && cookies.role && cookies.role.includes("Administrator")) {
      adminService.getServices().then(res => setServices(res));
    } else {
      navigate("/sign-in");
    }
  }, []);

  const handleCreateService = (): void => {
    setModalOpened(false);

    adminService.createService(createdService)
      .then(() => {
        adminService.getServices().then(res => {
          setServices(res);
        });
      })
      .then(() => {
        setCustomSnackbarOptions({
          opened: true,
          severity: "success",
          message: "Usługa została pomyslnie utworzona"
        });
      })
      .catch(err => {
        console.log(err.response.data);
        setCustomSnackbarOptions({
          opened: true,
          severity: "error",
          message: "Nastąpił problem podczas tworzenia usługi"
        });
      })
  }

  return (
    <div>
      <Snackbar
        role="service-list-snackbar"
        open={customSnackbarOptions.opened}
        autoHideDuration={4000}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        onClose={() => setCustomSnackbarOptions({...customSnackbarOptions, opened: false})}
      >
        <Alert severity={customSnackbarOptions.severity}>{customSnackbarOptions.message}</Alert>
      </Snackbar>
      <Container component="main" maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100px'
          }}
          role="service-list-header"
        >
          <Box>
            <Typography component="h1" variant="h5">Usługi</Typography>
          </Box>
          <Button
            role="service-list-open-dialog-button"
            variant="contained"
            size="large"
            startIcon={<AddIcon/>}
            onClick={() => setModalOpened(true)}>Nowa Usługa</Button>
        </Box>

        <Grid container spacing={2}>
          {services.map(service => (
            <ServiceItem
              key={"service-list-item" + service.id}
              service={service}
            />
          ))}
        </Grid>
      </Container>

      <Dialog
        role="service-list-dialog"
        maxWidth="lg"
        fullWidth={true}
        open={modalOpened}
      >
        <DialogTitle>Nowa Usługa</DialogTitle>
        <DialogContent>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    role="service-list-form-field-description"
                    margin='normal'
                    fullWidth
                    id='description'
                    label='Nazwa Usługi'
                    name='description'
                    onChange={event => setCreatedService({...createdService, description: event.currentTarget.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    role="service-list-form-field-price"
                    margin='normal'
                    type='number'
                    fullWidth
                    id='address'
                    label='Cena Usługi'
                    name='priceRatio'
                    onChange={event => setCreatedService({...createdService, priceRatio: Number(event.currentTarget.value)})}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
            <Button
              sx={{marginRight: '15px'}}
              role="service-item-create-service-approve"
              color="success"
              startIcon={<DoneIcon/>}
              disabled={!createOrderValid}
              onClick={handleCreateService}>
              Utwórz</Button>
            <Button
              sx={{marginRight: '15px'}}
              color="error"
              startIcon={<CloseIcon/>}
              onClick={() => setModalOpened(false)}>Anuluj</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}