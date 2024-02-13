const Grid = () => {
  return (
    <div className="aspect-square bg-teal-200">
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
        <div className="col-span-1 aspect-square bg-white"></div>
      </div>
    </div>
  );
};

const Home = () => {
  return <Grid />;
};

export default Home;
