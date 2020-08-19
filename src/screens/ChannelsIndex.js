import React, { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSendBird } from "../context/useSendBird";
import { List, ListItem } from "@chakra-ui/core";

export function ChannelsIndex() {
  let navigate = useNavigate();
  const { channelListQuery, markAsDelivered } = useSendBird();
  const [channelList, setChannelList] = useState([]);

  useLayoutEffect(() => {
    fetchChannels();
  }, []);

  async function fetchChannels() {
    const channels = await channelListQuery();
    channels.map((channel) => {
      // console.log(channel.url);
      return markAsDelivered(channel.url);
    });
    setChannelList(channels);
  }

  function navigateChannel(url) {
    navigate(url);
  }
  return (
    <div>
      Channels List
      <List styleType="disc">
        {channelList?.map((element) => {
          return (
            <ListItem
              key={element.url}
              onClick={() => navigateChannel(element.url)}
            >
              name: {element.name}| unreadMessageCount:
              {element.unreadMessageCount}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
