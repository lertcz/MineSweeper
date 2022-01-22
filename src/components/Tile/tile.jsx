import React from "react";
import "./tile.css"

//🚩💣
function Tile(props) {
    //flagged bomb discovered neighbours

    let theme = props.value[2] ? "tile discovered" : "tile undiscovered"

    let content
    if(props.value[2]) { // if discovered
        content = (props.value[3] === 0) ? null : props.value[3] // set it to be invisible else to neighbour count
        if(props.value[1]) {// draw bomb if discovered
            content = "💣"
        }
    }
    /* else if(props.value[1]) { // draw bomb hehe
        content = "💣"
    } */
    else { // draw flag if the tile is flagged
        content = props.value[0] ? "🚩" : null
    }

    return (
        <button
        className={theme}
        onClick={() => props.handleLeftClick(props.index)}
        onContextMenu={(e) => props.handleRightClick(props.index, e)}>
            {content}
        </button>
    );
  }
  
  export default Tile;