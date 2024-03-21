import * as React from "react";
import { useState, useEffect } from "react";
import NavBar from "../../components/navigationBar/navBar";
import {
  Button,
  Grid,
  Typography,
  Modal,
  TextField,
  CircularProgress,
  Input,
  MenuItem,
  Box,
  Select,
} from "@mui/material";
import AuthService from "../../components/AuthService";
import { User } from "../../components/models/user";
import CRUDLocalStorage from "../../components/CRUDLocalStorage";
import { useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material/Select";

const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateModal, setBirthDateModal] = useState(false);
  const [profilePictureModal, setProfilePictureModal] = useState(false);

  const storeCurrentUser = async () => {
    setCurrentUser(
      (await AuthService.getUserFromStorage(
        AuthService.getCurrentUserID()
      )) as User
    );
  };

  useEffect(() => {
    storeCurrentUser();
  }, [currentUser]);

  async function updateUser(user: User) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    const updatedUsers = users.filter((userItem) => userItem.id !== user.id);
    updatedUsers.push(user as User);
    await CRUDLocalStorage.setAsyncData("users", updatedUsers);
  }

  const handleNameModal = () => {
    setNameModal(!nameModal);
    if (nameModal) {
      setFirstName("");
      setLastName("");
    }
  };
  const handleBirthDateModal = () => {
    setBirthDateModal(!birthDateModal);
    if (birthDateModal) {
      setBirthDate("");
    }
  };
  const handleProfilePictureModal = () => {
    setProfilePictureModal(!profilePictureModal);

  };
  const handlePasswordModal = () => {
    setPasswordModal(!passwordModal);
    if(passwordModal){
      setPassword("");
    }
  };
  const handleGenderModal = () => {
    setGenderModal(!genderModal);
  };
  const handleGenderChange = async (event: SelectChangeEvent) => {
    const chosenGender = event.target.value as string;
    handleGenderModal();
    setIsLoading(true);
    const updatedUser: User = {
      ...(currentUser as User),
      gender: chosenGender,
    };
    await updateUser(updatedUser);
    navigate("/home");
  };
  const handleNameChange = async () => {
    handleNameModal();
    setIsLoading(true);
    const updatedUser: User = {
      ...(currentUser as User),
      firstName: firstName as string,
      lastName: lastName as string,
    };
    await updateUser(updatedUser);
    navigate("/home");
  };
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProfilePictureModal();
      setIsLoading(true);
      const imageUrl: string = URL.createObjectURL(file);
      const updatedUser: User = {
        ...(currentUser as User),
        avatarUrl: imageUrl,
      };
      await updateUser(updatedUser);
      console.log(currentUser)
      navigate("/home");
    }
  };
  const handleBirthDateChange = async () => {
    handleBirthDateModal();
    setIsLoading(true);
    const updatedUser: User = {
      ...(currentUser as User),
      birthDate: birthDate as string,
    };
    await updateUser(updatedUser);
    navigate("/home");
  };

  const handlePasswordChange = async () => {
    handlePasswordModal();
    setIsLoading(true);
    const updatedUser: User = {
      ...(currentUser as User),
      password: password as string,
    };
    await updateUser(updatedUser);
    navigate("/home");
  };

  return (
    <>
      <NavBar />
      <Box mx={30} sx={{ paddingTop: 8 }}>
        {isLoading || !currentUser ? ( // Render CircularProgress if isLoading is true
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              justifyContent: "center",
              display: "flex",
              margin: "auto",
              fontFamily: 'Poppins'
            }}
          >
            <Grid container spacing={4} justifyContent="center">
              <Grid item>
                <Button //Name
                  onClick={handleNameModal}
                  sx={{
                    width: 250,
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  Change Name
                </Button>
                <Button //Password
                  onClick={handlePasswordModal}
                  sx={{
                    width: 250,
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  Change Password
                </Button>
                <Button //Gender
                  onClick={handleGenderModal}
                  sx={{
                    width: 250,
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  Change Gender
                </Button>
                <Button //Birthday
                  onClick={handleBirthDateModal}
                  sx={{
                    width: 250,
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  Change Birth Date
                </Button>
                <Button //Profile Picture
                  onClick={handleProfilePictureModal}
                  sx={{
                    width: 250,
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  Change Profile Picture
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        <Modal //Name
          id="NameChange"
          open={nameModal}
          onClose={handleNameModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontFamily: 'Poppins' }}
            >
              Change Name
            </Typography>
            <TextField
              required
              fullWidth
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ mt: 2,fontFamily: 'Poppins' }}
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ mt: 2,fontFamily: 'Poppins' }}
            />
            <Button
              variant="contained"
              onClick={handleNameChange}
              sx={{ mt: 2,fontFamily: 'Poppins' }}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        <Modal //Password
          id="PasswordChange"
          open={passwordModal}
          onClose={handlePasswordModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontFamily: 'Poppins' }}
            >
              Change Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              required
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mt: 2,fontFamily: 'Poppins' }}
            />
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              sx={{ mt: 2,fontFamily: 'Poppins' }}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        <Modal //Birthday
          id="BirthdayModal"
          open={birthDateModal}
          onClose={handleBirthDateModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontFamily: 'Poppins' }}
            >
              Change Birth Date
            </Typography>
            <TextField
              fullWidth
              required
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              sx={{ mt: 2, fontFamily:'Poppins' }}
            />
            <Button
              variant="contained"
              onClick={handleBirthDateChange}
              sx={{ mt: 2,fontFamily: 'Poppins' }}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        <Modal //Gender
          id="GenderModal"
          open={genderModal}
          onClose={handleGenderModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontFamily: 'Poppins' }}
            >
              Change Gender
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={"Male"}
              label="Gender"
              onChange={handleGenderChange}
              sx={{ fontFamily: 'Poppins' }}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </Box>
        </Modal>
        <Modal //Profile Picture
          id="ProfilePictureChange"
          open={profilePictureModal}
          onClose={handleProfilePictureModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontFamily: 'Poppins' }}
            >
              Change Profile Picture
            </Typography>
            <Input
              required
              type="file"
              onChange={handleProfilePictureChange}
              sx={{ mt: 2, fontFamily:'Poppins' }}
            />
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ProfileSettingsPage;
