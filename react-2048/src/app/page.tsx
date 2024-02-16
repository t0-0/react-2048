"use client";

import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import getRandomNumber from "@/app/utils/randomNumber";

const useRefHeight = (props: { ref: any; setHeight: any }) => {
  useEffect(() => {
    const updateHeight = () => {
      if (props.ref.current != null) {
        props.setHeight(props.ref.current!.getBoundingClientRect()["height"]);
      }
    };
    window.addEventListener("resize", updateHeight);
    updateHeight();
    return () => window.removeEventListener("resize", updateHeight);
  }, []);
};

enum MergeState {
  none,
  merged,
}
enum MoveState {
  moving,
  notMoving,
}

interface TypeTileState {
  id: number;
  num: number;
  top: number;
  left: number;
  x: number;
  y: number;
  mergeState: MergeState;
  moveState: MoveState;
}

const TileState = () => {
  const [numberTiles, setNumberTiles] = useState<TypeTileState[]>([
    {
      id: 0,
      num: 2,
      top: 0,
      left: 0,
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    },
  ]);
  return { numberTiles: numberTiles, setNumberTiles: setNumberTiles };
};

const cleanUp = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
}) => {
  setTimeout(() => {
    props.setNumberTiles((prev) => {
      const newNumberTiles = [];
      const grid: number[][] = Array(5)
        .fill(0)
        .map(() =>
          Array(5)
            .fill(5)
            .map(() => 0)
        );
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
              id: id,
              num: num * 2,
              top: top + y,
              left: left + x,
              x: 0,
              y: 0,
              mergeState: MergeState.none,
              moveState: MoveState.notMoving,
            });
          }
          grid[top + y][left + x] = 1;
        }
      }
      return newNumberTiles;
    });
  }, 500);
};

const moveUp = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
}) => {
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => a.top + a.y - (b.top + b.y));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(5).fill(-1);
    const lasts: number[] = Array(5).fill(-1);
    let id = -1;
    for (const numberTile of sortedPrev) {
      id += 1;
      const { num, top, left, x, y } = numberTile;
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
      }
    }
    let count = 0;
    const candidate: number[] = [];
    lasts.map((value, index) => {
      if (value != 4) {
        count += 1;
        candidate.push(index);
      }
    });
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: id + 1,
      num: 2,
      top: 4,
      left: candidate[randomNumber],
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    return newNumberTiles;
  });
  cleanUp({ setNumberTiles: props.setNumberTiles });
};
const moveDown = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
}) => {
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => b.top + b.y - (a.top + a.y));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(5).fill(-1);
    const lasts: number[] = Array(5).fill(5);
    let id = -1;
    for (const numberTile of sortedPrev) {
      id += 1;
      const { num, top, left, x, y } = numberTile;
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
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: id + 1,
      num: 2,
      top: 0,
      left: candidate[randomNumber],
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    return newNumberTiles;
  });
  cleanUp({ setNumberTiles: props.setNumberTiles });
};
const moveLeft = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
}) => {
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => a.left + a.x - (b.left + b.x));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(5).fill(-1);
    const lasts: number[] = Array(5).fill(-1);
    let id = -1;
    for (const numberTile of sortedPrev) {
      id += 1;
      const { num, top, left, x, y } = numberTile;
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
      }
    }
    let count = 0;
    const candidate: number[] = [];
    lasts.map((value, index) => {
      if (value != 4) {
        count += 1;
        candidate.push(index);
      }
    });
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: id + 1,
      num: 2,
      top: candidate[randomNumber],
      left: 4,
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    return newNumberTiles;
  });
  cleanUp({ setNumberTiles: props.setNumberTiles });
};
const moveRight = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
}) => {
  props.setNumberTiles((prev) => {
    const sortedPrev = prev.sort((a, b) => b.left + b.x - (a.left + a.x));
    const newNumberTiles: TypeTileState[] = [];
    const numbers: number[] = Array(5).fill(-1);
    const lasts: number[] = Array(5).fill(5);
    let id = -1;
    for (const numberTile of sortedPrev) {
      id += 1;
      const { num, top, left, x, y } = numberTile;
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
    const randomNumber = getRandomNumber(0, count - 1);
    newNumberTiles.push({
      id: id + 1,
      num: 2,
      top: candidate[randomNumber],
      left: 0,
      x: 0,
      y: 0,
      mergeState: MergeState.none,
      moveState: MoveState.notMoving,
    });
    return newNumberTiles;
  });
  cleanUp({ setNumberTiles: props.setNumberTiles });
};

const useKeyDown = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  gridNumber: number;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "ArrowUp") {
        moveUp({ setNumberTiles: props.setNumberTiles });
      } else if (event.key === "ArrowDown") {
        moveDown({ setNumberTiles: props.setNumberTiles });
      } else if (event.key === "ArrowLeft") {
        moveLeft({ setNumberTiles: props.setNumberTiles });
      } else if (event.key === "ArrowRight") {
        moveRight({ setNumberTiles: props.setNumberTiles });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

const useTouch = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  gridNumber: number;
}) => {
  let touchStart: number[] = [0, 0];
  useEffect(() => {
    const handleTouchStart = (event: any) => {
      touchStart = [event.touches[0].clientX, event.touches[0].clientY];
    };
    const handleTouchMove = (event: any) => {
      event.preventDefault();
    };
    const handleTouchEnd = (event: any) => {
      const deltaX = event.changedTouches[0].clientX - touchStart[0];
      const deltaY = event.changedTouches[0].clientY - touchStart[1];
      if (Math.abs(deltaX) < Math.abs(deltaY) && 0 < Math.abs(deltaY)) {
        if (deltaY < 0) {
          moveUp({ setNumberTiles: props.setNumberTiles });
        } else {
          moveDown({ setNumberTiles: props.setNumberTiles });
        }
      } else if (Math.abs(deltaY) < Math.abs(deltaX) && 0 < Math.abs(deltaX)) {
        if (deltaX < 0) {
          moveLeft({ setNumberTiles: props.setNumberTiles });
        } else {
          moveRight({ setNumberTiles: props.setNumberTiles });
        }
      }
    };
    const grid = document.getElementById("grid");
    grid!.addEventListener("touchstart", handleTouchStart);
    grid!.addEventListener("touchmove", handleTouchMove);
    grid!.addEventListener("touchend", handleTouchEnd);
    return () => {
      grid!.removeEventListener("touchstart", handleTouchStart);
      grid!.removeEventListener("touchmove", handleTouchMove);
      grid!.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
};

const useMouse = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  gridNumber: number;
}) => {
  let mouseStart: number[] = [0, 0];
  useEffect(() => {
    const handleMouseDown = (event: any) => {
      mouseStart = [event.clientX, event.clientY];
    };
    const handleMouseMove = (event: any) => {
      event.preventDefault();
    };
    const handleMouseUp = (event: any) => {
      const deltaX = event.clientX - mouseStart[0];
      const deltaY = event.clientY - mouseStart[1];
      if (Math.abs(deltaX) < Math.abs(deltaY) && 0 < Math.abs(deltaY)) {
        if (deltaY < 0) {
          moveUp({ setNumberTiles: props.setNumberTiles });
        } else {
          moveDown({ setNumberTiles: props.setNumberTiles });
        }
      } else if (Math.abs(deltaY) < Math.abs(deltaX) && 0 < Math.abs(deltaX)) {
        if (deltaX < 0) {
          moveLeft({ setNumberTiles: props.setNumberTiles });
        } else {
          moveRight({ setNumberTiles: props.setNumberTiles });
        }
      }
    };
    const grid = document.getElementById("grid");
    grid!.addEventListener("mousedown", handleMouseDown);
    grid!.addEventListener("mousemove", handleMouseMove);
    grid!.addEventListener("mouseup", handleMouseUp);
    return () => {
      grid!.removeEventListener("mousedown", handleMouseDown);
      grid!.removeEventListener("mousemove", handleMouseMove);
      grid!.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
};

const Tile = () => {
  return <div className="aspect-square bg-white"></div>;
};

const NumberTile = (props: {
  gridNumber: number;
  height: number;
  num: number;
  x: number;
  y: number;
  top: number;
  left: number;
  moveState: MoveState;
}) => {
  const tileHeight = () => {
    return (props.height - 20) / props.gridNumber - 12;
  };
  return (
    <div
      className={`${
        props.moveState === MoveState.moving ? "duration-500" : ""
      } h-min w-min`}
      style={{
        transform: `translate(${props.x * (12 + tileHeight())}px,${
          props.y * (12 + tileHeight())
        }px)`,
      }}
    >
      <div
        className="absolute aspect-square z-10"
        style={{
          height: `${tileHeight()}px`,
          top: `${16 + (12 + tileHeight()) * props.top}px`,
          left: `${16 + (12 + tileHeight()) * props.left}px`,
          borderRadius: `${tileHeight() / 4}px`,
          backgroundColor: `#${(200 - Math.floor(Math.log(props.num)) * 10)
            .toString(16)
            .padStart(2, "0")}${(200 - Math.floor(Math.log(props.num)) * 10)
            .toString(16)
            .padStart(2, "0")}ff`,
        }}
      >
        <div className="flex justify-center items-center h-full">
          <div
            className="text-center text-white"
            style={{ fontSize: `${tileHeight() / 5}px` }}
          >
            {props.num != 0 ? props.num : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

const Grid = (props: {
  tileState: {
    numberTiles: TypeTileState[];
    setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  };
  height: number;
  setHeight: any;
  gridNumber: number;
}) => {
  const TileIDs = Array(props.gridNumber * props.gridNumber)
    .fill(0)
    .map((_, index) => index);
  const targetRef: any = useRef(null);
  useRefHeight({ ref: targetRef, setHeight: props.setHeight });
  return (
    <div className="relative aspect-square bg-teal-200" ref={targetRef}>
      {props.tileState.numberTiles.map((numberTile) => (
        <NumberTile
          key={numberTile.id}
          gridNumber={props.gridNumber}
          height={props.height}
          num={numberTile.num}
          x={numberTile.x}
          y={numberTile.y}
          top={numberTile.top}
          left={numberTile.left}
          moveState={numberTile.moveState}
        />
      ))}
      <div
        className={`grid ${
          props.gridNumber === 4 ? "grid-cols-4" : "grid-cols-5"
        } gap-3 p-4`}
      >
        {TileIDs.map((id) => (
          <Tile key={id} />
        ))}
      </div>
    </div>
  );
};

const Game = () => {
  const [height, setHeight] = useState(80);
  const [gridNumber, setGridNumber] = useState(5);
  const tileState = TileState();
  useKeyDown({
    setNumberTiles: tileState.setNumberTiles,
    gridNumber: gridNumber,
  });
  useTouch({
    setNumberTiles: tileState.setNumberTiles,
    gridNumber: gridNumber,
  });
  useMouse({
    setNumberTiles: tileState.setNumberTiles,
    gridNumber: gridNumber,
  });
  useEffect(() => {
    tileState.setNumberTiles((prev) => {
      const top = getRandomNumber(0, gridNumber - 1);
      const left = getRandomNumber(0, gridNumber - 1);
      return [
        {
          id: 0,
          num: 1000000,
          top: top,
          left: left,
          x: 0,
          y: 0,
          mergeState: MergeState.none,
          moveState: MoveState.notMoving,
        },
      ];
    });
  }, []);
  return (
    <div id="grid">
      <Grid
        tileState={tileState}
        height={height}
        setHeight={setHeight}
        gridNumber={gridNumber}
      />
    </div>
  );
};

const Home = () => {
  return <Game />;
};

export default Home;
