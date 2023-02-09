import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

export const list = (excelDownload, handleGetData, agencyName, handleLogout, setDataArr, isAdmin) => (
  <Box height="100vh" width="15rem" display="flex" justifyContent="space-between" flexDirection="column" boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px">
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
);