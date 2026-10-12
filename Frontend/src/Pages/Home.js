import WorkPage from "./Home/WorkPage";
import Progress from "./Home/Progress";
import Newsletter from "./Home/Newsletter";
import Hero from "./Home/Hero/Hero";

const Home = () => {
  document.title = `Home - SkCodingSchool`;

  return (
    <>
      <div className="homepage w-full h-full">
        <Hero />
        <WorkPage />
        <Progress />
        <Newsletter />
      </div>
    </>
  );
};

export default Home;
