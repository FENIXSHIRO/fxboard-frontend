<template>
  <v-stage :config="stageConfig">
    <v-layer>
      <v-text
        :config="textConfig"
        @transform="handleTransform"
        @dblclick="handleDblClick"
        ref="textNode"
      />
      <v-transformer
        ref="transformer"
        :config="transformerConfig"
      />
    </v-layer>
  </v-stage>
</template>

<script lang="ts">
import Konva from 'konva';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },
  data() {
    return {
      stageConfig: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      transformerConfig: {
        node: this.textNode,
        enabledAnchors: ['middle-left', 'middle-right'],
        boundBoxFunc: this.boundBoxFunc,
      },
      textConfig: {
        text: 'Some text here',
        x: 50,
        y: 80,
        fontSize: 20,
        draggable: true,
        width: 200,
      },
      textNode: null as any | null,
      transformer: null as any | null,
    };
  },
  methods: {
    boundBoxFunc(oldBox: any, newBox: any) {
      newBox.width = Math.max(30, newBox.width);
      return newBox;
    },
    handleTransform() {
      const node = this.textNode.getNode();
      node.setAttrs({
        width: node.width() * node.scaleX(),
        scaleX: 1,
      });
    },
    handleDblClick() {
      const node = this.textNode.getNode();
      const tr = this.transformer.getNode();
      node.hide();
      tr.hide();

      const textPosition = node.absolutePosition();
      const areaPosition = {
        x: textPosition.x,
        y: textPosition.y,
      };

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      this.setupTextarea(textarea, node, areaPosition);
      textarea.focus();

      const handleOutsideClick = (e: any) => {
        if (e.target !== textarea) {
          node.text(textarea.value);
          textarea.parentNode?.removeChild(textarea);
          window.removeEventListener('click', handleOutsideClick);
          node.show();
          tr.show();
          tr.forceUpdate();
        }
      };

      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      });
    },
    setupTextarea(textarea: HTMLTextAreaElement, node: any, areaPosition: { x: number; y: number }) {
      textarea.value = node.text();
      textarea.style.position = 'absolute';
      textarea.style.top = `${areaPosition.y}px`;
      textarea.style.left = `${areaPosition.x}px`;
      textarea.style.width = `${node.width() - node.padding() * 2}px`;
      textarea.style.height = `${node.height() - node.padding() * 2 + 5}px`;
      textarea.style.fontSize = `${node.fontSize()}px`;
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = `${node.lineHeight()}`;
      textarea.style.fontFamily = node.fontFamily();
      textarea.style.textAlign = node.align();
      textarea.style.color = node.fill();
      const rotation = node.rotation();
      let transform = rotation ? `rotateZ(${rotation}deg)` : '';
      transform += `translateY(-${2 + Math.round(node.fontSize() / 20)}px)`;
      textarea.style.transform = transform;

      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 3}px`;
    },
  },
  mounted() {
    this.textNode = this.$refs.textNode as Konva.Text;
    this.transformer = this.$refs.transformer as Konva.Transformer;
  },
});
</script>