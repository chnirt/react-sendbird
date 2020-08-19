import React, { useState } from "react";
import { Input, Button } from "@chakra-ui/core";

import { useAuth } from "../context/useAuth";
import { useSendBird } from "../context/useSendBird";

export function Login() {
  const { login } = useAuth();
  const { connect } = useSendBird();
  const [username, setUsername] = useState("chnirt");

  return (
    <div>
      Login page
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        onClick={() => {
          login(username);
          connect(username);
        }}
        variantColor="teal"
        size="xs"
      >
        Login
      </Button>
    </div>
  );
}
