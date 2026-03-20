import WorldMap from '../WorldMap';
import ThemeContext from "../../contexts/ThemeContext"
import { useContext } from "react"

const MapPage = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];

  return <div className={`map-page-wrapper-${theme}`}>
    {/* TODO: Maybe add a sidebar here */}
    <WorldMap />
  </div>
};

export default MapPage;