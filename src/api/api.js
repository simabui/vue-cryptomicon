const API_KEY =
  "16329ef6ca67124db3553b9b01560790a3b843f17a26f2c9a964b3adb5d860e9";

const ws = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const tickerHandlers = new Map();

ws.addEventListener("message", ({ data }) => {
  const _data = JSON.parse(data);

  if (_data.TYPE === "500") {
    const info = _data.PARAMETER.split("~");

    const handlers = tickerHandlers.get(info[2]) || [];
    handlers.forEach((fn) => {
      fn(null, true);
    });
  }
  if (_data.TYPE === "5") {
    const handlers = tickerHandlers.get(_data.FROMSYMBOL) || [];
    handlers.forEach((fn) => {
      fn(_data.PRICE);
    });
  }
});

const Calls = {
  sendPayload(body) {
    const _strBody = JSON.stringify(body);

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(_strBody);
      return;
    }

    ws.addEventListener(
      "open",
      () => {
        ws.send(_strBody);
      },
      { once: true }
    );
  },

  subscribetoTicker(ticker, cb) {
    const subscribers = tickerHandlers.get(ticker.name) || [];
    tickerHandlers.set(ticker.name, [...subscribers, cb]);

    this.sendPayload({
      action: "SubAdd",
      subs: [`5~CCCAGG~${ticker.name}~USD`],
    });
  },

  unsubscribeTicker(ticker) {
    tickerHandlers.delete(ticker);
    this.sendPayload({
      action: "SubRemove",
      subs: [`5~CCCAGG~${ticker.name}~USD`],
    });
  },
};

export default Calls;
