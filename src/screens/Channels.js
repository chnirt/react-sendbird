import React, { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/core";

import { useAuth } from "../context/useAuth";
import { useSendBird } from "../context/useSendBird";

export function Channels() {
  let navigate = useNavigate();
  const { logout } = useAuth();
  const { disconnect, onTotalUnreadMessageCountUpdated } = useSendBird();

  useEffect(() => {
    listenOnTotalUnreadMessageCountUpdated();
  });

  async function listenOnTotalUnreadMessageCountUpdated() {
    const {
      totalCount,
      countByCustomTypes
    } = await onTotalUnreadMessageCountUpdated();
    console.log(totalCount, countByCustomTypes);
  }

  function navigateIndex() {
    navigate("");
  }

  function navigateCreate() {
    navigate("create");
  }

  return (
    <Fragment>
      <Button
        onClick={() => {
          logout();
          disconnect();
        }}
        variantColor="teal"
        size="xs"
      >
        Logout
      </Button>
      <br />
      <Button onClick={navigateIndex} variantColor="teal" size="xs">
        List
      </Button>
      <Button onClick={navigateCreate} variantColor="teal" size="xs">
        Create
      </Button>
      <br />

      <Outlet />
    </Fragment>
  );
}
