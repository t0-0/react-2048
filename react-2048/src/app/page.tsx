"use client";

import { useRef, useEffect } from "react";

const Tile = (props: { num: number }) => {
  const targetRef: any = useRef(null);
  const num = props.num;
  useEffect(() => {
    if (targetRef.current != null) {
      console.log(targetRef.current!.getBoundingClientRect()["x"]);
    }
  });
  return (
    <div className="aspect-square bg-white" ref={targetRef}>
      <div className="flex justify-center items-center h-full">
        <div className="text-center text-xl">{num != 0 ? num : ""}</div>
      </div>
    </div>
  );
};

const Grid = () => {
  const gridNumber: number = 5;
  const Tiles = Array(gridNumber * gridNumber).fill(0);
  return (
    <div className="aspect-square bg-teal-200">
      <div
        className={`grid ${
          gridNumber === 3 ? "grid-cols-3" : "grid-cols-5"
        } gap-3 p-4`}
      >
        {Tiles.map((tile) => (
          <Tile key={tile} num={tile} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  return <Grid />;
};

export default Home;
