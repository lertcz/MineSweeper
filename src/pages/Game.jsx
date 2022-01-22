import React, { useState, useEffect, useReducer } from "react";
import Board from "../components/Board/board";

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import GitHubIcon from '@mui/icons-material/GitHub';
import "../index.css"

let BOMBS = 10
let diffVal = 0

const DIFFICULTY = [
  {
    value: 0,
    label: "Easy",
    size: [8, 8],
    style: 'E grid grid-cols-8',
    bombs: 10
  },
  {
    value: 1,
    label: "MEDIUM",
    size: [16, 16],
    style: 'M',
    bombs: 40
  },
  {
    value: 2,
    label: "HARD",
    size: [16, 30],
    style: 'H',
    bombs: 99
  }
]

function valuetext(value) {
  diffVal = DIFFICULTY[value].value
  BOMBS = DIFFICULTY[value].bombs
}

function valueLabelFormat(value) {
  return DIFFICULTY[value].label
}

function Game() {
  //Array.from(Array(2), () => new Array(4))
  //2 and 4 being first and second dimensions respectively.
  const [tiles, setTiles] = useState( Array.from(Array(64), () => Array.from([false, false, false, 0]) ) ) //flagged bomb discovered neighbours
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [Flags, setFlags] = useState(BOMBS)
  const [correctGuess, setCG] = useState(0)
  const [WIN, setWIN] = useState(null)

  function revealTileAndTilesAround(i) {
    let rowSize = DIFFICULTY[diffVal].size[0]
    let colSize = DIFFICULTY[diffVal].size[1]
    let row = Math.floor(i / colSize)
    let col = i % colSize

    //self
    if(!tiles[i][0]) { // dont reveal tile if it is flagged
      tiles[i][2] = true
    }

    //surroundings
    if(tiles[i][3] === 0) {
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          let position = ((row+r) * colSize + col+c) // flatten the array again
          let notSelf = (r !== 0 || c !== 0) // not pointing on it self
          let indexInBounds = 0 <= row+r && row+r <= (rowSize-1) && 0 <= col+c && col+c <= (colSize-1) // check if the index is in bounds

          if(indexInBounds && notSelf) {  // compare all limits
            if(!tiles[position][2]) { // check if tile is not found
              revealTileAndTilesAround(position)
            }
          }
        }
      }
    }
  }

  function flagTile(i) {
    if(!tiles[i][2]) {
      tiles[i][0] = !tiles[i][0]

      // change flag count
      if(!tiles[i][0]) { //not flagged
        setFlags(Flags + 1)

        if(tiles[i][1]) { // increment correct guesses if tile is a bomb
          setCG(correctGuess - 1)
        }
      }
      else {
        setFlags(Flags - 1)

        if(tiles[i][1]) { // decrement correct guesses if tile is a bomb
          setCG(correctGuess + 1)
        }
      }
    }
  }

  function revealBombs() {
    for(let i = 0; i < tiles.length; i++) {
      if(tiles[i][1] && !tiles[i][2]) { // if tile is bomb and is not discovered
        if(!tiles[i][0]){ // not flagged
          tiles[i][2] = true // reveal tile
        }
      }

      if(tiles[i][0] && !tiles[i][1]) {
        tiles[i][2] = true
        tiles[i][3] = "❌"
      }
    }
    setWIN("You lost!")
  }

  function handleLeftClick(i) {
    if(!tiles[i][0] && !WIN) {
      if(tiles[i][1]) {
        revealBombs()
        tiles[i][3] = "💥"
      }
      else{
        revealTileAndTilesAround(i)
      }
    }
    
    forceUpdate()
  }
  
  function handleRightClick(i, e) {
    e.preventDefault()
    if(!WIN){
      flagTile(i)
    }

    forceUpdate()
  }

  function restart() {
    let size = DIFFICULTY[diffVal].size
    let sum = size[0] * size[1]
    setTiles(Array.from(Array(sum), () => Array.from([false, false, false, 0])))
    setFlags(BOMBS)
    setCG(0)
    setWIN(null)
  }

  //display if the player win the game
  useEffect(() => {
    function checkIfPlayerWin() {
      if(correctGuess === BOMBS && Flags === 0) {
        setWIN("You won!")
      }
    }

    checkIfPlayerWin()
  },[Flags, correctGuess]);

  useEffect(() => {
    function plantBombs(bombCount) {
      let bombs = 0
      while(bombs < bombCount) {
        let randNum = Math.floor(Math.random() * tiles.length)
  
        if(!tiles[randNum][1]) {
          tiles[randNum][1] = true
          bombs += 1
        }
      }
  
    }
  
    function findCloseBombs() {
      let rowSize = DIFFICULTY[diffVal].size[0]
      let colSize = DIFFICULTY[diffVal].size[1]

      for(let i = 0; i < tiles.length; i++) {
        let row = Math.floor(i / colSize)
        let col = i % colSize
  
        let count = 0
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            let position = ((row+r) * colSize + col+c) // flatten the array again
            //let notSelf = (r !== 0 || c !== 0) // not pointing on it self
            let indexInBounds = 0 <= row+r && row+r <= (rowSize-1) && 0 <= col+c && col+c <= (colSize-1) // check if the index is in bounds
            if(indexInBounds) {  // compare all limits
              if(tiles[position][1]) { 
                count += 1
              }
            }
          }
        }
        tiles[i][3] = count // set the amount of bombs nearby
      }
    }

    plantBombs(BOMBS)
    findCloseBombs()

    forceUpdate()
  },[tiles]);

  return (
    <div className="w-screen h-screen">
      
      <div className="absolute bottom-3 right-3 align-middle"> {/* Creator info */}
        <div className="centerItems">
          <GitHubIcon
          className="hover:scale-125"
          onClick={() => window.open("https://github.com/lertcz/MineSweeper")}
          />

          <h1 className="text-xs pl-4">
            Created by Michal Šesták
          </h1>
        </div>
      </div>

      <div className="centerItems"> {/* Title */}
        <h1 className="Title unselectable">Game of minesweeper</h1>
      </div>

      <div className="centerItems"> {/* Mines */}
        <h1 className="Mines unselectable">{"Mines left: " + String(Flags)}</h1>
      </div>

      <div className="centerItems"> {/* Board */}
        <div className={DIFFICULTY[diffVal].style}>
          <Board tiles={tiles} handleLeftClick={handleLeftClick} handleRightClick={handleRightClick} />
        </div>
      </div>
      
      <div className="sideBar"> {/* side bar */}

        <div className="centerItems"> {/* Slider */}
          <Box sx={{ width: 300 }}>
            <Slider
              aria-label="Difficulty"
              defaultValue={0}
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={valuetext}
              step={1}
              valueLabelDisplay="auto"
              //marks={DIFFICULTY}
              min={0}
              max={2}
            />
          </Box>
        </div>

        <div className="centerItems"> {/* Restart */}
          <button className="Button" onClick={restart}>Restart</button>
        </div>
        
        <div className="centerItems"> {/* Win */}
          {/* set syle if you won or lost the game */}
          <h1 className={WIN ? (WIN === "You won!" ? "Win bg-green-500" : "Win bg-red-600") : ""}>{WIN}</h1>
        </div>
      </div>
    </div>
  );
}

export default Game;
