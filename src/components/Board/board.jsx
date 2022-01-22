import Tile from "../Tile/tile";

function Board(props) {
    return (
        props.tiles.map((tile, i) => 
        <Tile 
        key={i} 
        index={i} 
        value={tile} 
        handleLeftClick={props.handleLeftClick}
        handleRightClick={props.handleRightClick}
        ></Tile>)
    );
  }
  
  export default Board;