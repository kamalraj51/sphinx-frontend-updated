import React from "react";

import { NavLink } from "react-router-dom";

const AdminSignin = () => {
  const title = {
    textAlign: "center",
  };
  return (
    <>
      <Container>
        <Form>
          <h2 style={title}>Examini Login</h2>
          <RegisterCredintials>
            <Label for="username">UserName</Label>
            <Input type="text" id="username" />
          </RegisterCredintials>

          <RegisterCredintials>
            <Label for="password">Password</Label>
            <Input type="password" id="password" />
          </RegisterCredintials>

          <Button type="submit">signup</Button>
        </Form>
      </Container>
    </>
  );
};

export default AdminSignin;
