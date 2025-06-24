import Dashboard from "./components/pages/Dashboard.jsx";
import Diary from "./components/pages/Diary.jsx";
import Calender from "./components/pages/Calender.jsx";
import ContentRecommendations from "./components/pages/ContentRecommendations.jsx";
import Journal from "./components/pages/Journal.jsx";
import Charts from "./components/pages/Charts.jsx";
import Settings from "./components/pages/Settings.jsx";

function App() {
  return (
    <>
        <Dashboard/>
        <Diary/>
        <Calender/>
        <ContentRecommendations/>
        <Journal/>
        <Charts/>
        <Settings/>
    </>
  )
}

export default App
