
import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
  Menu,
  Divider,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const NotificationsMenu = ({ notifications, anchorEl, handleClose, handleOpen }) => {
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications sx={{ fontSize: "25px" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 2,
            width: '360px',
            maxHeight: '480px',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight="600">
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount} unread notifications
          </Typography>
        </Box>
        
        <Divider />

        {notifications.length === 0 ? (
          <MenuItem sx={{ py: 3 }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          </MenuItem>
        ) : (
          <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
            {notifications.map((notif, index) => (
              <MenuItem 
                key={index}
                sx={{
                  py: 2,
                  px: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  {!notif.isRead && (
                    <Circle 
                      size={8}
                      className="text-blue-500 mt-2 mr-2"
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      {notif.message}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}
        
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Typography 
                  variant="body2" 
                  color="primary"
                  sx={{ fontWeight: 500 }}
                >
                  View all notifications
                </Typography>
              </MenuItem>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) {
        console.log("No token found. Skipping fetch.");
        return;
      }
      try {
        const response = await fetch("http://localhost:3001/notifications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications. Status: ${response.status}`);
        }
        const data = await response.json();
        
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleOpen = async (event) => {
    setAnchorEl(event.currentTarget);
    
    const unreadNotifications = notifications.filter(notif => !notif.isRead);
  
    unreadNotifications.forEach(async (notif) => {
      await fetch(`http://localhost:3001/notifications/${notif._id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    });
  
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };
  
  const handleClose = () => setAnchorEl(null);

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{ "&:hover": { color: primaryLight, cursor: "pointer" } }}
        >
          Maamoura News
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: "25px" }} />
          <NotificationsMenu 
            notifications={notifications}
            anchorEl={anchorEl}
            handleClose={handleClose}
            handleOpen={handleOpen}
          />
          <Help sx={{ fontSize: "25px" }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem"
              }}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <MenuIcon />
        </IconButton>
      )}

      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <NotificationsMenu 
              notifications={notifications}
              anchorEl={anchorEl}
              handleClose={handleClose}
              handleOpen={handleOpen}
            />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem"
                }}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;