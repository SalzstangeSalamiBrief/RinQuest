// import { IEntity, NpcEntityTypes } from "@/models/Entities";
// import {
//   backgroundColumns,
//   initEntities,
//   inactiveEntities,
// } from "./fields.json";

// TODO WTF IS xMAX IN ingameEntities.json

// TODO GET ALL ENTITIES AS LIST WITH COORS
// TODO USE TWO LISTS: ONE FOR ALL ENTITIES AND ONE FOR THE ACTIVE ONES
// TODO PASS THE ACTIVE ENTTIIES TO THE RENDER METHOD
// TODO IF AN  ENTITY IS SPAWNED ADD A REFERENZ TO ACTIVE ONES
// TODO IF AN ENTITY IS DEFEATED/REMOVED REMOVE THE REFERENCE FROM ACTIVE

export type Field = string[80][60]; // TODO TYPING: NOT STING BUT UNION OF ALL POSSIBLE TYPES

export function GameField() {
  // const currentScrollIndex = 0;
  // TODO ADD FIELD FOR ENTITES
  // const fields =

  function createField() {
    const columns = Array(80).fill(undefined);
    for (let i = 0; i < columns.length; i += 1) {
      columns[i] = Array(40).fill("grassTile");
    }
    return columns;
  }

  return { createField };
}
// export default class GameField {
//   constructor(painter, activeEntityList) {
//     return new Promise((resolve) => {
//       this.activeEntityList = activeEntityList;
//       this.scrollIndex = 0;
//       this.fieldMap = new Map();
//       this.painter = painter;
//       // reduce json-size with repeating
//       this.repeatCol =
//         backgroundColumns.scrollColumns[this.scrollIndex][0].repeat;
//       // parallel init and drawing
//       const promiseArray = [
//         this.initField(backgroundColumns.start, "background"),
//         this.initField(initEntities, "entities"),
//       ];
//       // draw each active entity of the init screen
//       this.activeEntityList.getAllEntities().forEach((entity) => {
//         const { coords, size } = entity.getCoordsAndSize();
//         const type = entity.getType();
//         this.painter.drawCharacter(type, coords, size);
//       });
//       this.activeEntityList.setInactiveEntities(inactiveEntities);
//       // wait to succeed all promises in promiseArray and then paint background field
//       Promise.all(promiseArray)
//         .then(() => this.painter.drawFieldMap(this.fieldMap.get("background")))
//         .then(() => resolve(this));
//     });
//   }

//   /**
//    * Calc an Object with coords for the movement direction
//    * @param {String} movementDirection
//    * @param {Number} xStart
//    * @param {Number} yStart
//    * @param {Number} width
//    * @param {Number} height
//    */

//   /** <--------------- general functions ----------> */

//   async initField(inputArray, fieldType) {
//     const resultArray = [];
//     // init rows with 0es filled
//     for (let row = 0; row < 43; row += 1) {
//       resultArray.push(new Array(80).fill(""));
//     }
//     // set values according to the inputArray
//     inputArray.forEach(({ xMin, yMin, xMax, yMax, type, id = undefined }) => {
//       for (let r = yMin; r < yMax; r += 1) {
//         const row = resultArray[r];
//         for (let col = xMin; col < xMax; col += 1) {
//           const suffix = id !== undefined ? `_${id}` : "";
//           row[col] = `${type}${suffix}`;
//         }
//       }
//     });
//     this.fieldMap.set(fieldType, resultArray);
//   }

//   /**
//    * check if the first inactiveEntity can be displayed
//    * return null if that is not the case, else return the entity
//    * @param {Number} acutalMaxXCoord
//    */
//   checkForCreationOfNewEntity(actualMaxXCoord) {
//     let result = null;
//     // get first inanctive entty and check if it can be displayed
//     const inactiveEntity = this.activeEntityList.getFirstInactiveEntity();
//     if (inactiveEntity !== null) {
//       const isActualXCoordVisible = actualMaxXCoord === inactiveEntity.xMax;
//       if (isActualXCoordVisible) {
//         result = this.activeEntityList.getFistInactiveEntity();
//       }
//     }
//     return result;
//   }

//   /**
//    * Scroll the Field by 1 each call from right to left
//    * @param {String} fieldType
//    */
//   async scrollField(fieldType = "background") {
//     let hasScrolled = false;
//     if (this.scrollIndex < backgroundColumns.scrollColumns.length) {
//       const map = this.fieldMap.get(fieldType);
//       const scrollCol = backgroundColumns.scrollColumns[this.scrollIndex];
//       // scroll each col of background
//       for (let i = 0; i < scrollCol.length; i += 1) {
//         const { start, end, type } = scrollCol[i];
//         for (let cell = start; cell < end; cell += 1) {
//           map[cell].shift();
//           map[cell].push(type);
//         }
//       }

//       this.repeatCol -= 1;
//       if (this.repeatCol === 0) {
//         this.scrollIndex += 1;
//         const doesNewScrollIndexExist =
//           this.scrollIndex < backgroundColumns.scrollColumns.length;
//         if (doesNewScrollIndexExist) {
//           this.repeatCol =
//             backgroundColumns.scrollColumns[this.scrollIndex][0].repeat;
//         }
//       }
//       hasScrolled = true;
//       this.painter.drawFieldMap(map);
//     }
//     return hasScrolled;
//   }

//   updateEntitiesField(
//     fieldType = "entities",
//     oldXCoord,
//     oldYCoord,
//     width,
//     height,
//     newXCoord,
//     newYCoord,
//     entityType,
//     id = ""
//   ) {
//     const map = this.fieldMap.get(fieldType);
//     const entityToUpdate = `${entityType}${id !== "" ? "_" : ""}${id}`;
//     // clear old position
//     for (let row = oldYCoord; row < oldYCoord + height; row += 1) {
//       for (let col = oldXCoord; col < oldXCoord + width; col += 1) {
//         map[row][col] = this.constructor.removeEntryFromCell(
//           entityToUpdate,
//           map[row][col]
//         );
//       }
//     }
//     // insert new position
//     for (let r = newYCoord; r < newYCoord + height; r += 1) {
//       const row = map[r];
//       for (let col = newXCoord; col < newXCoord + width; col += 1) {
//         // check if the entity already exists in the cell
//         const isEntityInCell = new RegExp(entityToUpdate).test(row[col]);
//         if (!isEntityInCell) {
//           row[col] = `${row[col]} ${entityToUpdate}`.trim();
//         }
//       }
//     }
//   }

//   /**
//    * remove and entity from the entitiesField
//    * @param {String} entityType
//    * @param {*} id
//    */
//   removeFromEntitiesField(entityType = undefined, id = "") {
//     const entityToRemove = `${entityType}${id !== "" ? "_" : ""}${id}`;
//     const map = this.fieldMap.get("entities");
//     const maxRows = map.length;
//     const maxCols = map[0].length;
//     for (let row = 0; row < maxRows; row += 1) {
//       for (let col = 0; col < maxCols; col += 1) {
//         const isEntityToRemoveInCell = new RegExp(entityToRemove).test(
//           map[row][col]
//         );
//         if (isEntityToRemoveInCell) {
//           map[row][col] = this.constructor.removeEntryFromCell(
//             entityToRemove,
//             map[row][col]
//           );
//         }
//       }
//     }
//   }

//   /**
//    * Remove an entry from the given cell
//    * @param {String} entityToUpdate
//    * @param {String} cell
//    */
//   static removeEntryFromCell(entityToRemove, cell = "") {
//     const entries = [...cell.split(" ")];
//     for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
//       const isEntryFilledByEntityToRemove =
//         entityToRemove === entries[entryIndex];
//       if (isEntryFilledByEntityToRemove) {
//         entries.splice(entryIndex, 1);
//       }
//     }
//     return entries.join(" ").trim();
//   }

//   addEntityAtCoords(entityToAdd) {
//     const {
//       size: [width, height],
//       coords: [xCoord, yCoord],
//     } = entityToAdd.getCoordsAndSize();
//     const maxXCoord = xCoord + width;
//     const maxYCoord = yCoord + height;
//     const entryToAdd = `${entityToAdd.getType()}_${entityToAdd.getID()}`;
//     const map = this.fieldMap.get("entities");
//     for (let row = yCoord; row < maxYCoord; row += 1) {
//       for (let col = xCoord; col < maxXCoord; col += 1) {
//         map[row][col] += ` ${entryToAdd}`;
//         map[row][col].trim();
//       }
//     }
//   }

//   /** <--------------- getter ----------> */

//   getField(type) {
//     return this.fieldMap.get(type);
//   }

//   async getMergedPartialField(
//     [xStart, yStart],
//     [width, height],
//     movementDirection
//   ) {
//     const movementObject = this.constructor.calcMovementDirection(
//       movementDirection,
//       xStart,
//       yStart,
//       width,
//       height
//     );

//     const [partialEntitiesField, partialBackgroundField] = await Promise.all([
//       this.getPartialField(movementObject, "entities"),
//       this.getPartialField(movementObject, "background"),
//     ]);

//     const mergedPartialField = [];
//     for (let x = 0; x < partialEntitiesField.length; x += 1) {
//       const isCellAGrassTile = partialBackgroundField[x] === "grassTile";
//       if (isCellAGrassTile) {
//         mergedPartialField.push(partialEntitiesField[x].split(" "));
//       } else {
//         mergedPartialField.push(partialBackgroundField[x]);
//       }
//     }
//     return mergedPartialField.flat();
//   }

//   /**
//    * get partial field from [xStart, yStart] to [yStart, yEnd]
//    * @param {Object} Object
//    * @param {String} fieldType
//    */
//   async getPartialField({ xStart, xEnd, yStart, yEnd }, fieldType) {
//     const field = this.fieldMap.get(fieldType);
//     const result = [];
//     for (let row = yStart; row < yEnd; row += 1) {
//       for (let col = xStart; col < xEnd; col += 1) {
//         result.push(field[row][col]);
//       }
//     }
//     return result;
//   }
// }

// // TODO THIS FUNCTION SHOULD NOT BE IN THIS FILE
// const calcMovementDirection = (
//   movementDirection: MovementDirection,
//   entity: IEntity
// ) => {
//   const { xCoordinate, yCoordinate, height, width } = entity;
//   const movementObject = {
//     xStart: xCoordinate,
//     yStart: yCoordinate,
//     xEnd: xCoordinate + width,
//     yEnd: yCoordinate + height,
//   };
//   // TODO WHAT ARE THIS CALCULATIONS? SHOULD THE ENTITY MOVE ONE TILE AT A TIME OR ITS WHOLE WIDTH? NEED FURTHER INFORMATIONEN
//   switch (movementDirection) {
//     case MovementDirection.right:
//       movementObject.xStart = xCoordinate + width - 1;
//       movementObject.xEnd = xCoordinate + width;
//       // movementObject.yEnd = yCoordinate + height;
//       break;
//     case MovementDirection.left:
//       movementObject.xStart = xCoordinate - width - 1;
//       movementObject.xEnd = xCoordinate;
//       // movementObject.yEnd = yCoordinate + height;
//       break;
//     case MovementDirection.top:
//       movementObject.xEnd = xCoordinate + width;
//       movementObject.yEnd = yCoordinate + 1;
//       break;
//     case MovementDirection.bottom:
//       movementObject.yStart = yCoordinate + height - 1;
//       movementObject.xEnd = xCoordinate + width;
//       movementObject.yEnd = yCoordinate + height;
//       break;
//     default:
//       break;
//   }
//   return movementObject;
// };
