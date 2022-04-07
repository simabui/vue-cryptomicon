<template>
  <form class="form" @submit.prevent="addCryptoForm">
    <label for="btc" class="form__label">Тікер</label>
    <input type="text" name="btc" id="btc" class="form__input" placeholder="BTC" v-model="input" autocomplete="off" />
    <ul class="autocomplete">
      <li v-for="sugCrypto in trimmedCryptos" :key="sugCrypto" class="autocomplete__item" @click="this.addSuggestedCrypto(sugCrypto)">
        {{ sugCrypto }}
      </li>
      <li v-if="trimmedCryptos.length" class="autocomplete__item" @click="showMoreCryptos">Показати ще...</li>
    </ul>
    <span v-if="error" class="form__error">Даний біткоїн вже є</span>
    <button type="submit" class="form__button">
      <i class="fas fa-plus"></i>
      Додати
    </button>
  </form>
</template>
<script>
export default {
  name: "AddCrypto",
  props: {
    cryptosList: {
      type: Array,
      required: true,
    },
    cryptos: {
      type: Array,
      required: true,
    },
    subscribeCrypto: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      input: "",
      error: false,
      suggestedCryptos: [],
      suggestedCryptosLimit: 4,
    };
  },
  watch: {
    input(val) {
      this.error = false;
      this.suggestedCryptosLimit = 4;
      if (!val.length) {
        this.suggestedCryptos = [];
        return;
      }
      const _val = val.toUpperCase();
      const filteredCryptos = this.cryptosList.filter((item) => item.includes(_val));
      this.suggestedCryptos = filteredCryptos;
    },
  },
  computed: {
    trimmedCryptos() {
      return this.suggestedCryptos.slice(0, this.suggestedCryptosLimit);
    },
  },
  methods: {
    addCryptoForm() {
      const obj = {
        name: this.input.toUpperCase(),
        price: 0.0,
        id: Math.floor(Math.random() * 100),
        isError: false,
      };
      this.validate(obj.name);
      if (!this.error) {
        this.subscribeCrypto(obj);
        this.input = "";
      }
    },
    showMoreCryptos() {
      this.suggestedCryptosLimit = this.suggestedCryptos.length;
    },
    addSuggestedCrypto(crypto) {
      const obj = {
        name: crypto,
        price: 0.0,
        id: Math.floor(Math.random() * 100),
      };

      this.validate(obj.name);
      if (!this.error) {
        console.log("test");
        this.subscribeCrypto(obj);
        this.input = "";
      }
    },
    validate(inputCrypto) {
      this.error = false;

      const crypto = this.cryptos.find((item) => item.name === inputCrypto);
      if (crypto) this.error = true;
      if (!inputCrypto.length) return;
    },
  },
};
</script>
<style lang="scss">
.form {
  &__label {
    font-weight: 700;
    display: block;
  }

  &__input {
    margin-top: 10px;
    border: transparent;
    border-bottom: 1px solid #73819a;
    padding: 5px 10px;

    &:focus-visible {
      border: transparent;
      border-bottom: 1px solid #73819a;
    }
  }

  &__button {
    margin-top: 10px;
    display: block;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid #73819a;
    background: #73819a;
    color: #fff;
    padding: 5px 10px;
  }

  &__error {
    display: block;
    color: #ff0000;
    font-size: 13px;
    font-weight: 700;
    margin-top: 10px;
  }
}

.autocomplete {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  &__item {
    margin-left: 10px;
    margin-top: 10px;
    background-color: #cdcad1;
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
  }
}
</style>
