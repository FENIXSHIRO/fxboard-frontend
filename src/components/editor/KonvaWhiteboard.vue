<template>
  <div 
    class=""
    :class="{'createItem': isCreatingActive}"
  >
    <v-stage 
      ref="stage" 
      :config="configKonva"
      @click="handleStageMouseClick"
      @touchstart="handleStageMouseClick"
      @wheel="handleStageWheel"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @dragstart="dragStageStart"
      @dragend="handleStageDragEnd"
    >
      <!-- Фоновая сетка -->
      <v-layer>
        <v-circle
          v-for="(circle, index) in circles"
          :key="index"
          :config="circle"
        />
      </v-layer>
      
      <v-layer ref="layer">
        <!-- Остальные элементы (фигуры) добавляются поверх сетки -->
        <v-arrow
          v-for="line in connections"
          :key="line.id"
          :config="line"
          @contextmenu="openContext"
        />
        <!-- Рамки -->
        <v-group
          v-for="frame in frames"
          :key="frame.id"
          :config="frame"
          @dragstart="handleFrameDragstart"
          @dragend="handleFrameDragend"
        > 
          <v-group
            v-for="column in frame.columns"
            :config="column"
          >
            <v-rect
              :config="column.body"
            />
            <v-text
              v-if="column.text"
              :config="column.text"
            />
          </v-group>
        </v-group>
        <!-- Элементы -->
        <v-group 
          v-for="group in groups"
          :key="group.id"
          :config="group"
          @dblclick="handleGroupDblClick"
          @dragstart="handleGroupDragstart"
          @dragend="handleGroupDragend"
          @transformstart="handleGroupTransformStart"
          @transformend="handleGroupTransformEnd"
          @contextmenu="openContext"
          @dragmove="updateSelectedNodeAttributs"
          @transform="updateSelectedNodeAttributs"
        >
          <component
            v-if="group.item.shapeType !== 'card'"
            :is="getShapeComponent(group.item.shapeType)"
            :config="group.item"
          />
          <v-rect
            v-if="group.item.shapeType == 'card'"
            :config="group.item"
          />
          <v-rect
            v-if="group.item.shapeType == 'card'"
            :config="{
              x: 0,
              y: 50,
              height: 50,
              width: 200,
              fill: 'white',
              stroke: '#ddd',
              strokeWidth: 1,
              cornerRadius: [0, 0, 10, 10]
            }"
          />
          <v-text
            v-if="group.text"
            :config="group.text"
          />
          <v-circle
            v-for="connectionInput in group?.connectionInput"
            v-if="drawningLine"
            :config="connectionInput"
            @mouseover="overInputAnchor"
            @mouseout="outInputAnchor"
           />
        </v-group>
        <v-transformer
          :config="transformerConfig"
          ref="transformer" 
         />
        <ConnectionAnchor
          v-if="isNodeEditing"
          :x="selectedNodeAttributs.x"
          :y="selectedNodeAttributs.y"
          :scaleX="selectedNodeAttributs.scaleX"
          :scaleY="selectedNodeAttributs.scaleY"
          :rotation="selectedNodeAttributs.rotation"
          :nodeId="selectedNodeAttributs.nodeId"
          :nodeType="selectedNodeAttributs.nodeType"
          @connectNodes="createConnection"
        />
      </v-layer>
    </v-stage>
    <Toolbar
      @add-sticker="addSticker"
      @add-circle="addCircle"
      @add-square="addSquare"
      @add-triangle="addTriangle"
      @add-card="addCard"
      @add-frame="addFrame"
    />
    <FloatMenu 
      v-if="isNodeEditing && showFloatMenu"
      :scaleX="selectedNodeAttributs.scaleX"
      :scaleY="selectedNodeAttributs.scaleY"
      :rotation="selectedNodeAttributs.rotation"
      :absolutePos="selectedNodeAttributs.absolutePos"
      :nodeType="selectedNodeAttributs.nodeType"
      @changeStroke="changeStroke"
      @changeFill="changeFill"
    />
    <ContextMenu
      :showMenu="showContextMenu"
      :mouseX="mouseClickX"
      :mouseY="mouseClickY"
      @update:showMenu="showContextMenu = $event"
     >
     <template #menu>
      <button @click="deleteFromStage">Удалить</button>
     </template>
    </ContextMenu>
  </div>
  <ElDrawer
    v-model="showTaskMenu"
    :modal="false"
  >
    <template #header="{ titleId }">
      <h1 :id="titleId" class="font-bold text-xl">{{taskTitle}}</h1>
    </template>
    <h4 class="text-left">Статус</h4>
    <ElDivider class="my-2" />
    <div class="flex">
      <p class="text-left">Исполнитель:</p>
    </div>
    <div class="my-2 flex content-start">
      <div class="align-middle p-1">C: </div>
      <ElDatePicker
        type="datetime"
        placeholder="Начало"
      />
      <div class="align-middle p-1">До: </div>
      <ElDatePicker
        type="datetime"
        placeholder="Конец"
      />
    </div>
    <h4 class="text-left">Описание</h4>
    <ElDivider class="mt-2 mb-3" />
    <div class="h-1/4">
      <QuillEditor
        v-if="!showDescriptionEditor"
        v-model="taskDescription"
        @dblclick="editTaskDescription"
        :options="quillReaderOptions"
      />
      <QuillEditor
      v-if="showDescriptionEditor"
      v-model="taskDescription"
      toolbar="minimal"
    />
      <ElButton v-if="showDescriptionEditor" @click="saveTaskDescription" class="my-3 ms-0" color="#3b82f6">Сохранить</ElButton>
      <h4 class="text-left pt-3">Сообщения</h4>
      <ElDivider class="mt-2 mb-5" />
      <textarea
        placeholder="Ваше сообщение"
        class="w-full p-3 outline-none border-2 rounded-md"
       />
      <ElButton class="my-3 ms-0" color="#3b82f6">Отправить</ElButton>
      <div class="w-full">

      </div>
    </div>
  </ElDrawer>
</template>

<script lang="ts">
import Konva from "konva"
import Toolbar from "@/components/editor/Toolbar.vue"
import ContextMenu from "@/components/common/ContextMenu.vue"
import ConnectionAnchor from "@/components/editor/ConnectionAnchor.vue"
import FloatMenu from "@/components/editor/FloatMenu.vue"
import { KonvaEventObject } from "konva/lib/Node"
import { useBoardsStore } from "@/stores/boards"
import { ElDrawer, ElButton, ElDivider, ElDatePicker } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { makeid } from "@/js/helpers/randomGenerator"
import { ItemGroup } from "@/js/types/itemGroup"
import { Line } from "@/js/types/line"
import { FrameGroup } from "@/js/types/frameGroup"

export default {
  components: {
    Toolbar,
    ContextMenu,
    ConnectionAnchor,
    FloatMenu,
    ElDrawer,
    QuillEditor,
    ElButton,
    ElDivider,
    ElDatePicker
  },
  setup() {
    return {
      boardsStore: useBoardsStore()
    }
  },
  data() {
    return {
      configKonva: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        draggable: true
      },
      stageScale: 1, // Добавляем переменную для отслеживания масштаба
      circles: [],


      bgGridConfig: {
        radius: 1,
        fill: '#333',
        listening: false
      },
      gridSize: 20,
      gridColumns: Math.ceil(window.innerWidth / 20),
      gridRows: Math.ceil(window.innerHeight / 20),

      transformerConfig: {
        keepRatio: false,
        ignoreStroke: true,
        rotateLineVisible: false,
        padding: 5,
        rotateAnchorOffset: 35,
        anchorCornerRadius: 3
      },
      defaultParameters: {
        width: 100,
        height: 100,
        radius: 50
      },
      selectedNodeAttributs: {
        absolutePos: {x: 0, y: 0},
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        nodeId: '',
        nodeType: ''
      },

      groups: [] as ItemGroup[],
      connections: [] as Line[],
      frames: [] as FrameGroup[],

      dragItemId: null as string | null,

      currentShapeType: '', // текущий тип фигуры для добавления
      selectedGroupName: '',
      selectedShape: null as Konva.Shape | Object | null,
      selectedLine: null as Konva.Arrow | Konva.Line | Object | null,

      drawningLine: false,
      isCreatingActive: false,
      isNodeEditing: false,

      showContextMenu: false,
      showTaskMenu: false,
      showFloatMenu: false,
      showDescriptionEditor: false,

      mouseClickX: 0,
      mouseClickY: 0,

      taskTitle: '',
      taskDescription: '',

      quillReaderOptions: {
        modules: {
          toolbar: false
        },
        placeholder: 'Описание задачи...',
        readOnly: true,
        theme: 'snow'
      }
    };
  },
  props: {
    boardId: {type: String, required: true }
  },
  computed: {
  },
  methods: {
    getShapeComponent(shapeType: string) {
      switch (shapeType) {
        case 'circle':
          return 'v-circle';
        case 'square':
          return 'v-rect';
        case 'sticker':
          return 'v-rect';
        case 'triangle':
          return 'v-regular-polygon';
        default:
          return 'v-circle'; // по умолчанию, возвращаем круг
      }
    },
    getConnectionInputPosBySide(target: any, side: string, newPoints: any) {
      let node = target
      if(target.getParent() instanceof Konva.Group) (
        node = target.getParent()
      )
      const group = this.groups.find((i) => i.id === target.id());
      
      if(side === 'top'){
        newPoints.push(
          node.x(),
          node.y() - (group && group.connectionInput? group.connectionInput[0].x : target.x()) * node.scaleY()
        )
        return newPoints
      }
      if(side === 'bottom'){
        newPoints.push(
          node.x(),
          node.y() + (group && group.connectionInput? group.connectionInput[2].y/2 : target.y()/2) * node.scaleY()
        )
        return newPoints
      }
      if(side === 'right'){
        newPoints.push(
          node.x() + (group && group.connectionInput? group.connectionInput[1].x/2 : target.x()/2) * node.scaleX(),
          node.y()
        )
        return newPoints
      }
      if(side === 'left'){
        newPoints.push(
          node.x() - (group && group.connectionInput? group.connectionInput[3].y : target.y()) * node.scaleX(),
          node.y()
        )
        return newPoints
      }
    },
    createConnection(e: any, nodeId: any, side: string, offset:{x: number, y: number}) {
      this.drawningLine = true;
      this.configKonva.draggable = false;
      const newLine = {
        id: 'line-' + this.connections.length,
        stroke: 'black',
        points: [e.target.x() - offset.x, e.target.y() - offset.y],
        fromId: nodeId,
        fromSide: side,
        toSide: ""
      }
      this.connections.push(newLine);
    },
    handleMouseMove(e: any) {
      if (!this.drawningLine) {
        return;
      }
      const pos = e.target.getStage().getRelativePointerPosition()
      const lastLine = this.connections[this.connections.length - 1];
      lastLine.points = [lastLine.points[0], lastLine.points[1], pos.x, pos.y];

    },
    handleMouseUp(e: any) {
      if (!this.drawningLine) {
          return;
      }
      const idRegex = /connectionInput-/;
      if (!(idRegex.test(e.target.id()))) {
          this.connections.pop();
          this.drawningLine = false;
          return;
      }
      this.drawningLine = false;

      const idParts = e.target.id().split('-');
      const idType = idParts[1];

      const lastLine = this.connections[this.connections.length - 1];
      lastLine.toId = e.target.getParent().id();
      lastLine.toSide = idType;
      
      let newPoints = [lastLine.points[0], lastLine.points[1]];
      lastLine.points = this.getConnectionInputPosBySide(e.target, idType, newPoints)

      this.updateStageItems()
    },
    handleGroupDragstart(e: any) {
      // сохранить идентификатор перетаскиваемого элемента
      this.dragItemId = e.target.id();
      
      const name = e.target.name();

      const group = this.groups.find((i) => i.id === this.dragItemId);
      if (group) {
        const index = this.groups.indexOf(group);
        this.groups.splice(index, 1);
        this.groups.push(group);
      }
      this.showFloatMenu = false;
      if(this.selectedGroupName !== name) {
        this.selectedGroupName = name;
        this.updateTransformer();
      }
    },
    handleGroupDragend(e: any) {
      setTimeout(() => {
        this.dragItemId = null;
      }, 100);
      this.showFloatMenu = true;

      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      if(group === undefined) return;
      group.x = e.target.x();
      group.y = e.target.y();

      this.updateSelectedNodeAttributs(e);
      this.updateStageItems()
    },
    handleFrameDragstart(e: any) {
      this.dragItemId = e.target.id();
      console.log(this.dragItemId)
    },
    handleFrameDragend(e: any) {
      setTimeout(() => {
        this.dragItemId = null;
      }, 100);
    },
    handleGroupTransformStart(e: any) {
      this.showFloatMenu = false;
    },
    handleGroupTransformEnd(e: any) {
      // обновить свойства элемента после трансформации
      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      if(group === undefined) return;
      group.x = e.target.x();
      group.y = e.target.y();
      group.rotation = e.target.rotation();
      group.scaleX = e.target.scaleX();
      group.scaleY = e.target.scaleY();

      this.showFloatMenu = true;
      this.updateSelectedNodeAttributs(e);
      this.updateTransformer();
      this.updateStageItems();
    },
    handleGroupDblClick(e: any) {
      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );

      if (group?.item.shapeType === 'card' && !(e.target instanceof Konva.Text)) {
        console.log('taskmenu')
        this.openTaskMenu(group.text?.text as string)
      }

      if(!(e.target instanceof Konva.Text)) {
        return
      }

      const textNode = e.target as Konva.Text
      const areaPos = textNode.getAbsolutePosition()
      const textContainer = document.createElement('div')
      const textCell = document.createElement('div')
      textContainer.appendChild(textCell)

      document.body.appendChild(textContainer)
      this.setupTextarea(textCell, textNode, areaPos, 'top')

      textNode.hide()

      textCell.focus()

      const handleOutsideClick = (e: any) => {
        if(group?.text)
          group.text.text = textCell.innerText
        textContainer.parentNode?.removeChild(textContainer);
        textCell.removeEventListener('blur', handleOutsideClick);
        textNode.show();
        this.updateStageItems()
      };

      setTimeout(() => {
        textCell.addEventListener('blur', handleOutsideClick);
      });

    },
    handleStageMouseClick(e: any) {
      this.configKonva.draggable = true;
      this.isNodeEditing = false;
      
      // если кликнули по сцене, очистить выбор
      if (e.target === e.target.getStage()) {
        this.selectedGroupName = '';
        this.updateTransformer();
        return;
      }
      // если кликнули по трансформеру, ничего не делать
      const clickedOnTransformer =
        e.target.getParent()?.className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }
      
      const name = e.target.getParent().name();
      const group = this.groups.find((r) => r.name === name);
      if (group) {
        this.selectedGroupName = name;
      } else {
        this.selectedGroupName = '';
      }
      this.showFloatMenu = true;
      this.updateSelectedNodeAttributs(e);
      this.updateTransformer();
    },
    updateConnections(target: Konva.Group) {
      this.connections.forEach((conn) => {
        const fromGroup = this.groups.find(group => group.id === conn.fromId);
        const toGroup = this.groups.find(group => group.id === conn.toId);
        if (fromGroup && toGroup) {

          if(target.id() == fromGroup.id) {
            let newPoints  = [] as any
            newPoints = this.getConnectionInputPosBySide(target, conn.fromSide, newPoints)
            newPoints.push(conn.points[2], conn.points[3])
            conn.points = newPoints
            return
          }
          if(target.id() == toGroup.id) {
            let newPoints = [conn.points[0], conn.points[1]]
            conn.points = this.getConnectionInputPosBySide(target, conn.toSide, newPoints)
            return
          }
        }
      });
    },
    updateSelectedNodeAttributs(e: any) {
      let target = e.target
      if(e.target.getParent() instanceof Konva.Group) {
        target = e.target.getParent()
      }

      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      this.selectedNodeAttributs = {
        absolutePos: target.getAbsolutePosition(),
        x: target.x(),
        y: target.y(),
        scaleX: target.scaleX(),
        scaleY: target.scaleY(),
        rotation: target.rotation(),
        nodeId: target.id(),
        nodeType: group?.item.shapeType as string
      }

      this.updateConnections(target);

      if(group === undefined) return;
      if(!group.text) return
      group.text.scaleX = 1/Math.abs(target.scaleX())
      group.text.scaleY = 1/Math.abs(target.scaleY())
      if(group.item.shapeType !== 'card') {
        if(group.item.shapeType !== 'sticker') {
          group.text.width = this.defaultParameters.width * Math.abs(target.scaleX())
          group.text.height = this.defaultParameters.height * Math.abs(target.scaleY())
        } else {
          group.text.width = this.defaultParameters.width * 2 * Math.abs(target.scaleX())
          group.text.height = this.defaultParameters.height * 2 * Math.abs(target.scaleY())
        }
      }
      if(!group.connectionInput) return
      for (let index = 0; index < 4; index++) {
        group.connectionInput[index].scaleX = 1/Math.abs(target.scaleX())
        group.connectionInput[index].scaleY = 1/Math.abs(target.scaleY())
        
      }
    },
    updateTransformer() {
      const transformerNode = (this.$refs.transformer as any).getNode();
      const stage = transformerNode.getStage();
      const { selectedGroupName } = this;
      const selectedGroup = stage.findOne('.' + selectedGroupName);
      const group = this.groups.find(
        (r) => r.name === selectedGroupName
      );

      if (selectedGroup === transformerNode.node()) {
        return;
      }

      transformerNode.anchorStyleFunc(function(anchor: any) {
      if (anchor.hasName('rotater')) {
        anchor.fill('black');
        anchor.cornerRadius(anchor.width() / 2);
        anchor.stroke('black')
      }
      if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {

      }
      if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {

      }
      });

      if (selectedGroup) {
        transformerNode.nodes([selectedGroup]);
        this.isNodeEditing = true;
        if (group?.item.shapeType === 'card') {
          transformerNode.nodes([]);
        }
      } else {
        transformerNode.nodes([]);
        this.isNodeEditing = false;
      }
    },
    addShape(shapeType: string) {
      const stage = (this.$refs.stage as Konva.Stage).getStage();
      this.isCreatingActive = true;
      this.currentShapeType = shapeType;

      let newGroup: ItemGroup; // Определяем переменную здесь

      const clickHandler = (e: KonvaEventObject<MouseEvent>) => {
        const localId = `node-${this.groups.length}-${makeid(3)}`
        const pos = stage.getRelativePointerPosition();
        if (pos) {
          switch (shapeType) {
            case 'circle':
              newGroup = {
                x: pos.x,
                y: pos.y,
                width: this.defaultParameters.width,
                height: this.defaultParameters.height,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: localId,
                draggable: true,
                name: localId,
                item:{
                  stroke: '#212121',
                  strokeWidth: 2,
                  radius: this.defaultParameters.radius,
                  shapeType: 'circle',
                  strokeScaleEnabled: false
                },
                connectionInput: []
              };
              break;
            case 'square':
            newGroup = {
                x: pos.x,
                y: pos.y,
                width: this.defaultParameters.width,
                height: this.defaultParameters.height,
                offsetX: this.defaultParameters.width/2,
                offsetY: this.defaultParameters.height/2,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: localId,
                draggable: true,
                name: localId,
                item:{
                  width: this.defaultParameters.width,
                  height: this.defaultParameters.height,
                  stroke: '#212121',
                  strokeWidth: 2,
                  shapeType: 'square',
                  strokeScaleEnabled: false
                },
                text: {
                  text: '',
                  fontSize: 18,
                  fontFamily: 'Calibri',
                  fill: '#555',
                  width: this.defaultParameters.width,
                  height: this.defaultParameters.height,
                  padding: 20,
                  align: 'center',
                },
                connectionInput: []
              };
              break;
            case 'triangle':
            newGroup = {
                x: pos.x,
                y: pos.y,
                width: this.defaultParameters.width,
                height: this.defaultParameters.height,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: localId,
                draggable: true,
                name: localId,
                item:{
                  stroke: '#212121',
                  strokeWidth: 2,
                  sides: 3,
                  radius: this.defaultParameters.radius,
                  shapeType: 'triangle',
                  strokeScaleEnabled: false
                },
                connectionInput: []
              };
              break;
            case 'card':
            newGroup = {
                x: pos.x,
                y: pos.y,
                width: 200,
                height: 100,
                offsetX: 100,
                offsetY: 50,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: localId,
                draggable: true,
                name: localId,
                item:{
                  width: 200,
                  height: 100,
                  stroke: '#aaa',
                  fill: '#005ef5',
                  strokeWidth: 1,
                  shapeType: 'card',
                  strokeScaleEnabled: false,
                  cornerRadius: 10
                },
                text: {
                  y: 50,
                  text: 'test',
                  fontSize: 21,
                  fontFamily: 'Calibri',
                  fill: '#555',
                  width: 200,
                  height: 50,
                  padding: 20,
                  align: 'center',
                },
                connectionInput: []
              };
              break;
              case 'sticker':
              newGroup = {
                x: pos.x,
                y: pos.y,
                width: this.defaultParameters.width * 2,
                height: this.defaultParameters.height * 2,
                offsetX: this.defaultParameters.width,
                offsetY: this.defaultParameters.height,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: localId,
                draggable: true,
                name: localId,
                item:{
                  width: this.defaultParameters.width * 2,
                  height: this.defaultParameters.height * 2,
                  fill: '#cee741',
                  shapeType: 'sticker',
                  strokeScaleEnabled: false,
                  cornerRadius: 3
                },
                text: {
                  text: '',
                  fontSize: 18,
                  fontFamily: 'Calibri',
                  fill: '#555',
                  width: this.defaultParameters.width * 2,
                  height: this.defaultParameters.height * 2,
                  padding: 20,
                  align: 'center',
                },
                connectionInput: []
              };
              break;
            default:
              break;
          }

          // Определение координат точек соединения
          for (let index = 0; index < 4; index++) {
            let connectionInputId = ''
            let connectionInputX = 0
            let connectionInputY = 0

            if(shapeType === 'square' || shapeType === 'sticker') {
              connectionInputX = newGroup.width/2
              connectionInputY = newGroup.width/2
            }

            if(shapeType === 'card') {
              connectionInputX = newGroup.width/2
              connectionInputY = newGroup.width/4
            }

            switch(index) {
              case 0: // top
              connectionInputId = `connectionInput-top-${this.groups.length}`
              connectionInputY -= (newGroup.item.radius ? newGroup.item.radius : newGroup.height/2) * newGroup.scaleY
              break;
              case 1: // right
              connectionInputId = `connectionInput-right-${this.groups.length}`
              connectionInputX += (newGroup.item.radius ? newGroup.item.radius : newGroup.width/2) * newGroup.scaleX
              break;
              case 2: // bottom
              connectionInputId = `connectionInput-bottom-${this.groups.length}`
              connectionInputY += (newGroup.item.radius ? newGroup.item.radius : newGroup.height/2) * newGroup.scaleY
              break;
              case 3: // left
              connectionInputId = `connectionInput-left-${this.groups.length}`
              connectionInputX -= (newGroup.item.radius ? newGroup.item.radius : newGroup.width/2) * newGroup.scaleX
              break;
              default:
              break;
            }
            newGroup.connectionInput?.push({
              id: connectionInputId,
              x: connectionInputX,
              y: connectionInputY,
              radius: 7,
              fill: '#ddd',
              stroke: '#555',
              strokeWidth: 1,
              scaleX: 1,
              scaleY: 1,
            })       
          }

          if (newGroup) { // Проверяем, определена ли newItem
            console.log(newGroup)
            this.groups.push(newGroup);
            stage.off('click');
            stage.on('click', (e) => this.handleStageMouseClick(e));
            this.isCreatingActive = false;
            if(newGroup) this.boardsStore.addItemsToBoarrd(this.boardId, JSON.stringify(newGroup))
          }
        }
      };
      stage.on('click', clickHandler);
    },
    addFrame() {
      const stage = (this.$refs.stage as Konva.Stage).getStage();
      this.isCreatingActive = true;

      let newFrame: FrameGroup; // Определяем переменную здесь

      const clickHandler = (e: KonvaEventObject<MouseEvent>) => {
        const localId = `frame-${this.frames.length}-${makeid(3)}`
        const pos = stage.getRelativePointerPosition();

        if(pos) {
          newFrame = {
            id: localId,
            x: pos.x,
            y: pos.y,
            width: 600,
            height: 600,
            draggable: true,
            columns: [
              {
                x: 0,
                y: 0,
                width: 250,
                height: 600,
                text: {
                  text: 'C1',
                  fontSize: 21,
                  fontFamily: 'Calibri',
                  fill: '#555',
                  width: 250,
                  height: 50,
                  padding: 10,
                  align: 'center',
                },
                body: {
                  x: 0,
                  y: 0,
                  width: 250,
                  height: 600,
                  fill: 'white',
                  stroke: '#ddd',
                  strokeWidth: 1,
                  cornerRadius: 10
                }
              },
              {
                x: 255,
                y: 0,
                width: 250,
                height: 600,
                text: {
                  text: 'C2',
                  fontSize: 21,
                  fontFamily: 'Calibri',
                  fill: '#555',
                  width: 250,
                  height: 50,
                  padding: 10,
                  align: 'center',
                },
                body: {
                  x: 0,
                  y: 0,
                  width: 250,
                  height: 600,
                  fill: 'white',
                  stroke: '#ddd',
                  strokeWidth: 1,
                  cornerRadius: 10
                }
              },
            ]
          }

          if (newFrame) { // Проверяем, определена ли newItem
            console.log(newFrame)
            this.frames.push(newFrame);
            stage.off('click');
            stage.on('click', (e) => this.handleStageMouseClick(e));
            this.isCreatingActive = false;
          }
        }
      }
      stage.on('click', clickHandler);
    },
    addSticker() {
      this.addShape('sticker');
    },
    addCircle() {
      this.addShape('circle');
    },
    addSquare() {
      this.addShape('square');
    },
    addTriangle() {
      this.addShape('triangle');
    },
    addCard() {
      this.addShape('card');
    },
    overInputAnchor(e: any) {
      e.target.fill('#eee');
      e.target.stroke('#80d0ff');
    },
    outInputAnchor(e: any) {
      e.target.fill('#ddd');
      e.target.stroke('555');
    },
    handleStageWheel(e: { evt: { deltaY: number; }; }) {
      // определить направление прокрутки
      const delta = -e.evt.deltaY;
      const stage = (this.$refs.stage as Konva.Stage).getStage();

      // масштабировать сцену
      const scaleBy = 1.1;
      const oldScale = stage.scaleX();

      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) {
          return; // Если позиция не определена, прерываем выполнение функции
      }

      const mousePointTo = {
        x: pointerPosition.x / oldScale - stage.x() / oldScale,
        y: pointerPosition.y / oldScale - stage.y() / oldScale,
      };

      const newScale = delta > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      if(Math.floor(newScale * 100) <= 20 || Math.floor(newScale * 100) >= 300) {
        return
      }
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x:
          -(mousePointTo.x - pointerPosition.x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - pointerPosition.y / newScale) *
          newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
      this.groups.forEach(group => {
        group.item.strokeWidth = 2 * newScale
      });
      this.stageScale = newScale; // сохранить текущий масштаб
    },
    changeFill(color: string) {
      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      if(group === undefined) return;
      group.item.fill = color
      this.updateStageItems()
    },
    changeStroke(color: string) {
      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      if(group === undefined) return;
      group.item.stroke = color
      this.updateStageItems()
    },
    openTaskMenu(title: string) {
      this.showTaskMenu = true
      this.taskTitle = title
      console.log(this.showTaskMenu)
    },
    editTaskDescription() {
      this.showDescriptionEditor = true
    },
    saveTaskDescription() {
      this.showDescriptionEditor = false
    },
    openContext(e: any) {
      if (e.evt instanceof MouseEvent) {
        e.evt.preventDefault();
      }
      this.showContextMenu = true;

      if(e.target instanceof Konva.Arrow || e.target instanceof Konva.Line) {
        this.selectedLine = e.target
      } else {
        this.selectedLine = null;
      }

      if(e.target.getParent()){
        this.selectedShape = e.target.getParent()
      } else {
        this.selectedShape = e.target
      }
      this.mouseClickX = e.evt.clientX
      this.mouseClickY = e.evt.clientY
    },
    setupTextarea(textCell: HTMLDivElement, node: any, areaPosition: { x: number; y: number }, align: 'middle' | 'top' = 'middle') {
      textCell.innerHTML = node.text();
      if(textCell.parentElement) {
        textCell.parentElement.classList.add('absolute', 'table');
        textCell.parentElement.style.top = `${areaPosition.y + 3}px`;
        textCell.parentElement.style.left = `${areaPosition.x}px`;
        textCell.parentElement.style.width = `${node.width()}px`;
        textCell.parentElement.style.height = `${node.height()}px`;
        textCell.parentElement.style.fontSize = `${node.fontSize()}px`;
      }
      textCell.contentEditable = 'true';
      textCell.classList.add(
        'p-3',
        'table-cell',
        'w-full', 
        'h-full',
        `align-${align}`,
        'text-center',
        'truncate'
      )
      textCell.style.fontFamily = node.fontFamily();

      const rotation = node.rotation();
      let transform = rotation ? `rotateZ(${rotation}deg)` : '';
      transform += `translateY(-${2 + Math.round(node.fontSize() / 20)}px)`;
      textCell.style.transform = transform;
    },
    generateCircles() {
      const WIDTH = 25;
      const HEIGHT = 25;
      const startX = Math.floor((-this.configKonva.x - window.innerWidth) / WIDTH) * WIDTH;
      const endX = Math.floor((-this.configKonva.x + window.innerWidth * 2) / WIDTH) * WIDTH;
      const startY = Math.floor((-this.configKonva.y - window.innerHeight) / HEIGHT) * HEIGHT;
      const endY = Math.floor((-this.configKonva.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

      const newCircles = [];
      for (let x = startX; x < endX; x += WIDTH) {
        for (let y = startY; y < endY; y += HEIGHT) {
          // Удаление точек, выходящих за пределы видимой области экрана
          if (x >= -this.configKonva.x && x <= -this.configKonva.x + window.innerWidth &&
              y >= -this.configKonva.y && y <= -this.configKonva.y + window.innerHeight) {
            newCircles.push({
              x: x + WIDTH / 2,
              y: y + HEIGHT / 2,
              radius: 1, // Размер точки
              listening: false,
              perfectDrawEnabled: false,
              shadowForStrokeEnabled: false,
              hitStrokeWidth: 0,
              fill: '#555' // Цвет точки
            });
          }
        }
      }
      this.circles = newCircles as any;
    },
    deleteFromStage() {
      console.log("deletedFormStage")
      this.isNodeEditing = false;
      if(this.selectedLine) {
        this.connections = this.connections.filter(
          (connection) => connection.id !== (this.selectedLine as any).attrs.id
        );
        this.updateStageItems()
        return;
      }

      if(this.selectedShape instanceof Konva.Group) {
        const shapeId = this.selectedShape.attrs.id
        this.selectedShape.destroy();
        this.groups = this.groups.filter(
          (group) => group.id !== shapeId
        );
        this.updateTransformer();
        this.boardsStore.deleteItemFromBoard(this.boardId, shapeId)
      }
      this.updateStageItems()
    },
    dragStageStart() {
      this.showFloatMenu = false
    },
    handleStageDragEnd(e: any) {
      if(this.dragItemId) return

      this.configKonva.x = e.target.x();
      this.configKonva.y = e.target.y();
      this.generateCircles();
    },
    async updateStageItems() {
      await this.boardsStore.updateBoardItem(this.boardId, JSON.stringify(this.groups))
      //localStorage.setItem('groups', JSON.stringify(this.groups))
      //localStorage.setItem('connections', JSON.stringify(this.connections))
      //console.log(JSON.stringify(this.groups))
    },
    async loadStage() {
      const dataFromDB = await this.boardsStore.getBoardItems(this.boardId)
      this.groups = dataFromDB
    }
  },
  mounted() {
    this.generateCircles();
    //this.groups = []; // Изменить начальные значения или оставить пустым
    console.log(`Open board: ${this.boardId}`)
    this.loadStage()
  },
};

</script>

<style scoped>
.createItem {
  cursor: crosshair;
}
</style>