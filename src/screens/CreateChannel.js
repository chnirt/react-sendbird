import React, { useState } from "react";
import { Input, Button } from "@chakra-ui/core";

import { useSendBird } from "../context/useSendBird";

export function CreateChannel() {
  const [topicChannel, setTopicChannel] = useState("");
  const { createChannelWithUserIds } = useSendBird();

  function handleCreate() {
    createChannelWithUserIds(undefined, topicChannel);
  }

  return (
    <div>
      Create Channel Screen
      <Input
        placeholder="Topic Channel"
        value={topicChannel}
        onChange={(e) => setTopicChannel(e.target.value)}
      />
      <Button onClick={handleCreate} variantColor="teal" size="xs">
        Save
      </Button>
    </div>
  );
}
