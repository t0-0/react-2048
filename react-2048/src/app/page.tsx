"use client";

import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import getRandomNumber from "@/app/utils/randomNumber";
import { moveUp, moveDown, moveLeft, moveRight } from "@/app/actions/move";
import { MergeState, MoveState } from "@/app/states/enum";
import { TypeTileState } from "@/app/states/tileState";

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

const useKeyDown = (props: {
  setNumberTiles: Dispatch<SetStateAction<TypeTileState[]>>;
  setGridNumber: Dispatch<SetStateAction<number>>;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "ArrowUp") {
        moveUp({
          setNumberTiles: props.setNumberTiles,
          setGridNumber: props.setGridNumber,
        });
      } else if (event.key === "ArrowDown") {
        moveDown({
          setNumberTiles: props.setNumberTiles,
          setGridNumber: props.setGridNumber,
        });
      } else if (event.key === "ArrowLeft") {
        moveLeft({
          setNumberTiles: props.setNumberTiles,
          setGridNumber: props.setGridNumber,
        });
      } else if (event.key === "ArrowRight") {
        moveRight({
          setNumberTiles: props.setNumberTiles,
          setGridNumber: props.setGridNumber,
        });
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
  setGridNumber: Dispatch<SetStateAction<number>>;
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
          moveUp({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
        } else {
          moveDown({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
        }
      } else if (Math.abs(deltaY) < Math.abs(deltaX) && 0 < Math.abs(deltaX)) {
        if (deltaX < 0) {
          moveLeft({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
        } else {
          moveRight({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
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
  setGridNumber: Dispatch<SetStateAction<number>>;
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
          moveUp({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
        } else {
          moveDown({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
        }
      } else if (Math.abs(deltaY) < Math.abs(deltaX) && 0 < Math.abs(deltaX)) {
        if (deltaX < 0) {
          moveLeft({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
        } else {
          moveRight({
            setNumberTiles: props.setNumberTiles,
            setGridNumber: props.setGridNumber,
          });
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
        props.moveState === MoveState.moving ? "duration-[100ms]" : ""
      } h-min w-min`}
      // className="duration-500 h-min w-min"
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
          props.gridNumber === 3 ? "grid-cols-3" : "grid-cols-5"
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
    setGridNumber: setGridNumber,
  });
  useTouch({
    setNumberTiles: tileState.setNumberTiles,
    setGridNumber: setGridNumber,
  });
  useMouse({
    setNumberTiles: tileState.setNumberTiles,
    setGridNumber: setGridNumber,
  });
  useEffect(() => {
    tileState.setNumberTiles((prev) => {
      const top = getRandomNumber(0, gridNumber - 1);
      const left = getRandomNumber(0, gridNumber - 1);
      return [
        {
          id: 0,
          num: 2,
          top: top,
          left: left,
          x: 0,
          y: 0,
          mergeState: MergeState.none,
          moveState: MoveState.notMoving,
        },
      ];
    });
  }, [gridNumber]);
  return (
    <div id="grid">
      <Grid
        tileState={tileState}
        height={height}
        setHeight={setHeight}
        gridNumber={gridNumber}
      />
      <div className="flex justify-center gap-10">
        <button
          className="bg-cyan-100 rounded"
          onClick={() => {
            setGridNumber(3);
          }}
        >
          grid数を3にする
        </button>
        <button
          className="bg-cyan-100 rounded"
          onClick={() => {
            setGridNumber(5);
          }}
        >
          grid数を5にする
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Game />
      <p>
        Inspired by{" "}
        <a
          className="text-blue-500 underline"
          href="https://play2048.co/"
          target="_blank"
        >
          2048
        </a>{" "}
        <a
          className="text-blue-500 underline"
          href="http://gabrielecirulli.com"
          target="_blank"
        >
          Gabriele Cirulli
        </a>{" "}
        created.
      </p>
    </>
  );
};

export default Home;
