<template>
  <section>
    <div class="buttonGroup">
      <button class="buttonGroup__prev" @click="goPrev" :disabled="this.page === 1">back</button>
      <button class="buttonGroup__next" @click="goNext" :disabled="disableNext">next</button>
    </div>
    <hr class="line" />
    <ul class="crypto">
      <li
        v-for="crypto in filteredCryptos()"
        :key="crypto.id"
        :class="{
          'crypto__item-selected': sel === crypto,
          'crypto__item-error': crypto.isError,
        }"
        class="crypto__item"
        @click="selectCrypto(crypto)"
      >
        <p class="crypto__item__title">{{ crypto.name }} - USD</p>
        <p class="crypto__item__price">{{ crypto.price || "-" }}</p>
        <button class="crypto__item__delete" @click.stop="removeCrypto(crypto.name)">
          <i class="fas fa-trash"></i>
          Видалити
        </button>
      </li>
    </ul>
    <hr class="line" />
  </section>
</template>
<script>
export default {
  name: "CryptoList",
  props: {
    cryptos: {
      type: Array,
      required: true,
    },
    sel: {
      type: Object,
      default: () => {},
    },
    selectCrypto: {
      type: Function,
      required: true,
    },
    removeCrypto: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      page: 1,
      disableNext: false,
      filter: "",
    };
  },
  methods: {
    filteredCryptos() {
      const start = (this.page - 1) * 6;
      const end = this.page * 6;

      if (this.cryptos.length) {
        const fileteredCryptos = this.cryptos.filter((crypto) => crypto.name.includes(this.filter.toUpperCase()));
        if (fileteredCryptos.length < end) {
          this.disableNext = true;
        } else {
          this.disableNext = false;
        }
        return fileteredCryptos.slice(start, end);
      }
      return [];
    },
    goPrev() {
      this.page -= 1;
    },
    goNext() {
      this.page += 1;
    },
  },
};
</script>
<style lang="scss">
.buttonGroup {
  margin-top: 10px;

  &__prev,
  &__next {
    font-weight: 700;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;

    &:active {
      background: #afafaf;
    }
  }
  &__next {
    margin-left: 10px;
  }
}
.crypto {
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  margin: 40px 0;
  justify-content: space-between;

  &__item {
    flex: 0 0 32.333333%;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 10px;
    padding: 10px 0 30px 0;
    box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    margin-bottom: 10px;

    &:hover {
      cursor: pointer;
    }

    &-selected {
      border: 2px solid #6037f5;
    }

    &__title {
      color: #dadde4;
      text-transform: uppercase;
    }

    &__price {
      font-weight: 700;
      font-size: 35px;
      margin-top: 0;
      margin-bottom: 50px;
    }

    &__delete {
      background: transparent;
      border: none;
      cursor: pointer;
    }

    &-error {
      background-color: #ffe4e4;
    }
  }
}
</style>
