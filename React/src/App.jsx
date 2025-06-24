import Dashboard from "./components/pages/Dashboard.jsx";
import Diary from "./components/pages/Diary.jsx";
import Calender from "./components/pages/Calender.jsx";
import ContentRecommendation from "./components/pages/ContentRecommendation.jsx";
import Journal from "./components/pages/Journal.jsx";
import Chart from "./components/pages/Chart.jsx";
import Settings from "./components/pages/Settings.jsx";

function App() {
  return (
    <>
        <Dashboard/>
        <Diary/>
        <Calender/>
        <ContentRecommendation/>
        <Journal/>
        <Chart/>
        <Settings/>
    </>
  )
}

export default App
