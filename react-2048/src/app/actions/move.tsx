import { Dispatch, SetStateAction } from "react";
import { MergeState, MoveState } from "@/app/states/enum";
import { TypeTileState } from "../states/tileState";
import getRandomNumber from "@/app/utils/randomNumber";

const cleanUp = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  setGridNumber: Dispatch<SetStateAction<number>>;
}) => {
  setTimeout(() => {
    let gridNumber = 5;
    props.setGridNumber((prev) => {
      gridNumber = prev;
      return prev;
    });
    props.setNumberTiles((prev) => {
      const newNumberTiles = [];
      const grid: number[][] = Array(gridNumber)
        .fill(0)
        .map(() => Array(gridNumber).fill(0));
      let maxID = Math.max(...prev.map((value) => value.id));
      for (const numberTile of prev.sort((a, b) =>
        a.mergeState === MergeState.merged ? -1 : 1
      )) {
        const { id, num, top, left, x, y, mergeState } = numberTile;
        if (mergeState === MergeState.none) {
          if (grid[top + y][left + x] === 0) {
            newNumberTiles.push({
              id: id,
              num: num,
              top: top + y,
              left: left + x,
              x: 0,
              y: 0,
              mergeState: mergeState,
              moveState: MoveState.notMoving,
            });
          }
        } else if (mergeState === MergeState.merged) {
          if (grid[top + y][left + x] === 0) {
            newNumberTiles.push({
              id: maxID + 1,
              num: num * 2,
              top: top + y,
              left: left + x,
              x: 0,
              y: 0,
              mergeState: MergeState.none,
              moveState: MoveState.notMoving,
            });
          }
          maxID += 1;
          grid[top + y][left + x] = 1;
        }
      }
      return newNumberTiles;
    });
  }, 100);
};
export const moveUp = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  setGridNumber: Dispatch<SetStateAction<number>>;
}) => {
  let gridNumber = 5;
  props.setGridNumber((prev) => {
    gridNumber = prev;
    return prev;
  });
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => a.top + a.y - (b.top + b.y));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(gridNumber).fill(-1);
    const lasts: number[] = Array(gridNumber).fill(-1);
    let isMove: boolean = false;
    for (const numberTile of sortedPrev) {
      const { id, num, top, left, x, y } = numberTile;
      if (numbers[left + x] === num) {
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: 0,
          y: lasts[left + x] - (top + y),
          mergeState: MergeState.merged,
          moveState: MoveState.moving,
        });
        numbers[left + x] = -1;
        if (lasts[left + x] != top + y) {
          isMove = true;
        }
      } else {
        lasts[left + x] += 1;
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: 0,
          y: lasts[left + x] - (top + y),
          mergeState: MergeState.none,
          moveState: MoveState.moving,
        });
        numbers[left + x] = num;
        if (lasts[left + x] != top + y) {
          isMove = true;
        }
      }
    }
    let count = 0;
    const candidate: number[] = [];
    lasts.map((value, index) => {
      if (value != gridNumber) {
        count += 1;
        candidate.push(index);
      }
    });
    if (count === 0) {
      return prev;
    }
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: Math.max(...newNumberTiles.map((value) => value.id)) + 1,
      num: 2,
      top: gridNumber - 1,
      left: candidate[randomNumber],
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    if (isMove) {
      return newNumberTiles;
    } else {
      return prev;
    }
  });
  cleanUp({
    setNumberTiles: props.setNumberTiles,
    setGridNumber: props.setGridNumber,
  });
};
export const moveDown = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  setGridNumber: Dispatch<SetStateAction<number>>;
}) => {
  let gridNumber = 5;
  props.setGridNumber((prev) => {
    gridNumber = prev;
    return prev;
  });
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => b.top + b.y - (a.top + a.y));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(gridNumber).fill(-1);
    const lasts: number[] = Array(gridNumber).fill(gridNumber);
    let isMove: boolean = false;
    for (const numberTile of sortedPrev) {
      const { id, num, top, left, x, y } = numberTile;
      if (numbers[left + x] === num) {
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: 0,
          y: lasts[left + x] - (top + y),
          mergeState: MergeState.merged,
          moveState: MoveState.moving,
        });
        numbers[left + x] = -1;
        if (lasts[left + x] != top + y) {
          isMove = true;
        }
      } else {
        lasts[left + x] -= 1;
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: 0,
          y: lasts[left + x] - (top + y),
          mergeState: MergeState.none,
          moveState: MoveState.moving,
        });
        numbers[left + x] = num;
        if (lasts[left + x] != top + y) {
          isMove = true;
        }
      }
    }
    let count = 0;
    const candidate: number[] = [];
    lasts.map((value, index) => {
      if (value != 0) {
        count += 1;
        candidate.push(index);
      }
    });
    if (count === 0) {
      return prev;
    }
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: Math.max(...newNumberTiles.map((value) => value.id)) + 1,
      num: 2,
      top: 0,
      left: candidate[randomNumber],
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    if (isMove) {
      return newNumberTiles;
    } else {
      return prev;
    }
  });
  cleanUp({
    setNumberTiles: props.setNumberTiles,
    setGridNumber: props.setGridNumber,
  });
};
export const moveLeft = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  setGridNumber: Dispatch<SetStateAction<number>>;
}) => {
  let gridNumber = 5;
  props.setGridNumber((prev) => {
    gridNumber = prev;
    return prev;
  });
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => a.left + a.x - (b.left + b.x));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(gridNumber).fill(-1);
    const lasts: number[] = Array(gridNumber).fill(-1);
    let isMove: boolean = false;
    for (const numberTile of sortedPrev) {
      const { id, num, top, left, x, y } = numberTile;
      if (numbers[top + y] === num) {
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: lasts[top + y] - (left + x),
          y: 0,
          mergeState: MergeState.merged,
          moveState: MoveState.moving,
        });
        numbers[top + y] = -1;
        if (lasts[top + y] != left + x) {
          isMove = true;
        }
      } else {
        lasts[top + y] += 1;
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: lasts[top + y] - (left + x),
          y: 0,
          mergeState: MergeState.none,
          moveState: MoveState.moving,
        });
        numbers[top + y] = num;
        if (lasts[top + y] != left + x) {
          isMove = true;
        }
      }
    }
    let count = 0;
    const candidate: number[] = [];
    lasts.map((value, index) => {
      if (value != gridNumber) {
        count += 1;
        candidate.push(index);
      }
    });
    if (count === 0) {
      return prev;
    }
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: Math.max(...newNumberTiles.map((value) => value.id)) + 1,
      num: 2,
      top: candidate[randomNumber],
      left: gridNumber - 1,
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    if (isMove) {
      return newNumberTiles;
    } else {
      return prev;
    }
  });
  cleanUp({
    setNumberTiles: props.setNumberTiles,
    setGridNumber: props.setGridNumber,
  });
};
export const moveRight = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  setGridNumber: Dispatch<SetStateAction<number>>;
}) => {
  let gridNumber = 5;
  props.setGridNumber((prev) => {
    gridNumber = prev;
    return prev;
  });
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => b.left + b.x - (a.left + a.x));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(gridNumber).fill(-1);
    const lasts: number[] = Array(gridNumber).fill(gridNumber);
    let isMove: boolean = false;
    for (const numberTile of sortedPrev) {
      const { id, num, top, left, x, y } = numberTile;
      if (numbers[top + y] === num) {
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: lasts[top + y] - (left + x),
          y: 0,
          mergeState: MergeState.merged,
          moveState: MoveState.moving,
        });
        numbers[top + y] = -1;
        if (lasts[top + y] != left + x) {
          isMove = true;
        }
      } else {
        lasts[top + y] -= 1;
        newNumberTiles.push({
          id: id,
          num: num,
          top: top + y,
          left: left + x,
          x: lasts[top + y] - (left + x),
          y: 0,
          mergeState: MergeState.none,
          moveState: MoveState.moving,
        });
        numbers[top + y] = num;
        if (lasts[top + y] != left + x) {
          isMove = true;
        }
      }
    }
    let count = 0;
    const candidate: number[] = [];
    lasts.map((value, index) => {
      if (value != 0) {
        count += 1;
        candidate.push(index);
      }
    });
    if (count === 0) {
      return prev;
    }
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: Math.max(...newNumberTiles.map((value) => value.id)) + 1,
      num: 2,
      top: candidate[randomNumber],
      left: 0,
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    if (isMove) {
      return newNumberTiles;
    } else {
      return prev;
    }
  });
  cleanUp({
    setNumberTiles: props.setNumberTiles,
    setGridNumber: props.setGridNumber,
  });
};
