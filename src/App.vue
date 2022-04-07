<template>
  <div class="container">
    <add-crypto :cryptosList="this.cryptosList" :cryptos="this.cryptos" :subscribeCrypto="this.subscribeCrypto" />
    <crypto-list
      v-if="this.cryptos.length"
      :cryptos="this.cryptos"
      :sel="this.sel"
      :selectCrypto="this.selectCrypto"
      :removeCrypto="this.removeCrypto"
    />
    <graph-list
      v-if="this.sel"
      :sel="this.sel"
      :graph="this.graph"
      :maxGraphElements="this.maxGraphElements"
      :normalizePrice="this.normalizePrice"
      :removeGraph="this.removeGraph"
      ref="graphItem"
    />
    <modal ref="modal">
      <template v-slot:main>
        <div>some text</div>
      </template>
      <template v-slot:button="{ close }">
        <button @click="close">OK</button>
      </template>
    </modal>
    <modal ref="warningModal">
      <template v-slot:main>
        <div>some warning text</div>
      </template>
      <template v-slot:button="{ close }">
        <button @click="close">OK</button>
        <button @click="close">I Understand</button>
      </template>
    </modal>
    <button @click="this.handleOpenModal">open modal</button>
    <button @click="this.handleOpenWarningModal">open warning modal</button>
  </div>
</template>

<script>
import Calls from "./api/api";
import AddCrypto from "./components/AddCrypto";
import CryptoList from "./components/CryptoList";
import GraphList from "./components/GraphList";
import Modal from "./components/Modal";

export default {
  name: "App",
  components: {
    AddCrypto,
    CryptoList,
    GraphList,
    Modal,
  },
  data() {
    return {
      sel: null,
      graph: [],
      cryptos: [],
      cryptosList: [],
      showMore: false,
      tickerError: false,
      maxGraphElements: 0,
    };
  },

  async created() {
    const response = await fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true");
    const { Data } = await response.json();
    const mappedData = Object.values(Data).map((item) => item.Symbol);
    this.cryptosList = mappedData;

    let cryptoList = localStorage.getItem("cryptoMiconList");
    if (cryptoList) {
      cryptoList = JSON.parse(cryptoList);
      cryptoList.forEach((crypto) => this.subscribeCrypto(crypto));
    }
  },

  mounted() {
    window.addEventListener("resize", this.calculateMaxGrapthElements);
  },
  unmounted() {
    window.removeEventListener("resize", this.calculateMaxGrapthElements);
  },
  watch: {
    sel() {
      this.$nextTick().then(this.calculateMaxGrapthElements);
    },
  },

  methods: {
    selectCrypto(crypto) {
      this.sel = crypto;
      this.graph = [];
    },

    subscribeCrypto(obj) {
      this.cryptos.push(obj);
      localStorage.setItem("cryptoMiconList", JSON.stringify(this.cryptos));
      this.input = "";

      Calls.subscribetoTicker(obj, (newPrice, isError) => {
        this.updateTicker(obj.name, newPrice, isError);
      });
    },
    updateTicker(name, newPrice, error) {
      const crypto = this.cryptos.find((crypto) => crypto.name === name);

      crypto.price = this.normalizePrice(newPrice);
      crypto.isError = error;

      if (this.sel?.name === name) {
        if (newPrice) {
          this.graph.push(newPrice);
        }
      }

      if (this.graph.length >= this.maxGraphElements) {
        this.graph = this.graph.slice(1, this.maxGraphElements);
      }
    },

    removeCrypto(name) {
      Calls.unsubscribeTicker(name);

      this.cryptos = this.cryptos.filter((crypto) => crypto.name !== name);
      localStorage.setItem("cryptoMiconList", JSON.stringify(this.cryptos));
      this.sel = "";
    },
    removeGraph() {
      this.sel = null;
    },
    normalizePrice(price) {
      if (price) {
        return price > 1 ? price.toFixed(2) : price.toPrecision(2);
      }
    },

    calculateMaxGrapthElements() {
      if (this.$refs.graphItem) {
        this.maxGraphElements = this.$refs.graphItem.getGrapth();
      }
    },

    handleOpenModal() {
      this.$refs.modal.open();
    },
    handleOpenWarningModal() {
      this.$refs.warningModal.open();
    },
  },
};
</script>

<style lang="scss">
html {
  box-sizing: border-box;
  width: 100vw;
  overflow-x: hidden;
}
.container {
  max-width: 1400px;
  margin: auto;
  font-family: "Montserrat", sans-serif;
}
</style>
