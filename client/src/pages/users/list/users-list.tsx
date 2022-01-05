import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import {
  Alert,
  Box,
  Button,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Card,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItem,
  FormLabel,
  FormGroup,
  FormControlLabel, Checkbox
} from '@mui/material';
import 'moment/locale/pl';
import * as React from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import {AdminService} from 'services/admin/admin-service';
import {User} from 'types';
import {CustomSnackbarOptions} from '../../../utils/CustomSnackbarOptions';
import {UserItem} from "../components/user-item/user-item";
import PersonIcon from "@mui/icons-material/Person";

interface Roles {Client: boolean, Worker: boolean, Administrator: boolean}

export const UsersList = () => {
  const [cookies] = useCookies(["token", "role"]);
  const [modalOpened, setModalOpened] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState<User>();
  const [selectedRoles, setSelectedRoles] = React.useState([]);
  const [editedRoles, setEditedRoles] = React.useState<Roles>({
    Client: false,
    Worker: false,
    Administrator: false
  })
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({
    message: "",
    opened: false,
    severity: "success"
  });
  const [users, setUsers] = React.useState<User[]>([]);
  const navigate = useNavigate();

  const adminService: AdminService = new AdminService(cookies);

  React.useEffect(() => {
    document.title = "Lista Użytkowników | Cleanny";

    if (cookies.token && cookies.role && cookies.role.includes("Administrator")) {
      adminService.getUsers().then(res => setUsers(res));
    } else {
      navigate("/sign-in");
    }
  }, []);

  const handleEditUser = (): void => {
    setModalOpened(false);

    let queryString = "roles="

    for (const [role, value] of Object.entries(editedRoles)) {
      if (value) queryString += `${role},`
    }

    queryString = queryString.slice(0, -1);

    // @ts-ignore
    adminService.editRole(editedUser.id, queryString)
      .then(() => {
        adminService.getUsers().then(res => {
          setUsers(res);
        });
      })
      .then(() => {
        setCustomSnackbarOptions({
          opened: true,
          severity: "success",
          message: "Użytkownik został zmieniony"
        });
      })
      .catch(err => {
        console.log(err.response.data);
        setCustomSnackbarOptions({
          opened: true,
          severity: "error",
          message: "Nastąpił problem podczas edycji użytkownika"
        });
      })
    setEditedRoles({Client: false, Worker: false, Administrator: false})
  }

  const handleEditedRoleChange = (event: { target: { name: any; checked: any; }; }) => {
    setEditedRoles({
      ...editedRoles,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div>
      <Snackbar
        role="users-list-snackbar"
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
          role="users-list-header"
        >
          <Box>
            <Typography component="h1" variant="h5">Użytkownicy</Typography>
          </Box>
          <FormControl sx={{width: 300}}>
            <InputLabel htmlFor="users-list-roles-select" id="demo-simple-select-label">Rola</InputLabel>
            <Select
              labelId="users-list-roles-select"
              id="users-list-roles-select"
              value={selectedRoles}
              multiple={true}
              inputProps={{ "data-testid": "users-list-roles-select" }}
              onChange={event => setSelectedRoles(event.target.value as never[])}
            >
              <MenuItem value='Client'>Klient</MenuItem>
              <MenuItem value='Worker'>Pracownik</MenuItem>
              <MenuItem value='Administrator'>Administrator</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          {users.filter(user => {
            if (selectedRoles.length == 0) return true;
            return selectedRoles.every(role => user.roles && user.roles.includes(role))
          }).map(user => (
            <UserItem
              key={"users-list-item" + user.id}
              user={user}
              handleUserDetails={(id: number) => {
                adminService.getUser(id).then(res => {
                  const newEditedRoles = {...editedRoles};
                  res.roles && res.roles.forEach(role => newEditedRoles[role as keyof Roles] = true)
                  setEditedRoles(newEditedRoles);
                  setEditedUser(res);
                  setModalOpened(true);
                });
              }}
            />
          ))}
        </Grid>
      </Container>

      <Dialog
        role="users-list-dialog"
        maxWidth="lg"

        fullWidth={false}
        open={modalOpened}
      >
        <DialogTitle>{editedUser?.firstName + " " + editedUser?.lastName}</DialogTitle>
        <DialogContent sx={{minWidth: 400}}>
          <Card variant="outlined">
            <CardContent>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="users-list-person-address"
                  primary="Adres"
                  secondary={editedUser?.address}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="users-item-person-city"
                  primary="Miasto"
                  secondary={editedUser?.city}
                />
              </ListItem>
            </CardContent>
          </Card>
          {
            (editedUser?.companyName || editedUser?.nip) && <Card variant="outlined" sx={{marginTop: 1}}>
              <CardContent>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    role="users-list-person-company"
                    primary="Nazwa Firmy"
                    secondary={editedUser?.companyName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    role="users-item-person-nip"
                    primary="NIP"
                    secondary={editedUser?.nip}
                  />
                </ListItem>
              </CardContent>
            </Card>
          }
          <Card variant="outlined" sx={{marginTop: 1}}>
            <CardContent>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="users-list-person-address"
                  primary={
                    <FormControl component="fieldset" variant="standard">
                      <FormLabel sx={{color: 'rgba(0, 0, 0, 0.87)'}} component="legend">Rola</FormLabel>
                      <FormGroup sx={{ flexDirection: 'row' }}>
                        <FormControlLabel
                          control={<Checkbox checked={editedRoles["Client"]} onChange={handleEditedRoleChange} name="Client" />}
                          label="Klient"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={editedRoles["Worker"]} onChange={handleEditedRoleChange} name="Worker" />}
                          label="Pracownik"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={editedRoles["Administrator"]} onChange={handleEditedRoleChange} name="Administrator" />}
                          label="Administrator"
                        />
                      </FormGroup>
                    </FormControl>
                  }
                />
              </ListItem>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
            <Button
              sx={{marginRight: '15px'}}
              role="user-item-edit-user-approve"
              color="success"
              onClick={handleEditUser}
              startIcon={<DoneIcon/>}>
              Edytuj</Button>
            <Button
              sx={{marginRight: '15px'}}
              color="error"
              startIcon={<CloseIcon/>}
              onClick={() => {
                setEditedRoles({Client: false, Worker: false, Administrator: false})
                setModalOpened(false)
              }}>Anuluj</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}