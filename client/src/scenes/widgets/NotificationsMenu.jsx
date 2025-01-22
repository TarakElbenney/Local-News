import React from 'react';
import { 
  Menu,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  Badge,
  Notifications as NotificationsIcon
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { Circle } from 'lucide-react';

const NotificationsMenu = ({ notifications, anchorEl, handleClose, handleOpen }) => {
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: "25px" }} />
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

export default NotificationsMenu;