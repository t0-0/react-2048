"use client";

import { useRef, useEffect, useState } from "react";

const useRefHeight = (ref: any) => {
  const [height, setHeight] = useState(80);
  useEffect(() => {
    const updateHeight = () => {
      if (ref.current != null) {
        setHeight(ref.current!.getBoundingClientRect()["height"]);
      }
    };
    window.addEventListener("resize", updateHeight);
    updateHeight();
    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  return height;
};

const useKeyDown = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "ArrowUp") {
        setY((prev) => prev - 1);
      } else if (event.key === "ArrowDown") {
        setY((prev) => prev + 1);
      } else if (event.key === "ArrowLeft") {
        setX((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        setX((prev) => prev + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return { x: x, y: y };
};

const Tile = () => {
  return <div className="aspect-square bg-white"></div>;
};

const NumberTile = (props: {
  num: number;
  x: number;
  y: number;
  size: number;
  top: number;
  left: number;
}) => {
  const { num, x, y, size, top, left } = props;
  return (
    <div
      className="duration-500 h-min w-min"
      style={{
        transform: `translate(${x}px,${y}px)`,
      }}
    >
      <div
        className="absolute aspect-square bg-black z-10"
        style={{
          height: `${size}px`,
          top: `${top}px`,
          left: `${left}px`,
          borderRadius: `${size / 4}px`,
        }}
      >
        <div className="flex justify-center items-center h-full">
          <div
            className="text-center text-white"
            style={{ fontSize: `${size / 5}px` }}
          >
            {num != 0 ? num : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

const Grid = () => {
  const gridNumber: number = 5;
  const TileIDs = Array(gridNumber * gridNumber)
    .fill(0)
    .map((_, index) => index);
  const numberTiles = [
    { id: 0, num: 2, coord: useKeyDown(), top: 16, left: 16 },
  ];
  const targetRef: any = useRef(null);
  const height = useRefHeight(targetRef);
  const tileHeight = () => {
    return (height - 20) / gridNumber - 12;
  };
  return (
    <>
      <div className="relative aspect-square bg-teal-200" ref={targetRef}>
        {numberTiles.map((numberTile) => (
          <NumberTile
            key={numberTile.id}
            num={numberTile.num}
            x={numberTile.coord.x * (12 + tileHeight())}
            y={numberTile.coord.y * (12 + tileHeight())}
            size={tileHeight()}
            top={numberTile.top}
            left={numberTile.left}
          />
        ))}
        <div
          className={`grid ${
            gridNumber === 4 ? "grid-cols-4" : "grid-cols-5"
          } gap-3 p-4`}
        >
          {TileIDs.map((id) => (
            <Tile key={id} />
          ))}
        </div>
      </div>
    </>
  );
};

const Home = () => {
  return <Grid />;
};

export default Home;
