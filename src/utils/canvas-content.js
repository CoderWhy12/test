import { fabric } from "fabric";
import {
  polygon,
  point,
  booleanPointInPolygon,
  lineIntersect,
  lineString
} from "@turf/turf";
import { uniq, debounce } from "lodash";
const multiply = fabric.util.multiplyTransformMatrices;
const invert = fabric.util.invertTransform;
// const MAX_IMG_SCALE = Number(process.env.VUE_APP_MAX_IMG_SCALE); //最大放大倍数
const MISTAKE_NUM = Number(process.env.VUE_APP_MISTAKE_NUM); //边距容差
fabric.Object.prototype.transparentCorners = false; //控制角是否透明
class CavContent {
  constructor(
    options = {},
    canvas = {},
    layerTree = {},
    maskRect = {},
    cavGroup = [],
    readonly = false,
    pushIntoArrDebounce,
    inEdit = false,
    gen_content_url,
    $bus
  ) {
    this.$bus = $bus;
    this.Data = [];
    //图片对象
    this.imgObj = null;
    //图片容器对象
    this.imgContent = null;
    //裁剪区域
    this.clipPath = null;
    //备份属性对象
    this.backData = null;
    this.minions = [];
    this.isActive = false;
    this.canvas = canvas;
    this.payload = options;
    this.layerTree = layerTree;
    this.canvasData = {};
    this.maskRect = maskRect;
    //是否鼠标滚轮中标志
    this.mousewheeling = false;
    //是否移动标志
    this.movingFlag = false;
    //图片x坐标
    this.imgLeft = null;
    //图片y坐标
    this.imgTop = null;
    this.newImg = null;
    //是否需要存活
    this.isLive = true;
    //当前实例使用的imgSrc
    this.usedUrl = null;
    //当前实例容器的svgSrc
    this.svgSrc = null;
    //容器的toJSON形式
    this.contentJSON = null;
    //图片的toJSON形式
    this.imgJSON = null;
    //图片的缩放比例
    this.imgScale = null;
    //实例数组
    this.cavGroup = cavGroup;

    this.readonly = readonly;
    //操作记录方法
    this.pushIntoArrDebounce = pushIntoArrDebounce;
    this.imgContentLeft = null;
    //素材对象
    this.material = {};
    //是否处于编辑模式
    this.inEdit = inEdit;
    //转换路径方法
    this.gen_content_url = gen_content_url;

    this.isTop = false;

    this.activeObj = null;
    //图片容器和图片的层级
    this.contentIndex = null;
    this.imgIndex = null;
    //是否处于双击编辑模式
    this.isDblClick = false;

    this.debounceCalcMousePoint = debounce(
      (method, arg) => {
        method(arg);
      },
      50,
      {
        leading: true
      }
    );
    this.obj = null;
    this.canvas.on("mouse:down", opt => {
      this.movingFlag = true;
      this.calcMousePoint(opt);
      if (!this.canvas.getActiveObject()) {
        //没有点击容器的情况
        this.$bus.$emit("sendCanvasImgInfo", {
          content: false,
          img: false
        });
      } else {
        if (this.canvas.getActiveObject() === this.imgContent) {
          //判断有无图片
          if (this.imgObj) {
            this.$bus.$emit("sendCanvasImgInfo", {
              content: true,
              img: true
            });
          } else {
            //空容器
            this.$bus.$emit("sendCanvasImgInfo", {
              content: true,
              img: false
            });
          }
        }
      }
    });
    this.canvas.on("mouse:move", opt => {
      this.debounceCalcMousePoint(this.calcMousePoint.bind(this), opt);

      if (this.newImg) {
        if (!this.movingFlag) return;
        const newImg = this.newImg;
        let backData = null;
        const oldPointer = newImg.get("oldPointer");

        newImg.set("oldPointer", opt.pointer);
        if (!oldPointer) return;
        newImg.setCoords();
        this.imgObj.setCoords();
        // const imgPoint = newImg.calcCoords(true);
        // const oriImgPoint = this.getOri(imgPoint, newImg);
        // const newLeft = oriImgPoint.tl.x + opt.pointer.x - oldPointer.x;
        // const newTop = oriImgPoint.tl.y + opt.pointer.y - oldPointer.y;
        //
        // this.imgObj.set({
        //   left: newLeft,
        //   top: newTop
        // });
        // newImg.set({
        //   left: newLeft,
        //   top: newTop
        // });
        //
        // const newPoint = fabric.util.rotatePoint(
        //   oriImgPoint.tl,
        //   newImg.clipPath.getCenterPoint(),
        //   fabric.util.degreesToRadians(newImg.clipPath.angle)
        // );

        // this.imgObj.set({
        //   left: newImg.left + opt.pointer.x - oldPointer.x,
        //   top: newImg.top + opt.pointer.y - oldPointer.y
        // });

        newImg.set({
          left: newImg.left + opt.pointer.x - oldPointer.x,
          top: newImg.top + opt.pointer.y - oldPointer.y
        });
        this.imgObj.set({
          left: newImg.left + opt.pointer.x - oldPointer.x,
          top: newImg.top + opt.pointer.y - oldPointer.y
        });

        // this.imgObj.setCoords();

        // const { bl, br, tl, tr } = this.newImg.calcCoords(true);
        // //裁剪区域边界矩形的left值
        // const clipBoundingleft = this.newImg.clipPath.getBoundingRect().left;
        // //裁剪区域边界矩形的宽
        // const clipBoundingWidth = this.newImg.clipPath.getBoundingRect().width;
        // //裁剪区域边界矩形的top值
        // const clipBoundingTop = this.newImg.clipPath.getBoundingRect().top;
        // //裁剪区域边界矩形的高
        // const clipBoundingHeight = this.newImg.clipPath.getBoundingRect()
        //   .height;

        // const oriLeft = clipBoundingleft + clipBoundingWidth;
        // const oriTop = clipBoundingTop + clipBoundingWidth;

        // if (oriLeft > br.x) {
        //   this.newImg.set({
        //     left: -(this.newImg.getScaledWidth() - oriLeft)
        //   });
        //   this.imgObj.set({
        //     left: -(this.newImg.getScaledWidth() - oriLeft)
        //   });
        // }
        // if (clipBoundingleft < bl.x) {
        //   this.newImg.set({
        //     left: clipBoundingleft
        //   });
        //   this.imgObj.set({
        //     left: clipBoundingleft
        //   });
        // }
        // if (this.newImg.getScaledHeight() - oriTop < Math.abs(tl.y)) {
        //   this.newImg.set({
        //     top: -(this.newImg.getScaledHeight() - oriTop)
        //   });
        //   this.imgObj.set({
        //     top: -(this.newImg.getScaledHeight() - oriTop)
        //   });
        // }

        // if (clipBoundingTop < tl.y) {
        //   this.newImg.set({
        //     top: clipBoundingTop
        //   });
        //   this.imgObj.set({
        //     top: clipBoundingTop
        //   });
        // }

        newImg.setCoords();
        this.imgObj.setCoords();
        //计算是否移动超出范围
        this.controlMoving();
      }
    });
    this.canvas.on("mouse:moved", opt => {
      this.calcMousePoint(opt);
    });
    this.canvas.on("mouse:up", () => {
      this.movingFlag = false;
      if (this.newImg) {
        this.newImg.set("oldPointer", null);
      }
    });
    //鼠标滚动事件控制图片放大缩小
    this.canvas.on("mouse:wheel", opt => {
      if (this.newImg && this.imgObj) {
        if (opt && opt.e) {
          opt.e.preventDefault();
          opt.e.stopPropagation();
        }

        let oriWidth, oriHeight;
        const delta = -((opt && opt.e && opt.e.deltaY) || 100);
        let width = (oriWidth = this.newImg.getScaledWidth());
        oriHeight = this.newImg.getScaledHeight();

        const oriLeft = this.newImg.get("left");
        const oriTop = this.newImg.get("top");

        width = width + delta / 1;

        const scale = width / this.newImg.width;
        //先缩放，再检查大小和位置
        {
          // this.imgObj.scaleToWidth(width);
          // this.newImg.scaleToWidth(width);
          this.newImg.set({
            scaleX: scale,
            scaleY: scale
          });
          this.imgObj.set({
            scaleX: scale,
            scaleY: scale
          });
          this.keepPoint(
            this.newImg,
            opt,
            oriLeft,
            oriTop,
            oriWidth,
            oriHeight
          );
          this.canvas.requestRenderAll();
        }

        //返回图片旋转之前的四个点以及边框矩形的对角线点
        const getOri = obj => {
          const newObj = {};
          let xArr = [];
          let yArr = [];
          for (const key in obj) {
            const point = obj[key];
            const oriPoint = fabric.util.rotatePoint(
              point,
              this.newImg.getCenterPoint(),
              fabric.util.degreesToRadians(-this.newImg.angle)
            );
            newObj[key] = oriPoint;
            xArr.push(oriPoint.x);
            yArr.push(oriPoint.y);
          }

          xArr = xArr.sort((a, b) => a - b);
          yArr = yArr.sort((a, b) => a - b);
          newObj.bounding = {
            tl: new fabric.Point(xArr[0], yArr[0]),
            br: new fabric.Point(xArr[xArr.length - 1], yArr[yArr.length - 1])
          };
          return newObj;
        };
        this.newImg.setCoords();
        this.imgObj.setCoords();
        this.newImg.clipPath.setCoords();
        //获取图片、显示区域旋转之前的4个点
        let oriNewImgPoint = getOri(this.newImg.calcCoords(true));
        let oriClipPathPoint = getOri(this.newImg.clipPath.calcCoords(true));
        const oriNewImgWidth = oriNewImgPoint.br.x - oriNewImgPoint.tl.x;
        const oriNewImgHeight = oriNewImgPoint.br.y - oriNewImgPoint.tl.y;
        const oriClipPathWidth =
          oriClipPathPoint.bounding.br.x - oriClipPathPoint.bounding.tl.x;
        const oriClipPathHeight =
          oriClipPathPoint.bounding.br.y - oriClipPathPoint.bounding.tl.y;
        let newScale = this.newImg.scaleX;

        //判断缩放后图片宽高是否小于可视区域宽高，如果小则放大到差距较大的一侧
        if (
          oriNewImgWidth < oriClipPathWidth ||
          oriNewImgHeight < oriClipPathHeight
        ) {
          if (
            oriClipPathWidth / oriNewImgWidth >=
            oriClipPathHeight / oriNewImgHeight
          ) {
            //按照宽度缩放
            newScale = oriClipPathWidth / this.newImg.width;
          } else {
            //按照高度缩放
            newScale = oriClipPathHeight / this.newImg.height;
          }

          this.newImg.set({
            scaleX: newScale,
            scaleY: newScale
          });
          this.imgObj.set({
            scaleX: newScale,
            scaleY: newScale
          });
          //缩放后重新定位
          this.keepPoint(
            this.newImg,
            opt,
            oriLeft,
            oriTop,
            oriWidth,
            oriHeight
          );
          //重新获取定位后的四点坐标
          this.newImg.setCoords();
          this.imgObj.setCoords();
          this.newImg.clipPath.setCoords();
          oriNewImgPoint = getOri(this.newImg.calcCoords(true));
          oriClipPathPoint = getOri(this.newImg.clipPath.calcCoords(true));
        }
        const newWidth = newScale * this.newImg.width;
        const newHeight = newScale * this.newImg.height;
        //判断经过缩放和定位后的图片位置是否小于可视区域位置，如果小，则通过移动图片左上角位置修正
        if (oriNewImgPoint.tl.x > oriClipPathPoint.bounding.tl.x) {
          oriNewImgPoint.tl.x = oriClipPathPoint.bounding.tl.x;
        }
        if (oriNewImgPoint.tl.y > oriClipPathPoint.bounding.tl.y) {
          oriNewImgPoint.tl.y = oriClipPathPoint.bounding.tl.y;
        }
        //经过上面缩放和修改左上角的逻辑，图片的右下角不能直接使用oriNewImgPoint.br
        if (oriNewImgPoint.tl.x + newWidth < oriClipPathPoint.bounding.br.x) {
          oriNewImgPoint.tl.x +=
            oriClipPathPoint.bounding.br.x - (oriNewImgPoint.tl.x + newWidth);
        }
        if (oriNewImgPoint.tl.y + newHeight < oriClipPathPoint.bounding.br.y) {
          oriNewImgPoint.tl.y +=
            oriClipPathPoint.bounding.br.y - (oriNewImgPoint.tl.y + newHeight);
        }
        //把左上角再旋转回去
        const newPoint = fabric.util.rotatePoint(
          oriNewImgPoint.tl,
          this.newImg.getCenterPoint(),
          fabric.util.degreesToRadians(this.newImg.angle)
        );
        this.newImg.set({
          left: newPoint.x,
          top: newPoint.y,
          flipX: false,
          flipY: false
        });
        this.imgObj.set({
          left: newPoint.x,
          top: newPoint.y,
          flipX: false,
          flipY: false
        });
        // this.controlMoving();
        return this.canvas.requestRenderAll();
      }
    });
    this.canvas.on("object:modified", () => {
      this.saveAndPush();
    });
    this.canvas.on("object:selected", () => {
      this.activeObj = this.canvas.getActiveObject();
      if (this.imgContent === this.activeObj) {
        this.isTop = true;
      } else {
        this.isTop = false;
      }
      this.saveAndPush();
    });
  }
  //保存数据
  async getData(obj = {}) {
    const {
      content,
      img,
      contentSrc,
      imgSrc,
      material,
      isTop,
      contentIndex,
      imgIndex,
      imgScale
    } = obj;
    this.material = material;
    //分情况，是否有图片对象
    if (!img || !imgSrc) {
      await this.getContentFromSvg(contentSrc, content);
      if (this.imgContent && this.imgContent.evented) {
        this.imgContent.on("drop", async ev => {
          this.contentDropEvent(this.imgContent, ev);
        });
        this.imgContent.moveTo(contentIndex);
        this.setOwnIndex(this.imgContent, this.getZindex(this.imgContent));
        this.canvas.renderAll();
      }
      this.canvas.on("mouse:move", e => {
        if (this.isActive) {
          this.updateClipPath(e);
        }
      });
    } else {
      await this.getContentFromSvg(contentSrc, content);
      await this.getImgFromUrl(imgSrc, img, contentIndex, imgIndex, imgScale);
      // this.canvas.sendToBack(this.imgObj);

      this.imgContent.set({
        strokeWidth: 0,
        stroke: "transparent"
      });

      // const objects = this.canvas.getObjects();
      // objects.forEach(item => {
      //   if (item.name === "imgContent") {
      //     item.bringToFront();
      //   }
      // });
      this.canvas.renderAll();
      // this.contentListenEvent(this.imgContent);
      // this.canvas.on("mouse:move", e => {
      //   if (this.isActive) {
      //     this.updateClipPath(e);
      //   }
      // });
    }

    const objects = this.canvas.getObjects();
    if (this.readonly) {
      objects.forEach(item => {
        item.set({
          selectable: false,
          hasControls: false,
          hoverCursor: "default",
          evented: false
        });
        this.canvas.renderAll();
      });
    } else {
      objects.forEach(item => {
        item.set({
          evented: true
        });
        if (item.name === "imgContent") {
          item.set({
            selectable: true,
            hasControls: true,
            hoverCursor: "move"
          });
        }
        this.canvas.renderAll();
        this.$bus.$emit("sendCanvasImgInfo", {
          content: false,
          img: false
        });
      });
    }
  }

  async getContentFromSvg(url, option) {
    if (!url) {
      return;
    }
    await new Promise(resolve => {
      fabric.loadSVGFromURL(url, (objects, options) => {
        const svg = fabric.util.groupSVGElements(objects, options);

        const realWidth = svg.getScaledWidth();
        const realHeight = svg.getScaledHeight();
        svg.scaleToWidth(realWidth);
        svg.scaleToHeight(realHeight);
        svg.setOptions(option);
        svg.set({
          strokeWidth: 1,
          stroke: "black"
        });
        this.imgContent = svg;
        this.setOwnName(this.imgContent, "imgContent");
        this.setOwnPath(this.imgContent, url);
        this.updateBackData();
        this.canvas.add(this.imgContent);
        this.svgSrc = url;
        this.canvas.renderAll();
        resolve(svg);
      });
    });
  }

  async getImgFromUrl(url, option, contentIndex, imgIndex, imgScale) {
    await new Promise(resolve => {
      fabric.Image.fromURL(
        url,
        async img => {
          const clipPath = await new Promise(resolve => {
            this.imgContent.clone(resolve);
          });
          this.clipPath = clipPath;
          this.clipPath.absolutePositioned = true;

          // this.scaleCurrentImg(img);
          img.setOptions(option);
          img.set({
            hasControls: false,
            selectable: false,
            scaleX: imgScale,
            scaleY: imgScale
          });
          img.clipPath = this.clipPath;
          this.imgObj = img;
          this.setOwnName(this.imgObj, "imgObj");
          this.minions = [this.imgObj];

          this.canvas.add(this.imgObj);
          this.canvas.renderAll();
          //绑定矩阵关系
          this.bind();

          //需要绑定监听事件
          this.contentListenEvent(this.imgContent);
          this.canvas.on("mouse:move", e => {
            if (this.isActive) {
              this.updateClipPath(e);
            }
          });
          this.usedUrl = url;
          this.imgObj.moveTo(imgIndex);
          this.imgContent.moveTo(contentIndex);
          this.setOwnIndex(this.imgContent, this.getZindex(this.imgContent));
          this.setOwnIndex(this.imgObj, this.getZindex(this.imgObj));

          this.canvas.renderAll();
          resolve(img);
        },
        {
          crossOrigin: true
        }
      );
    });
  }
  getZindex(obj) {
    return this.canvas.getObjects().indexOf(obj);
  }
  saveAndPush() {
    if (!this.newImg) {
      this.saveData();
      if (this.pushIntoArrDebounce && !this.readonly) {
        this.pushIntoArrDebounce("canvas");
      }
    }
  }
  saveData() {
    if (
      this.imgContent ===
      this.canvas.getObjects()[this.canvas.getObjects().length - 1]
    ) {
      this.isTop = true;
    } else {
      this.isTop = false;
    }
    if (this.imgContent) {
      if (this.imgObj) {
        this.contentJSON = this.imgContent.toJSON();
        this.imgJSON = this.imgObj.toJSON();
        this.contentIndex = this.getZindex(this.imgContent);
        this.imgIndex = this.getZindex(this.imgObj);
        this.imgScale = this.imgObj.scaleX;
        this.setOwnIndex(this.imgContent, this.contentIndex);
        this.setOwnIndex(this.imgObj, this.imgIndex);
      } else {
        this.contentJSON = this.imgContent.toJSON();
        this.imgJSON = null;
        this.contentIndex = this.getZindex(this.imgContent);
        this.imgIndex = null;
        this.imgScale = null;
        this.setOwnIndex(this.imgContent, this.contentIndex);
      }
    } else {
      this.contentJSON = null;
      this.imgJSON = null;
      this.contentIndex = null;
      this.imgIndex = null;
      this.imgScale = null;
    }
    //该实例下需要保存的数据
    this.canvasData = {
      content: this.contentJSON,
      img: this.imgJSON,
      contentSrc: this.contentJSON?.uri ? this.contentJSON.uri : this.svgSrc,
      imgSrc: this.imgJSON ? this.imgJSON.src : null,
      material: this.material,
      isTop: this.isTop,
      contentIndex: this.contentIndex,
      imgIndex: this.imgIndex,
      imgScale: this.imgScale
    };
    //获取到layerTree存放canvas实例数据的数组
    this.layerTree.data.canvasDataGroup = [];
    //将当前画布上存在的实例对象的数据存放到数组中
    this.cavGroup.forEach(item => {
      this.layerTree.data.canvasDataGroup.push(item.canvasData);
    });
  }
  realSetData() {
    this.layerTree.canvasData.push(this.canvasData);
    this.layerTree.canvasData = uniq(this.layerTree.canvasData);
    // this.layerTree.canvasData = JSON.parse(this.layerTree.canvasData);
  }
  //自定义属性name
  setOwnName(obj, name) {
    obj.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          name: this.name
        });
      };
    })(obj.toObject);
    obj.name = name;
  }
  setOwnPath(obj, uri) {
    obj.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          uri: this.uri
        });
      };
    })(obj.toObject);
    obj.uri = uri;
  }
  setOwnIndex(obj, index) {
    obj.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          index: this.index
        });
      };
    })(obj.toObject);
    obj.index = index;
  }
  //创建图片容器
  async createContent() {
    //如果是矩形
    const payload = this.payload;
    if (payload.type === "rec") {
      this.imgContent = new fabric.Rect({
        lockScalingFlip: true,
        minScaleLimit: 0.1,
        width: payload.width,
        height: payload.height,
        fill: "transparent",
        top: payload.top,
        left: payload.left,
        strokeWidth: 1,
        stroke: "black"
      });
      //如果是圆形
    } else if (payload.type === "cir") {
      this.imgContent = new fabric.Circle({
        lockScalingFlip: true,
        minScaleLimit: 0.1,
        radius: 50,
        fill: "transparent",
        top: payload.top,
        left: payload.left,
        strokeWidth: 1,
        stroke: "red"
      });
      //如果是其他形状
    } else {
      await new Promise(resolve => {
        fabric.loadSVGFromURL(payload.url, (objects, options) => {
          const svg = fabric.util.groupSVGElements(objects, options);
          //获取真实宽高
          const realWidth = svg.getScaledWidth();
          const realHeight = svg.getScaledHeight();
          svg.scaleToWidth(realWidth);
          svg.scaleToHeight(realHeight);
          svg.set({
            fill: "transparent",
            lockScalingFlip: true,
            minScaleLimit: 0.1,
            top: payload.top,
            left: payload.left,
            strokeWidth: 1,
            stroke: "black"
          });
          this.imgContentLeft = payload.left;
          this.imgContent = svg;
          this.svgSrc = payload.url;
          this.canvas.renderAll();
          resolve(svg);
        });
      });
    }

    this.setOwnName(this.imgContent, "imgContent");
    this.setOwnPath(this.imgContent, payload.url);
    this.setOwnIndex(this.imgContent, this.getZindex(this.imgContent));
    this.updateBackData();

    //将图片容器添加到canvas上
    this.canvas.add(this.imgContent);
    this.saveData();
    if (this.pushIntoArrDebounce && !this.readonly) {
      this.pushIntoArrDebounce("canvas");
    }
    this.canvas.renderAll();
    this.canvas.on("mouse:move", e => {
      if (this.isActive) {
        this.updateClipPath(e);
      }
    });
  }
  //创建图片
  createImg(options) {
    return new Promise((resolve, reject) => {
      try {
        fabric.Image.fromURL(
          options.url,
          async img => {
            const clipPath = await new Promise(resolve => {
              this.imgContent.clone(resolve);
            });
            this.clipPath = clipPath;
            this.clipPath.absolutePositioned = true;

            const contentAngle = this.imgContent.angle;
            img.set({
              angle: contentAngle
            });
            this.scaleCurrentImg(img);
            img.set({
              hasControls: false,
              selectable: false
            });
            img.setPositionByOrigin(
              this.imgContent.getCenterPoint(),
              "center",
              "center"
            );

            img.clipPath = this.clipPath;
            this.imgObj = img;
            this.setOwnName(this.imgObj, "imgObj");
            this.setOwnIndex(this.imgObj, this.getZindex(this.imgObj));
            this.minions = [this.imgObj];
            //绑定矩阵关系
            this.bind();
            //更新当前使用过的图片url，并且push到formObj使用的数组里
            this.usedUrl = options.url;
            this.layerTree.formObj.usedImgAry.push(options.url);
            resolve(img);
          },
          {
            crossOrigin: true
          }
        );
      } catch (e) {
        reject(e);
      } finally {
        this.canvas.renderAll();
      }
    });
  }

  //建立矩阵关系
  bind() {
    const bossTransform = this.imgContent.calcTransformMatrix();
    const invertedBossTransform = invert(bossTransform);
    const minions = [this.imgObj];
    minions.forEach(o => {
      const desiredTransform = multiply(
        invertedBossTransform,
        o.calcTransformMatrix()
      );
      o.relationship = desiredTransform;
    });
    this.canvas.renderAll();
  }

  //数据备份
  updateBackData() {
    const { scaleX, scaleY, top, left, width, height, angle } = this.imgContent;
    this.backData = {
      scaleX,
      scaleY,
      top,
      left,
      width,
      height,
      angle
    };
  }

  limitMethod() {
    const rectPoint = this.imgContent.calcCoords(true);
    const imgPoint = this.imgObj.calcCoords(true);
    const getOri = obj => {
      const newObj = {};
      for (const key in obj) {
        const point = obj[key];
        const oriPoint = fabric.util.rotatePoint(
          point,
          this.imgContent.getCenterPoint(),
          fabric.util.degreesToRadians(-this.imgContent.angle)
        );
        newObj[key] = oriPoint;
      }
      return newObj;
    };
    const oriRectPoint = getOri(rectPoint);
    const oriImgPoint = getOri(imgPoint);
    if (oriRectPoint.tl.x < oriImgPoint.tl.x) {
      oriRectPoint.tl.x = oriImgPoint.tl.x;
    }
    if (oriRectPoint.tl.y < oriImgPoint.tl.y) {
      // console.log(oriRectPoint.tl.y, oriImgPoint.tl.y);
      oriRectPoint.tl.y = oriImgPoint.tl.y;
    }
    if (oriRectPoint.br.x > oriImgPoint.br.x) {
      oriRectPoint.br.x = oriImgPoint.br.x;
    }
    if (oriRectPoint.br.y > oriImgPoint.br.y) {
      oriRectPoint.br.y = oriImgPoint.br.y;
    }

    const newHeight = oriRectPoint.br.y - oriRectPoint.tl.y;
    const newWidth = oriRectPoint.br.x - oriRectPoint.tl.x;

    const newPoint = fabric.util.rotatePoint(
      oriRectPoint.tl,
      this.imgContent.getCenterPoint(),
      fabric.util.degreesToRadians(this.imgContent.angle)
    );
    this.imgContent.set({
      left: newPoint.x,
      top: newPoint.y,
      scaleX: newWidth / this.imgContent.width,
      scaleY: newHeight / this.imgContent.height
    });
  }

  //重新计算裁剪区域
  updateClipPath(e) {
    const {
      transform: { action }
    } = e;
    const updateMinions = () => {
      this.minions.forEach(o => {
        if (!o.relationship) {
          return;
        }
        const relationship = o.relationship;
        const newTransform = multiply(
          this.imgContent.calcTransformMatrix(),
          relationship
        );
        const opt = fabric.util.qrDecompose(newTransform);
        o.set({
          flipX: false,
          flipY: false
        });
        o.setPositionByOrigin(
          { x: opt.translateX, y: opt.translateY },
          "center",
          "center"
        );
        o.set(opt);
        o.setCoords();
      });
    };
    if (action && action.includes("scale")) {
      this.imgContent.setCoords();
      this.imgObj.setCoords();
      const { tl, br } = this.imgContent.calcCoords(true);
      const imgCoords = this.imgObj.getCoords().map(item => {
        return Object.values(item);
      });
      imgCoords.push(imgCoords[0]);
      const imgPolygon = polygon([imgCoords]);
      const tlPoint = point(Object.values(tl));
      const brPoint = point(Object.values(br));

      const limit = !(
        booleanPointInPolygon(tlPoint, imgPolygon) &&
        booleanPointInPolygon(brPoint, imgPolygon)
      );
      if (limit) {
        const rectPoint = this.imgContent.calcCoords(true);
        const imgPoint = this.imgObj.calcCoords(true);
        const getOri = obj => {
          const newObj = {};
          for (const key in obj) {
            const point = obj[key];
            const oriPoint = fabric.util.rotatePoint(
              point,
              this.imgContent.getCenterPoint(),
              fabric.util.degreesToRadians(-this.imgContent.angle)
            );
            newObj[key] = oriPoint;
          }
          return newObj;
        };
        const oriRectPoint = getOri(rectPoint);
        const oriImgPoint = getOri(imgPoint);
        if (oriRectPoint.tl.x < oriImgPoint.tl.x) {
          oriRectPoint.tl.x = oriImgPoint.tl.x;
        }
        if (oriRectPoint.tl.y < oriImgPoint.tl.y) {
          // console.log(oriRectPoint.tl.y, oriImgPoint.tl.y);
          oriRectPoint.tl.y = oriImgPoint.tl.y;
        }
        if (oriRectPoint.br.x > oriImgPoint.br.x) {
          oriRectPoint.br.x = oriImgPoint.br.x;
        }
        if (oriRectPoint.br.y > oriImgPoint.br.y) {
          oriRectPoint.br.y = oriImgPoint.br.y;
        }

        const newHeight = oriRectPoint.br.y - oriRectPoint.tl.y;
        const newWidth = oriRectPoint.br.x - oriRectPoint.tl.x;

        const newPoint = fabric.util.rotatePoint(
          oriRectPoint.tl,
          this.imgContent.getCenterPoint(),
          fabric.util.degreesToRadians(this.imgContent.angle)
        );
        this.imgContent.set({
          left: newPoint.x,
          top: newPoint.y,
          scaleX: newWidth / this.imgContent.width,
          scaleY: newHeight / this.imgContent.height
        });

        this.updateBackData();
        this.clipPath.set(this.backData);
      } else {
        this.updateBackData();
        this.clipPath.set(this.backData);
      }
      this.bind();
    } else {
      this.updateBackData();
      this.clipPath.set(this.backData);
      updateMinions();
    }
  }

  scaleUpdateClipPath(e) {
    const {
      transform: { action, corner }
    } = e;
    // const point = new fabric.Circle({
    //   radius: 1,
    //   top: this.imgContent.top,
    //   left: this.imgContent.left,
    //   fill: "black"
    // });

    // this.canvas.add(point);
    // this.imgContentLeft = this.imgContent.left;
    const updateMinions = () => {
      this.minions.forEach(o => {
        if (!o.relationship) {
          return;
        }
        const relationship = o.relationship;
        const newTransform = multiply(
          this.imgContent.calcTransformMatrix(),
          relationship
        );
        const opt = fabric.util.qrDecompose(newTransform);
        o.set({
          flipX: false,
          flipY: false
        });
        o.setPositionByOrigin(
          { x: opt.translateX, y: opt.translateY },
          "center",
          "center"
        );
        o.set(opt);
        o.setCoords();
      });
    };
    if (action && action.includes("scale")) {
      this.imgContent.setCoords();
      this.imgObj.setCoords();
      // const { tl, br } = this.imgContent.calcCoords(true);
      // const imgCoords = this.imgObj.getCoords().map(item => {
      //   return Object.values(item);
      // });
      // imgCoords.push(imgCoords[0]);
      // const imgPolygon = polygon([imgCoords]);
      // const tlPoint = point(Object.values(tl));
      // const brPoint = point(Object.values(br));

      // const limit = !(
      //   booleanPointInPolygon(tlPoint, imgPolygon) &&
      //   booleanPointInPolygon(brPoint, imgPolygon)
      // );
      const rectPoint = this.imgContent.calcCoords(true);
      const imgPoint = this.imgObj.calcCoords(true);
      const getOri = obj => {
        const newObj = {};
        let xArr = [];
        let yArr = [];
        // console.log(-this.imgContent.angle);
        for (const key in obj) {
          const point = obj[key];
          const oriPoint = fabric.util.rotatePoint(
            point,
            this.imgContent.getCenterPoint(),
            fabric.util.degreesToRadians(-this.imgContent.angle)
          );

          // console.log(oriPoint);
          newObj[key] = oriPoint;
          xArr.push(oriPoint.x);
          yArr.push(oriPoint.y);
        }
        xArr = xArr.sort((a, b) => a - b);
        yArr = yArr.sort((a, b) => a - b);
        newObj.bounding = {
          tl: new fabric.Point(xArr[0], yArr[0]),
          br: new fabric.Point(xArr[xArr.length - 1], yArr[yArr.length - 1])
        };
        return newObj;
      };
      this.imgContent.setCoords();
      this.imgObj.setCoords();
      // this.newImg.clipPath.setCoords();

      const oriRectPoint = getOri(rectPoint, this.imgContent);
      const oriImgPoint = getOri(imgPoint, this.imgObj);

      // console.log(oriRectPoint, oriImgPoint);
      let newScale = this.imgObj.scaleX;

      let contentScale = this.imgObj.scaleX;

      // console.log(contentScale);

      const newWidth = newScale * this.imgObj.width;
      const newHeight = newScale * this.imgObj.height;

      //判断矩形的四个点是否在图片内
      const { tl, br, tr, bl } = this.imgContent.calcCoords(true);
      const imgCoords = this.imgObj.getCoords().map(item => {
        return Object.values(item);
      });
      imgCoords.push(imgCoords[0]);
      const imgPolygon = polygon([imgCoords]);
      const tlPoint = point(Object.values(tl));
      const brPoint = point(Object.values(br));
      const trPoint = point(Object.values(tr));
      const blPoint = point(Object.values(bl));

      const limit = !(
        booleanPointInPolygon(tlPoint, imgPolygon) &&
        booleanPointInPolygon(trPoint, imgPolygon) &&
        booleanPointInPolygon(blPoint, imgPolygon) &&
        booleanPointInPolygon(brPoint, imgPolygon)
      );
      if (limit) {
        //中上
        if (corner === "mt") {
          // console.log("中上超出");
          this.mtControl(oriImgPoint, oriRectPoint);
        }
        //中下
        else if (corner === "mb") {
          // console.log("中下超出");
          this.mbControl(oriImgPoint, oriRectPoint);
        }
        //中左
        else if (corner === "ml") {
          // console.log("中左超出");
          this.mlControl(oriImgPoint, oriRectPoint);
        }
        //中右
        else if (corner === "mr") {
          this.mrControl(oriImgPoint, oriRectPoint);
        } else if (corner === "tl") {
          this.mtControl(oriImgPoint, oriRectPoint);
          this.mlControl(oriImgPoint, oriRectPoint);

          // console.log("左上角超出");
        } else if (corner === "tr") {
          this.mtControl(oriImgPoint, oriRectPoint);
          this.mrControl(oriImgPoint, oriRectPoint);

          // console.log("右上角超出");
        } else if (corner === "br") {
          this.mrControl(oriImgPoint, oriRectPoint);
          this.mbControl(oriImgPoint, oriRectPoint);

          // console.log("右下角超出");
        } else if (corner === "bl") {
          this.mlControl(oriImgPoint, oriRectPoint);
          this.mbControl(oriImgPoint, oriRectPoint);
        }

        let newHeight = oriRectPoint.br.y - oriRectPoint.tl.y;
        let newWidth = oriRectPoint.br.x - oriRectPoint.tl.x;
        const newPoint = fabric.util.rotatePoint(
          oriRectPoint.tl,
          this.imgContent.getCenterPoint(),
          fabric.util.degreesToRadians(this.imgContent.angle)
        );

        this.imgContent.set({
          left: newPoint.x,
          top: newPoint.y,
          scaleX: newWidth / this.imgContent.width,
          scaleY: newHeight / this.imgContent.height
        });

        // console.log(this.imgContent);
        this.updateBackData();
        this.clipPath.set(this.backData);
      } else {
        this.updateBackData();
        this.clipPath.set(this.backData);
      }
      this.bind();
    } else {
      this.updateBackData();
      this.clipPath.set(this.backData);
      updateMinions();
    }
    this.canvas.requestRenderAll();
  }

  //控制图片双击后的各种效果、
  async addGaryScale() {
    this.isDblClick = true;
    const newImg = await new Promise(resolve => {
      this.imgObj.clone(newImg => {
        newImg.hasControls = false;
        let backData = null;
        newImg.set({
          scaleX: this.imgObj.scaleX,
          scaleY: this.imgObj.scaleY
        });
        this.newImg = newImg;
        this.newImg.on("moving", () => {
          this.controlMoving(backData);
        });
        this.newImg.on("mousedblclick", () => {
          this.isDblClick = false;
          this.clipPath = this.newImg.clipPath;
          this.imgObj.clipPath = this.clipPath;
          this.canvas.remove(this.newImg);
          const newScale = this.newImg.scaleX;
          this.newImg = null;
          this.imgObj.set({
            hoverCursor: "default",
            hasControls: false,
            selectable: false,
            scaleX: newScale,
            scaleY: newScale
          });
          this.imgObj.filters[0] = null;
          this.imgObj.applyFilters();
          this.imgContent.visible = true;
          this.canvas.discardActiveObject();
          this.canvas.setActiveObject(this.imgContent);
          this.canvas.clipPath = null;
          this.maskRect.visible = false;
          this.canvas.sendToBack(this.maskRect);
          const objects = this.canvas.getObjects();
          objects.forEach(item => {
            this.canvas.bringToFront(item);
            if (item.name === "imgContent") {
              item.set({
                selectable: true,
                evented: true
              });
            }
          });
          this.canvas.renderAll();
          this.bind();
          this.saveAndPush();
        });
        resolve(newImg);
      });
    });
    this.imgObj.clipPath = null;
    this.canvas.add(this.newImg);
    this.imgObj.set({
      hoverCursor: "move",
      hasControls: false,
      selectable: false
    });
    this.imgObj.filters[0] = new fabric.Image.filters.Grayscale();
    this.imgObj.applyFilters();
    this.imgContent.visible = false;
    this.canvas.discardActiveObject();
    this.canvas.setActiveObject(newImg);

    const objects = this.canvas.getObjects();
    objects.forEach(item => {
      if (item.name === "imgContent") {
        item.set({
          evented: false,
          selectable: false
        });
      }
    });
    this.imgContent.set({
      evented: true,
      selectable: true
    });
    this.maskRect.visible = true;

    this.canvas.bringToFront(this.maskRect);
    // this.canvas.bringToFront(this.imgObj);
    this.canvas.bringToFront(this.imgContent);
    this.canvas.bringToFront(newImg);
    this.canvas.renderAll();
  }

  calcMousePoint(opt) {
    const { x, y } = opt.pointer;
    const point = new fabric.Point(x, y);

    // if (this.imgContent.containsPoint(point)) {
    //   this.imgContent.bringToFront();
    // } else {
    //   this.imgContent.moveTo(this.imgContent.index);
    // }
    const objects = this.canvas.getObjects();
    const ary = objects.filter(item => {
      if (item.name === "imgContent") {
        if (item.containsPoint(point)) {
          this.canvas.bringToFront(item);
          // this.canvas.setActiveObject(item);
          return item;
        } else {
          item.moveTo(item.index);
        }
      }
    });
    //如果鼠标点同时落在多个容器上 则取当前层级最高的置顶
    if (ary.length > 1) {
      const indexAry = [];
      ary.forEach(item => {
        indexAry.push(item.index);
        item.moveTo(item.index);
      });
      const maxIndex = Math.max.apply(null, indexAry);
      const topObj = objects.find(item => item.index === maxIndex);
      topObj.bringToFront();
      // this.canvas.setActiveObject(topObj);
    }

    this.canvas.renderAll();
  }
  //重新定位角落
  refreshCorner(imgObj, newImg, canvas) {
    //重新定位角落
    imgObj.setCoords();
    newImg.setCoords();
    let left = imgObj.get("left"),
      top = imgObj.get("top");
    if (imgObj.aCoords.br.x + MISTAKE_NUM < newImg.aCoords.br.x) {
      left = imgObj.get("left") + newImg.aCoords.br.x - imgObj.aCoords.br.x;
    } else if (imgObj.aCoords.tl.x > newImg.aCoords.tl.x + MISTAKE_NUM) {
      left = imgObj.get("left") + newImg.aCoords.tl.x - imgObj.aCoords.tl.x;
    }
    if (imgObj.aCoords.br.y + MISTAKE_NUM < newImg.aCoords.br.y) {
      top = imgObj.get("top") + newImg.aCoords.br.y - imgObj.aCoords.br.y;
    } else if (imgObj.aCoords.tl.y > newImg.aCoords.tl.y + MISTAKE_NUM) {
      top = imgObj.get("top") + newImg.aCoords.tl.y - imgObj.aCoords.tl.y;
    }
    imgObj.set({
      left: left,
      top: top
    });
    // this.imgObj.set({
    //   left: left,
    //   top: top
    // });
    imgObj.setCoords();
    newImg.setCoords();
    canvas.renderAll();
  }

  keepPoint(imgObj, opt, oriLeft, oriTop, oriWidth, oriHeight) {
    if (!opt || !opt.pointer) return;
    imgObj.setCoords();
    this.imgObj.setCoords();
    let xRatio, yRatio;
    xRatio = (opt.pointer.x - oriLeft) / oriWidth;
    yRatio = (opt.pointer.y - oriTop) / oriHeight;
    // const newTop = imgObj.get("top");
    // const newLeft = imgObj.get("left");
    const newTop = oriTop;
    const newLeft = oriLeft;
    const newWidth = imgObj.getScaledWidth();
    const newHeight = imgObj.getScaledHeight();
    const newx = newWidth * xRatio + newLeft;
    const newy = newHeight * yRatio + newTop;
    imgObj.set({
      top: newTop - (newy - opt.pointer.y),
      left: newLeft - (newx - opt.pointer.x)
    });
    imgObj.setCoords();
    this.imgObj.setCoords();
  }

  refreshPosition() {
    this.imgTop = this.imgObj.get("top");
    this.imgLeft = this.imgObj.get("left");
  }
  controlMovingWithSameAngle() {
    let backData;
    const newImg = this.newImg;
    const { top, left } = newImg;
    this.imgObj.setCoords();
    newImg.clipPath.setCoords();
    newImg.setCoords();
    const { tl, br } = newImg.clipPath.calcCoords(true);
    const imgCoords = newImg.getCoords().map(item => {
      return Object.values(item);
    });
    const tlPoint = point(Object.values(tl));
    const brPoint = point(Object.values(br));
    imgCoords.push(imgCoords[0]);
    const imgPolygon = polygon([imgCoords]);
    const limit =
      !booleanPointInPolygon(tlPoint, imgPolygon) ||
      !booleanPointInPolygon(brPoint, imgPolygon);
    if (limit) {
      const rectPoint = newImg.clipPath.calcCoords(true);
      const imgPoint = newImg.calcCoords(true);
      const getOri = obj => {
        const newObj = {};
        let xArr = [];
        let yArr = [];
        for (const key in obj) {
          const point = obj[key];
          const oriPoint = fabric.util.rotatePoint(
            point,
            newImg.clipPath.getCenterPoint(),
            fabric.util.degreesToRadians(-newImg.clipPath.angle)
          );
          newObj[key] = oriPoint;
          xArr.push(oriPoint.x);
          yArr.push(oriPoint.y);
        }
        xArr = xArr.sort((a, b) => a - b);
        yArr = yArr.sort((a, b) => a - b);
        newObj.bounding = {
          tl: new fabric.Point(xArr[0], yArr[0]),
          br: new fabric.Point(xArr[xArr.length - 1], yArr[yArr.length - 1])
        };
        return newObj;
      };
      const oriRectPoint = getOri(rectPoint);
      const oriImgPoint = getOri(imgPoint);
      if (oriRectPoint.bounding.tl.x < oriImgPoint.tl.x) {
        const diff = oriImgPoint.tl.x - oriRectPoint.bounding.tl.x;
        oriImgPoint.tl.x -= diff;
        oriImgPoint.br.x -= diff;
      }
      if (oriRectPoint.bounding.tl.y < oriImgPoint.tl.y) {
        const diff = oriImgPoint.tl.y - oriRectPoint.bounding.tl.y;
        oriImgPoint.tl.y -= diff;
        oriImgPoint.br.y -= diff;
      }
      if (oriRectPoint.bounding.br.x > oriImgPoint.br.x) {
        const diff = oriRectPoint.bounding.br.x - oriImgPoint.br.x;
        oriImgPoint.tl.x += diff;
        oriImgPoint.br.x += diff;
      }
      if (oriRectPoint.bounding.br.y > oriImgPoint.br.y) {
        const diff = oriRectPoint.bounding.br.y - oriImgPoint.br.y;
        oriImgPoint.tl.y += diff;
        oriImgPoint.br.y += diff;
      }

      const newPoint = fabric.util.rotatePoint(
        oriImgPoint.tl,
        newImg.clipPath.getCenterPoint(),
        fabric.util.degreesToRadians(newImg.clipPath.angle)
      );
      newImg.set({
        left: newPoint.x,
        top: newPoint.y
      });
      backData = {
        top: newPoint.y,
        left: newPoint.x
      };
    } else {
      backData = { top, left };
    }
    this.imgObj.set(backData);
    this.canvas.requestRenderAll();
  }
  //鼠标移动控制区域
  controlMoving() {
    let backData;
    const newImg = this.newImg;
    const { top, left } = newImg;
    this.imgObj.setCoords();
    newImg.clipPath.setCoords();
    newImg.setCoords();

    const rectPoint = newImg.clipPath.calcCoords(true);
    const imgPoint = newImg.calcCoords(true);
    const getOri = obj => {
      const newObj = {};
      let xArr = [];
      let yArr = [];
      for (const key in obj) {
        const point = obj[key];
        const oriPoint = fabric.util.rotatePoint(
          point,
          newImg.getCenterPoint(),
          fabric.util.degreesToRadians(-newImg.angle)
        );
        newObj[key] = oriPoint;
        xArr.push(oriPoint.x);
        yArr.push(oriPoint.y);
      }
      xArr = xArr.sort((a, b) => a - b);
      yArr = yArr.sort((a, b) => a - b);
      newObj.bounding = {
        tl: new fabric.Point(xArr[0], yArr[0]),
        br: new fabric.Point(xArr[xArr.length - 1], yArr[yArr.length - 1])
      };
      return newObj;
    };
    this.newImg.setCoords();
    this.imgObj.setCoords();
    this.newImg.clipPath.setCoords();

    const oriRectPoint = getOri(rectPoint);
    const oriImgPoint = getOri(imgPoint);
    let newScale = this.newImg.scaleX;

    // const { tl, br } = newImg.clipPath.calcCoords(true);
    // const imgCoords = newImg.getCoords().map(item => {
    //   return Object.values(item);
    // });
    // const tlPoint = point(Object.values(tl));
    // const brPoint = point(Object.values(br));
    // imgCoords.push(imgCoords[0]);
    // const imgPolygon = polygon([imgCoords]);

    //需要考虑旋转后图片的情况，所以始终拿边界矩形做对比即可
    // let xArr = [];
    // let yArr = [];
    // const { bl, br, tl, tr } = this.newImg.calcCoords(true);
    // xArr.push(bl.x);
    // xArr.push(br.x);
    // xArr.push(tl.x);
    // xArr.push(tr.x);
    // yArr.push(bl.y);
    // yArr.push(br.y);
    // yArr.push(tl.y);
    // yArr.push(tr.y);
    // xArr = xArr.sort((a, b) => a - b);
    // yArr = yArr.sort((a, b) => a - b);
    // //找到四条边的临界值
    // const maxX = xArr[xArr.length - 1]; //右
    // const minX = xArr[0]; //左
    // const maxY = yArr[yArr.length - 1]; //下
    // const minY = yArr[0]; //上
    // const imgBoundingHeight = this.newImg.getBoundingRect().height;
    // //裁剪区域边界矩形的left值
    // const clipBoundingleft = this.newImg.clipPath.getBoundingRect().left;
    // //裁剪区域边界矩形的宽
    // const clipBoundingWidth = this.newImg.clipPath.getBoundingRect().width;
    // //裁剪区域边界矩形的top值
    // const clipBoundingTop = this.newImg.clipPath.getBoundingRect().top;
    // //裁剪区域边界矩形的高
    // const clipBoundingHeight = this.newImg.clipPath.getBoundingRect().height;

    // const oriLeft = clipBoundingleft + clipBoundingWidth;
    // const oriTop = clipBoundingHeight + clipBoundingTop;
    const newWidth = newScale * this.newImg.width;
    const newHeight = newScale * this.newImg.height;
    const limit =
      oriImgPoint.tl.x > oriRectPoint.bounding.tl.x ||
      oriImgPoint.tl.y > oriRectPoint.bounding.tl.y ||
      oriImgPoint.tl.x + newWidth < oriRectPoint.bounding.br.x ||
      oriImgPoint.tl.y + newHeight < oriRectPoint.bounding.br.y;

    // const limit =
    //   oriLeft > maxX ||
    //   clipBoundingleft < minX ||
    //   oriTop > Math.abs(maxY) ||
    //   clipBoundingTop < minY;

    // const limit =
    //   !booleanPointInPolygon(tlPoint, imgPolygon) ||
    //   !booleanPointInPolygon(brPoint, imgPolygon);
    if (limit) {
      // const rectPoint = newImg.clipPath.calcCoords(true);
      // const imgPoint = newImg.calcCoords(true);

      // this.newImg.setCoords();
      // this.imgObj.setCoords();
      // this.newImg.clipPath.setCoords();

      // const oriRectPoint = getOri(rectPoint);
      // const oriImgPoint = getOri(imgPoint);
      // let newScale = this.newImg.scaleX;

      // const oriNewImgWidth = oriImgPoint.br.x - oriImgPoint.tl.x;
      // const oriNewImgHeight = oriImgPoint.br.y - oriImgPoint.tl.y;
      // const oriClipPathWidth =
      //   oriRectPoint.bounding.br.x - oriRectPoint.bounding.tl.x;
      // const oriClipPathHeight =
      //   oriRectPoint.bounding.br.y - oriRectPoint.bounding.tl.y;

      // if (oriRectPoint.bounding.tl.x < oriImgPoint.tl.x) {
      //   const diff = oriImgPoint.tl.x - oriRectPoint.bounding.tl.x;
      //   oriImgPoint.tl.x -= diff;
      //   oriImgPoint.br.x -= diff;
      // }
      // if (oriRectPoint.bounding.tl.y < oriImgPoint.tl.y) {
      //   const diff = oriImgPoint.tl.y - oriRectPoint.bounding.tl.y;
      //   oriImgPoint.tl.y -= diff;
      //   oriImgPoint.br.y -= diff;
      // }
      // if (oriRectPoint.bounding.br.x > oriImgPoint.br.x) {
      //   const diff = oriRectPoint.bounding.br.x - oriImgPoint.br.x;
      //   oriImgPoint.tl.x += diff;
      //   oriImgPoint.br.x += diff;
      // }
      // if (oriRectPoint.bounding.br.y > oriImgPoint.br.y) {
      //   const diff = oriRectPoint.bounding.br.y - oriImgPoint.br.y;
      //   oriImgPoint.tl.y += diff;
      //   oriImgPoint.br.y += diff;
      // }
      // const newWidth = newScale * this.newImg.width;
      // const newHeight = newScale * this.newImg.height;
      if (oriImgPoint.tl.x > oriRectPoint.bounding.tl.x) {
        oriImgPoint.tl.x = oriRectPoint.bounding.tl.x;
      }
      if (oriImgPoint.tl.y > oriRectPoint.bounding.tl.y) {
        oriImgPoint.tl.y = oriRectPoint.bounding.tl.y;
      }
      //经过上面缩放和修改左上角的逻辑，图片的右下角不能直接使用oriNewImgPoint.br
      if (oriImgPoint.tl.x + newWidth < oriRectPoint.bounding.br.x) {
        oriImgPoint.tl.x +=
          oriRectPoint.bounding.br.x - (oriImgPoint.tl.x + newWidth);
      }
      if (oriImgPoint.tl.y + newHeight < oriRectPoint.bounding.br.y) {
        oriImgPoint.tl.y +=
          oriRectPoint.bounding.br.y - (oriImgPoint.tl.y + newHeight);
      }

      const newPoint = fabric.util.rotatePoint(
        oriImgPoint.tl,
        newImg.getCenterPoint(),
        fabric.util.degreesToRadians(newImg.angle)
      );
      newImg.set({
        left: newPoint.x,
        top: newPoint.y
      });
      backData = {
        top: newPoint.y,
        left: newPoint.x
      };
    } else {
      backData = { top, left };
    }
    this.imgObj.set(backData);
    this.canvas.requestRenderAll();
  }

  getOri(obj, newImg) {
    const newObj = {};
    for (const key in obj) {
      const point = obj[key];
      const oriPoint = fabric.util.rotatePoint(
        point,
        newImg.getCenterPoint(),
        fabric.util.degreesToRadians(-newImg.angle)
      );
      newObj[key] = oriPoint;
    }
    return newObj;
  }

  //删除图片
  async deleteImg() {
    if (this.imgObj) {
      const activeObj = this.canvas.getActiveObject();
      if (activeObj === this.imgContent) {
        this.canvas.remove(this.imgObj);
        this.imgObj = null;
        if (this.newImg) {
          this.canvas.remove(this.newImg);
          this.newImg = null;
        }
        this.imgContent.off("mousedblclick");
        //将当前容器的笔触设为1，不然看不见
        this.imgContent.set({
          strokeWidth: 1,
          stroke: "black"
        });

        this.usedUrl = null;
        this.canvas.renderAll();
        this.saveData();
        if (this.pushIntoArrDebounce && !this.readonly) {
          this.pushIntoArrDebounce("canvas");
        }
        //主动删除图片更新菜单状态
        this.$bus.$emit("sendCanvasImgInfo", {
          content: true,
          img: false
        });
        // const rect = new fabric.Rect();
        // rect.setOptions(this.obj);

        // this.canvas.add(rect);
        // this.canvas.renderAll();
      }
    }
  }

  //删除容器
  deleteContent() {
    if (this.imgContent && !this.imgObj) {
      const activeObj = this.canvas.getActiveObject();
      if (activeObj === this.imgContent) {
        this.canvas.remove(this.imgContent);
        this.imgContent = null;
        this.svgSrc = null;
        this.canvas.renderAll();
        this.saveData();
        if (this.pushIntoArrDebounce && !this.readonly) {
          this.pushIntoArrDebounce("canvas");
        }
        this.isLive = false;
        // 主动删除容器菜单新状态
        this.$bus.$emit("sendCanvasImgInfo", {
          content: false,
          img: false
        });
      }
    }
    return this.isLive;
  }

  //接收容器属性删除素材 从而删除当前实例图片
  deleteImgFromAttrForm(url) {
    const usedImgAry = this.layerTree.formObj.usedImgAry;
    if (this.imgObj && url === this.usedUrl) {
      this.canvas.remove(this.imgObj);
      this.imgObj = null;
      if (this.newImg) {
        this.canvas.remove(this.newImg);
        this.newImg = null;
      }
      this.imgContent.off("mousedblclick");
      usedImgAry.forEach((item, index) => {
        if (item === url) {
          usedImgAry.splice(index, 1);
        }
      });
      this.usedUrl = null;
      this.saveData();
      if (this.pushIntoArrDebounce && !this.readonly) {
        this.pushIntoArrDebounce("canvas");
      }
      //将当前容器的笔触设为1，不然看不见
      this.imgContent.set({
        strokeWidth: 1
      });
      this.canvas.renderAll();
    }
  }

  //更换图片&添加图片
  async changeCurrentImg(options) {
    if (!this.readonly) {
      this.usedUrl = options.file_path;
      this.material = {
        type: "material",
        id: options.id,
        mediaType: options.media_type
      };
      options.url = options.file_path;
      if (this.imgObj !== null) {
        this.canvas.remove(this.imgObj);
        this.imgObj = null;
        this.imgObj = await this.createImg(options);
        this.canvas.add(this.imgObj);
        this.canvas.bringToFront(this.imgContent);
        this.canvas.renderAll();
      } else {
        this.imgObj = await this.createImg(options);
        this.imgContent.set({
          strokeWidth: 0,
          stroke: "transparent"
        });
        this.canvas.add(this.imgObj);
        this.canvas.bringToFront(this.imgContent);
        this.canvas.renderAll();
      }
      this.contentListenEvent(this.imgContent);
      this.saveData();
      if (this.pushIntoArrDebounce && !this.readonly) {
        this.pushIntoArrDebounce("canvas");
      }
    }
  }

  //缩放图片
  scaleCurrentImg(img) {
    const { width, height } = img;
    // const contentWidth = this.imgContent.getScaledWidth();
    // const contentHeight = this.imgContent.getScaledHeight();

    const contentWidth = this.imgContent.getBoundingRect().width;
    const contentHeight = this.imgContent.getBoundingRect().height;
    //图片宽和容器宽的比
    const wwRatio = width / contentWidth;
    const hhRatio = height / contentHeight;
    if (width < contentWidth && height >= contentHeight) {
      img.scaleToWidth(contentWidth);
    } else if (width >= contentWidth && height < contentHeight) {
      img.scaleToHeight(contentHeight);
    } else if (width < contentWidth && height < contentHeight) {
      if (wwRatio < hhRatio) {
        img.scaleToWidth(contentWidth);
      } else {
        img.scaleToHeight(contentHeight);
      }
    }
    this.canvas.renderAll();
  }

  //容器的各种监听事件
  contentListenEvent(content) {
    content.on("mousedblclick", () => {
      this.addGaryScale();
    });
    //等到图片加进容器再各种监听事件
    content.on("scaling", this.updateClipPath.bind(this));
    content.on("scaled", this.updateClipPath.bind(this));
    content.on("moving", this.updateClipPath.bind(this));
    content.on("moved", this.updateClipPath.bind(this));
    content.on("rotating", this.updateClipPath.bind(this));
    content.on("rotated", this.updateClipPath.bind(this));
    content.on("selected", () => {
      if (this.imgObj) {
        this.imgObj.bringToFront();
        this.imgContent.bringToFront();
        this.canvas.renderAll();
      }
    });
    content.on("mousedown", () => {
      this.isActive = true;
    });
    content.on("mouseup", () => {
      this.isActive = false;
    });
  }

  //容器的drop事件处理
  async contentDropEvent(content, ev) {
    const options = JSON.parse(ev.e.dataTransfer.getData("option"));
    //非素材不能接受drop
    if (options.type !== "img") {
      return;
    }
    //判断是否处于编辑页面
    if (this.inEdit) {
      options.url = this.gen_content_url(options.mediaInfo, "middleWmPath");
      this.material = {
        mediaId: options.mediaId,
        type: "content",
        id: options.id,
        meidaType: options.mediaType
      };
    } else {
      this.material = {
        type: "material",
        id: options.id,
        mediaType: options.media_type
      };
    }

    if (this.imgObj !== null && !this.readonly) {
      this.usedUrl = options.url;
      this.canvas.remove(this.imgObj);
      this.imgObj = null;

      this.imgObj = await this.createImg(options);
      this.canvas.add(this.imgObj);
      // this.canvas.sendToBack(this.imgObj);
      this.canvas.bringToFront(this.imgContent);
      this.canvas.renderAll();
      // if (this.pushIntoArrDebounce && !this.readonly) {
      //   this.pushIntoArrDebounce("canvas");
      // }
      this.saveData();

      if (this.pushIntoArrDebounce && !this.readonly) {
        this.pushIntoArrDebounce("canvas");
      }
      return;
    }
    this.imgObj = await this.createImg(options);
    this.imgContent.set({
      strokeWidth: 0,
      stroke: "transparent"
    });
    this.canvas.add(this.imgObj);
    this.imgLeft = this.imgObj.get("left");
    this.imgTop = this.imgObj.get("top");
    this.canvas.renderAll();

    //把容器提到顶层
    // this.canvas.sendToBack(this.imgObj);
    this.canvas.bringToFront(this.imgContent);
    this.contentListenEvent(content);
    this.saveData();

    if (this.pushIntoArrDebounce && !this.readonly) {
      this.pushIntoArrDebounce("canvas");
    }

    // content.on("mousedblclick", () => {
    //   this.addGaryScale();
    // });
    // //等到图片加进容器再各种监听事件
    // content.on("scaling", this.updateClipPath.bind(this));
    // content.on("scaled", this.updateClipPath.bind(this));
    // content.on("moving", this.updateClipPath.bind(this));
    // content.on("moved", this.updateClipPath.bind(this));
    // content.on("rotating", this.updateClipPath.bind(this));
    // content.on("rotated", this.updateClipPath.bind(this));
    // content.on("mousedown", () => {
    //   this.isActive = true;
    // });
    // content.on("mouseup", () => {
    //   this.isActive = false;
    // });
  }
  getImgPolygon(oriImgPoint) {
    const { tl, tr, br, bl } = oriImgPoint;
    const oriImgAry = [tl, tr, br, bl, tl].map(item => {
      return Object.values(item);
    });
    let contentPolygon = polygon([oriImgAry]);
    return contentPolygon;
  }
  //中上
  mtControl(oriImgPoint, oriRectPoint) {
    const contentPolygon = this.getImgPolygon(oriImgPoint);

    const leftMiddleX = oriRectPoint.bl.x,
      leftMiddleY = Math.abs((oriRectPoint.bl.y + oriRectPoint.tl.y) / 2),
      rightMiddleX = oriRectPoint.br.x,
      rightMiddleY = Math.abs((oriRectPoint.br.y + oriRectPoint.tr.y) / 2);

    const lineLeft = lineString([
      // [oriRectPoint.bl.x, oriRectPoint.bl.y - 1],
      [leftMiddleX, leftMiddleY],
      [oriRectPoint.tl.x, oriRectPoint.tl.y]
    ]);

    const lineRight = lineString([
      // [oriRectPoint.br.x, oriRectPoint.br.y - 1],
      [rightMiddleX, rightMiddleY],
      [oriRectPoint.tr.x, oriRectPoint.tr.y]
    ]);

    //算出交点
    const coordinateLeft = lineIntersect(lineLeft, contentPolygon).features;
    const coordinateRight = lineIntersect(lineRight, contentPolygon).features;

    // console.log({
    //   coordinateLeft,
    //   coordinateTop
    // });

    if (coordinateLeft.length > 0 && coordinateRight.length === 0) {
      oriRectPoint.tl.y = coordinateLeft[0].geometry.coordinates[1];
    } else if (coordinateLeft.length === 0 && coordinateRight.length > 0) {
      oriRectPoint.tl.y = coordinateRight[0].geometry.coordinates[1];
    } else if (coordinateLeft.length > 0 && coordinateRight.length > 0) {
      if (
        coordinateLeft[0].geometry.coordinates[1] >=
        coordinateRight[0].geometry.coordinates[1]
      ) {
        oriRectPoint.tl.y = coordinateLeft[0].geometry.coordinates[1];
      } else {
        oriRectPoint.tl.y = coordinateRight[0].geometry.coordinates[1];
      }
    } else if (coordinateLeft.length === 0 && coordinateRight.length === 0) {
      return;
    }

    // console.log(this.imgContent.top);
    // 画点测试;
    // if (coordinateLeft.length !== 0) {
    //   coordinateLeft.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }

    // if (coordinateRight.length !== 0) {
    //   coordinateRight.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }
  }
  //中下
  mbControl(oriImgPoint, oriRectPoint) {
    const contentPolygon = this.getImgPolygon(oriImgPoint);

    const leftMiddleX = oriRectPoint.tl.x,
      leftMiddleY = Math.abs((oriRectPoint.bl.y + oriRectPoint.tl.y) / 2),
      rightMiddleX = oriRectPoint.tr.x,
      rightMiddleY = Math.abs((oriRectPoint.br.y + oriRectPoint.tr.y) / 2);

    const lineLeft = lineString([
      [leftMiddleX, leftMiddleY],
      [oriRectPoint.bl.x, oriRectPoint.bl.y]
      // [oriRectPoint.tl.x, oriRectPoint.tl.y + 1]
    ]);

    const lineRight = lineString([
      [rightMiddleX, rightMiddleY],
      [oriRectPoint.br.x, oriRectPoint.br.y]
      // [oriRectPoint.tr.x, oriRectPoint.tr.y + 1]
    ]);

    // const imgLeftLine = lineString([
    //   [oriImgPoint.tl.x, oriImgPoint.tl.y],
    //   [oriImgPoint.bl.x, oriImgPoint.bl.y]
    // ]);

    // const imgBottomLine = lineString([
    //   [oriImgPoint.bl.x, oriImgPoint.bl.y],
    //   [oriImgPoint.br.x, oriImgPoint.br.y]
    // ]);

    //算出交点
    const coordinateLeft = lineIntersect(lineLeft, contentPolygon).features;
    const coordinateRight = lineIntersect(lineRight, contentPolygon).features;

    if (coordinateLeft.length > 0 && coordinateRight.length === 0) {
      oriRectPoint.br.y = coordinateLeft[0].geometry.coordinates[1];
    } else if (coordinateLeft.length === 0 && coordinateRight.length > 0) {
      oriRectPoint.br.y = coordinateRight[0].geometry.coordinates[1];
    } else if (coordinateLeft.length > 0 && coordinateRight.length > 0) {
      if (
        coordinateLeft[0].geometry.coordinates[1] <=
        coordinateRight[0].geometry.coordinates[1]
      ) {
        oriRectPoint.br.y = coordinateLeft[0].geometry.coordinates[1];
      } else {
        oriRectPoint.br.y = coordinateRight[0].geometry.coordinates[1];
      }
    } else if (coordinateLeft.length === 0 && coordinateRight.length === 0) {
      return;
    }

    // console.log(oriRectPoint.tl.x);

    // console.log(this.imgContent.top);
    //画点测试
    // if (coordinateLeft.length !== 0) {
    //   coordinateLeft.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }

    // if (coordinateRight.length !== 0) {
    //   coordinateRight.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }
  }
  //中左
  mlControl(oriImgPoint, oriRectPoint) {
    const contentPolygon = this.getImgPolygon(oriImgPoint);

    const leftMiddleX = Math.abs((oriRectPoint.tr.x + oriRectPoint.tl.x) / 2),
      leftMiddleY = oriRectPoint.tr.y,
      rightMiddleX = Math.abs((oriRectPoint.br.x + oriRectPoint.bl.x) / 2),
      rightMiddleY = oriRectPoint.br.y;
    const lineLeft = lineString([
      [leftMiddleX, leftMiddleY],
      [oriRectPoint.tl.x, oriRectPoint.tl.y]
      // [oriRectPoint.tr.x - 1, oriRectPoint.tr.y]
    ]);

    const lineRight = lineString([
      [rightMiddleX, rightMiddleY],
      [oriRectPoint.bl.x, oriRectPoint.bl.y]
      // [oriRectPoint.br.x - 1, oriRectPoint.br.y]
    ]);

    //算出交点
    const coordinateLeft = lineIntersect(lineLeft, contentPolygon).features;
    const coordinateRight = lineIntersect(lineRight, contentPolygon).features;

    // console.log({
    //   coordinateLeft,
    //   coordinateRight
    // });
    if (coordinateLeft.length > 0 && coordinateRight.length === 0) {
      oriRectPoint.tl.x = coordinateLeft[0].geometry.coordinates[0];
    } else if (coordinateLeft.length === 0 && coordinateRight.length > 0) {
      oriRectPoint.tl.x = coordinateRight[0].geometry.coordinates[0];
    } else if (coordinateLeft.length > 0 && coordinateRight.length > 0) {
      if (
        coordinateLeft[0].geometry.coordinates[0] >=
        coordinateRight[0].geometry.coordinates[0]
      ) {
        oriRectPoint.tl.x = coordinateLeft[0].geometry.coordinates[0];
      } else {
        oriRectPoint.tl.x = coordinateRight[0].geometry.coordinates[0];
      }
    } else if (coordinateLeft.length === 0 && coordinateRight.length === 0) {
      return;
    }
    // //画点测试
    // if (coordinateLeft.length !== 0) {
    //   coordinateLeft.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }

    // if (coordinateRight.length !== 0) {
    //   coordinateRight.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }
  }
  //中右
  mrControl(oriImgPoint, oriRectPoint) {
    const contentPolygon = this.getImgPolygon(oriImgPoint);

    const leftMiddleX = Math.abs((oriRectPoint.tr.x + oriRectPoint.tl.x) / 2),
      leftMiddleY = oriRectPoint.tl.y,
      rightMiddleX = Math.abs((oriRectPoint.br.x + oriRectPoint.bl.x) / 2),
      rightMiddleY = oriRectPoint.bl.y;

    const lineLeft = lineString([
      [leftMiddleX, leftMiddleY],
      // [oriRectPoint.tl.x + 1, oriRectPoint.tl.y],
      [oriRectPoint.tr.x, oriRectPoint.tr.y]
    ]);

    const lineRight = lineString([
      [rightMiddleX, rightMiddleY],
      // [oriRectPoint.bl.x + 1, oriRectPoint.bl.y],
      [oriRectPoint.br.x, oriRectPoint.br.y]
    ]);

    // const imgRightLine = lineString([
    //   [oriImgPoint.tr.x, oriImgPoint.tr.y],
    //   [oriImgPoint.br.x, oriImgPoint.br.y]
    // ]);

    // const imgBottomLine = lineString([
    //   [oriImgPoint.bl.x, oriImgPoint.bl.y],
    //   [oriImgPoint.br.x, oriImgPoint.br.y]
    // ]);

    //算出交点

    const coordinateLeft = lineIntersect(lineLeft, contentPolygon).features;
    const coordinateRight = lineIntersect(lineRight, contentPolygon).features;

    // console.log({
    //   coordinateLeft,
    //   coordinateRight
    // });
    if (coordinateLeft.length > 0 && coordinateRight.length === 0) {
      oriRectPoint.br.x = coordinateLeft[0].geometry.coordinates[0];
    } else if (coordinateLeft.length === 0 && coordinateRight.length > 0) {
      oriRectPoint.br.x = coordinateRight[0].geometry.coordinates[0];
    } else if (coordinateLeft.length > 0 && coordinateRight.length > 0) {
      if (
        coordinateLeft[0].geometry.coordinates[0] <=
        coordinateRight[0].geometry.coordinates[0]
      ) {
        oriRectPoint.br.x = coordinateLeft[0].geometry.coordinates[0];
      } else {
        oriRectPoint.br.x = coordinateRight[0].geometry.coordinates[0];
      }
    } else if (coordinateLeft.length === 0 && coordinateRight.length === 0) {
      return;
    }
    //画点测试
    // if (coordinateLeft.length !== 0) {
    //   coordinateLeft.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }

    // if (coordinateRight.length !== 0) {
    //   coordinateRight.forEach(item => {
    //     const point = new fabric.Circle({
    //       radius: 1,
    //       top: item.geometry.coordinates[1],
    //       left: item.geometry.coordinates[0],
    //       fill: "black"
    //     });
    //     this.canvas.add(point);
    //   });
    // }
  }
}
export default CavContent;
