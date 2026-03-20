import RenderWorldMap from '../RenderWorldMap';
import ThemeContext from "../../contexts/ThemeContext"
import { useContext } from "react"

const WorldMap = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];

  return <div className={`map-page-wrapper-${theme}`}>
    <RenderWorldMap />
  </div>
};

export default WorldMap;