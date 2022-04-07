<template>
  <section class="graph-section">
    <h3>{{ sel.name }} - USD</h3>
    <div class="graph" ref="graph">
      <div v-for="bar in normalizeGraph()" :key="bar.id" :style="this.getHigh(bar)" class="graph__item">
        <span class="graph__price">{{ normalizePrice(bar) }}</span>
      </div>
    </div>
    <div class="graph__remove" @click="removeGraph">
      <i class="fas fa-times"></i>
    </div>
  </section>
</template>
<script>
export default {
  name: "GraphList",
  props: {
    sel: {
      type: Object,
      default: () => {},
    },
    maxGraphElements: {
      type: Number,
      default: 0,
    },
    graph: {
      type: Array,
      default: () => [],
    },
    normalizePrice: {
      type: Function,
      default: () => null,
    },
    removeGraph: {
      type: Function,
      default: () => null,
    },
  },
  methods: {
    getGrapth() {
      return Math.floor(this.$refs.graph.clientWidth / 40);
    },
    getHigh(bar) {
      if (bar > 100) {
        return { height: "100%" };
      }

      return { height: `${bar}%` };
    },
    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      return this.graph.map((price) => {
        let diff = maxValue - minValue;
        if (diff > 0) {
          return (5 + (price - minValue) * 95) / (maxValue - minValue);
        }
        return 0;
      });
    },
  },
};
</script>
<style lang="scss">
.graph {
  height: 300px;
  border-left: 2px solid #d7dde1;
  border-bottom: 2px solid #d7dde1;
  display: flex;
  align-items: end;

  &-section {
    position: relative;
  }

  &__item {
    background: #6037f5;
    width: 40px;

    &:not(:first-child) {
      margin-left: 3px;
    }
  }

  &__price {
    display: block;
    margin-top: -20px;
  }

  &__remove {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
}
</style>
