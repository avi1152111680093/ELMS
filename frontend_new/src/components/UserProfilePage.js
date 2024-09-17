import React from "react";
import { Avatar, Stack, Typography, IconButton } from "@mui/material";

function UserProfilePage() {
  return (
    <div>
      <Stack spacing={2}>
        <div style={{ alignSelf: "center" }}>
          <IconButton>
            <Avatar
              alt="Avinash Kumar"
              src="https://scontent.fmaa8-1.fna.fbcdn.net/v/t1.6435-9/103782454_804215123443464_8638898312476848541_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=bU_UglI1TnsAX_zrnQT&_nc_ht=scontent.fmaa8-1.fna&oh=e8c20ddaa4954a3e85d237f8becafc09&oe=61A46415"
              sx={{
                width: 200,
                height: 200,
              }}
            />
          </IconButton>
          <Typography variant="h5" component="h5">
            Username: avi1152
          </Typography>
        </div>
        <div></div>
      </Stack>
    </div>
  );
}

export default UserProfilePage;
