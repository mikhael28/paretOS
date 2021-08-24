import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

/**
 * This is an experimental video chat component, with screen sharing, to be used with users of the Pareto platform as a simple videochat service instead of Zoom.
 * @TODO has the M1 issue been fixed? This component did not work on non-intel compiled browsers, something with the web rtc protocol was not finalized.
 * @TODO Extensive work needed - closing rooms, reconnecting/disconnecting, much more business logic needed. This is why there was that 'proxy' to localhost 8000
 * @TODO for production, we need an actual deployed service to track this stuff. Otherwise, it's just an experiment.
 * @param {*} props
 * @returns
 */

const Room = (props) => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  const senders = useRef([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log("Stream: ", stream);
        let splitPath = window.location.pathname.split("/");
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socketRef.current = io.connect("/");
        socketRef.current.emit("join room", splitPath[splitPath.length - 1]);

        socketRef.current.on("other user", (userID) => {
          callUser(userID);
          otherUser.current = userID;
        });

        socketRef.current.on("user joined", (userID) => {
          otherUser.current = userID;
        });

        socketRef.current.on("offer", handleRecieveCall);

        socketRef.current.on("answer", handleAnswer);

        socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
      })
      .catch((e) => console.log("Initial Socket E: ", e));
  }, []);

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach((track) =>
        senders.current.push(
          peerRef.current.addTrack(track, userStream.current)
        )
      );
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleRecieveCall(incoming) {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            peerRef.current.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("answer", payload);
      });
  }

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleTrackEvent(e) {
    partnerVideo.current.srcObject = e.streams[0];
  }

  function shareScreen() {
    navigator.mediaDevices
      .getDisplayMedia({ cursor: true })
      .then((stream) => {
        console.log("Stream: ", stream);
        const screenTrack = stream.getTracks()[0];
        console.log(screenTrack);
        console.log(senders);
        senders.current
          .find((sender) => sender.track.kind === "video")
          .replaceTrack(screenTrack);
        screenTrack.onended = function () {
          senders.current
            .find((sender) => sender.track.kind === "video")
            .replaceTrack(userStream.current.getTracks()[1]);
        };
      })
      .catch((e) => console.log(e));
  }

  console.log("Senders: ", senders);

  return (
    <div>
      <video
        controls
        style={{ height: 500, width: 500 }}
        autoPlay
        ref={userVideo}
      />
      <video
        controls
        style={{ height: 500, width: 500 }}
        autoPlay
        ref={partnerVideo}
      />
      <button onClick={shareScreen}>Share screen</button>
    </div>
  );
};

export default Room;
