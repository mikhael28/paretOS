import React, { useEffect, useState } from "react";
import "@aws-amplify/pubsub";
import { createMessage } from "../graphql/mutations";
import { onCreateMessage } from "../graphql/subscriptions";
import API, { graphqlOperation } from "@aws-amplify/api";
import { messagesByChannelId } from "../graphql/queries";
import { I18n } from "@aws-amplify/core";

/**
 * This is the Messaging component. Perhaps we need to add it back into a bottom-right icon, similar to a chat ui.
 * @TODO How can we set the graphQL subscription in App.js, instead of here, and to simply pass the updated messages here through props instead of manually loading all new messages each time this component mounts
 */

function Messaging(props) {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    API.graphql(
      graphqlOperation(messagesByChannelId, {
        channelID: "1",
        sortDirection: "ASC",
      })
    ).then((response) => {
      const items = response.data.messagesByChannelID.items;

      if (items) {
        setMessages(items);
      }
    });
  }, []);

  useEffect(() => {
    let chatWindow = document.getElementById("end-scroll");
    let xh = chatWindow.scrollHeight;
    chatWindow.scrollTo(0, xh);
  }, [messages]);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (event) => {
        setMessages([...messages, event.value.data.onCreateMessage]);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [messages]);

  const handleChange = (event) => {
    setMessageBody(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = {
      channelID: "1",
      author: `${props.user.fName} ${props.user.lName}`,
      body: messageBody.trim(),
    };

    try {
      setMessageBody("");
      await API.graphql(graphqlOperation(createMessage, { input }));
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className="messaging">
      <h2 className="messaging-header">{I18n.get("chatroom")}</h2>
      <div className="messaging-container">
        <div className="messages-scroller" id="end-scroll">
          {messages.map((message) => {
            let messageStyling;
            if (message.author === `${props.user.fName} ${props.user.lName}`) {
              messageStyling = "message me";
            } else if (message.author === "Pareto League") {
              messageStyling = "message league";
            } else {
              messageStyling = "message";
            }
            return (
              <div key={message.id} className={messageStyling}>
                <p>{message.body}</p>
                <p style={{ fontSize: 12 }}>{message.author}</p>
              </div>
            );
          })}
        </div>
        <div className="chat-bar">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="messageBody"
              placeholder={I18n.get("enterMessage")}
              onChange={handleChange}
              value={messageBody}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Messaging;
