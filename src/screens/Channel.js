import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useSendBird } from "../context/useSendBird";
import { Input, List, ListItem, Button } from "@chakra-ui/core";

export function Channel() {
  const { url } = useParams();
  const {
    getChannel,
    sendUserMessage,
    createPreviousMessageListQuery,
    inviteWithUserIds,
    onMessageReceived,
    onTypingStatusUpdated,
    onDeliveryReceiptUpdated,
    onReadReceiptUpdated
  } = useSendBird();

  const [channel, setChannel] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [prevMessageListQuery, setPrevMessageListQuery] = useState({});
  const [userId, setUserId] = useState("");
  const [typingMembers, setTypingMembers] = useState([]);

  useEffect(() => {
    fetchChannel();
    fetchMessages();
    if (channel.channelType === "group") {
      channel.markAsRead();
    }
  }, []);

  useEffect(() => {
    listenOnMessageReceived();
    listenOnTypingStatusUpdated();
    listenOnDeliveryReceiptUpdated();
    listenOnReadReceiptUpdated();
  });

  async function listenOnReadReceiptUpdated() {
    const { groupChannel } = await onReadReceiptUpdated();

    console.log("read", groupChannel);
  }

  async function listenOnDeliveryReceiptUpdated() {
    const { groupChannel } = await onDeliveryReceiptUpdated();
    console.log("delivered", groupChannel);
  }

  async function listenOnTypingStatusUpdated() {
    const { groupChannel } = await onTypingStatusUpdated();

    var members = groupChannel.getTypingMembers();

    // console.log(members);

    setTypingMembers(members);
  }

  async function listenOnMessageReceived() {
    const { message } = await onMessageReceived();

    if (url === message.channelUrl) {
      setMessages((prevState) => [...prevState, message]);
      if (channel.channelType === "group") {
        channel.markAsRead();
        channel.markAsDelivered();
      }
    }
  }

  async function fetchChannel() {
    const channel = await getChannel(url);
    setChannel(channel);
  }

  async function fetchMessages() {
    const channel = await getChannel(url);
    const prevMessageListQuery = await createPreviousMessageListQuery(
      channel,
      3
    );
    setPrevMessageListQuery(prevMessageListQuery);
    prevMessageListQuery.load(function (messages, error) {
      if (error) {
        return console.log(error);
      }

      setMessages(messages);
    });
  }

  async function _onKeyDown(e) {
    if (e.key === "Enter") {
      const newMessage = await sendUserMessage(channel, message);
      setMessages((prevState) => [...prevState, newMessage]);
      setMessage("");
    }
  }

  async function handleLoadMore() {
    prevMessageListQuery.load(function (messages, error) {
      if (error) {
        return console.log(error);
      }

      setMessages((prevState) => [...messages, ...prevState]);
    });
  }

  async function handleInvite() {
    const response = await inviteWithUserIds(channel, [userId]);
    console.log(response);
  }

  return (
    <div>
      Channel {url}
      <br />
      Channel name: {channel?.name}
      <br />
      unreadMessageCount: {channel?.unreadMessageCount}
      <br />
      members:
      {JSON.stringify(channel?.members?.map((element) => element.userId))}
      <Input
        placeholder="UserId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Button onClick={handleInvite} variantColor="teal" size="xs">
        Invite
      </Button>
      <Button
        onClick={() => channel.markAsDelivered()}
        variantColor="teal"
        size="xs"
      >
        delivered
      </Button>
      <Input
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={_onKeyDown}
        onFocus={() => channel.startTyping()}
        onBlur={() => channel.endTyping()}
      />
      {typingMembers.length > 0 &&
        typingMembers
          ?.map((element) => element.userId)
          .join(",")
          .concat(" is typing...")}
      <Button onClick={handleLoadMore} variantColor="teal" size="xs">
        Load more
      </Button>
      <List styleType="disc">
        {messages?.map((element) => {
          // console.log(element);
          return (
            <ListItem key={element.messageId}>
              {element.message}
              {element.createdAt}
              {element._sender.userId}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
