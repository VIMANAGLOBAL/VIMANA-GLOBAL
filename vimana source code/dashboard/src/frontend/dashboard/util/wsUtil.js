export function initWs(dispatch, id) {
    // const socket = new WebSocket(process.env.WS_SERVER_URL);
    // socket.onopen = () => {
    //     console.log("opened socket");
    //     socket.send(id);
    // };

    // socket.onmessage = message => {
    //     switch (message.data) {
    //         case "KYC_PASSED":
    //             dispatch(showAlertAction({ title: "KYC procedure passed", type: 'success' }));
    //             dispatch({type: message.data});
    //             break;
    //
    //         case "KYC_FAILED":
    //             dispatch(showAlertAction({ title: "KYC procedure failed", type: 'error' }));
    //             dispatch({type: message.data});
    //             break;
    //
    //         default:
    //             console.error(`Unknown message type: ${message.data}`);
    //     }
    //
    // };
    //
    // socket.onerror = e => {
    //     console.error(`Ws error: ${e.message}`);
    // };
}