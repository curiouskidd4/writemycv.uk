
// const baseUrl = process.env.REACT_APP_WS_URL;

const getWebsocket = (props) => {
  let webSocket;
  try{
     webSocket = new WebSocket(props.baseUrl + `?token=${props.token}`);
  }catch(err){
    debugger
  }

  webSocket.onopen = async () => {
    // let token = await auth.getWSToken();
    // await webSocket.send(props.token);

    await webSocket.send(
      JSON.stringify({
        event: "register_session",
        session_id: props.sessionId,
      })
    );
    props.onOpen();
  };

  

  return webSocket;
};

export default getWebsocket;
