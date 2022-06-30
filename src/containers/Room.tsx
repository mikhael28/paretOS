import { UnknownNodeType } from "@portabletext/react";
import React, { useRef, useEffect } from "react";
import io, { Socket, SocketOptions } from "socket.io-client";

/**
 * This is an experimental video chat component, with screen sharing, to be used with users of the Pareto platform as a simple videochat service instead of Zoom.
 * @TODO #265
 * @param {*} props
 * @returns
 */

// eslint-disable-next-line no-unused-vars
const Room = () => {
  const userVideo = useRef(null as unknown as HTMLVideoElement);
  const partnerVideo = useRef(null as unknown as HTMLVideoElement);
  const peerRef = useRef(null as unknown as RTCPeerConnection);
  const socketRef = useRef(null as unknown as Socket);
  const otherUser = useRef(null);
  const userStream = useRef(null as unknown as MediaStream);
  const senders = useRef([]);
  senders.current = [];

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log("Stream: ", stream);
        let splitPath = window.location.pathname.split("/");
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socketRef.current = (io as any).connect("/");
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

  function callUser(userID: string | number) {
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach((track) =>
        senders.current.push(
          peerRef.current.addTrack(track, userStream.current) as never
        )
      );
  }

  function createPeer(userID: string | number) {
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

  function handleNegotiationNeededEvent(userID: string | number) {
    peerRef.current
      .createOffer()
      .then((offer) => peerRef.current.setLocalDescription(offer))
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

  function handleRecieveCall(incoming: any) {
    peerRef.current = createPeer("");
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
      .then(() => peerRef.current.createAnswer())
      .then((answer) => peerRef.current.setLocalDescription(answer))
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("answer", payload);
      });
  }

  function handleAnswer(message: any) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e: any) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming: RTCIceCandidateInit) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleTrackEvent(e: any) {
    partnerVideo.current.srcObject = e.streams[0];
  }

  function shareScreen() {
    navigator.mediaDevices
      .getDisplayMedia({ cursor: true } as any)
      .then((stream) => {
        console.log("Stream: ", stream);
        const screenTrack = stream.getTracks()[0];
        console.log(screenTrack);
        console.log(senders);
        (senders.current as any).find((sender: any) => sender.track.kind === "video").replaceTrack(screenTrack);
        screenTrack.onended = function () {
          (senders.current as any)
            .find((sender: any) => sender.track.kind === "video")
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
