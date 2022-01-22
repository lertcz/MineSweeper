import React, { useState, useEffect, useReducer } from "react";
import Board from "../components/Board/board";
import "../index.css"

const BOMBS = 10

function Game() {
  //Array.from(Array(2), () => new Array(4))
  //2 and 4 being first and second dimensions respectively.
  const [tiles] = useState( Array.from(Array(64), () => Array.from([false, false, false, 0]) ) ) //flagged bomb discovered neighbours
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [Flags, setFlags] = useState(BOMBS)
  const [correctGuess, setCG] = useState(0)

  function revealTileAndTilesAround(i) {
    let row = Math.floor(i / 8)
    let col = i % 8

    //self
    if(!tiles[i][0]) { // dont reveal tile if it is flagged
      tiles[i][2] = true
    }

    //surroundings
    if(tiles[i][3] === 0) {
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          let position = ((row+r) * 8 + col+c) // flatten the array again
          let notSelf = (r !== 0 || c !== 0) // not pointing on it self
          let indexInBounds = 0 <= row+r && row+r <= 7 && 0 <= col+c && col+c <= 7 // check if the index is in bounds

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
      if(tiles[i][0]) { 
        setFlags(Flags - 1)
      }
      else {
        setFlags(Flags + 1)
      }

      // correct flag placement
      if(tiles[i][0] && tiles[i][1]) { // increment correct guesses if tile is bomb
        setCG(correctGuess + 1)
      }
      else if(!tiles[i][0] && tiles[i][1]) { // decrement correct guesses if the flag is removed
        setCG(correctGuess - 1)
      }
    }
  }

  function revealBombs() {
    for(let i = 0; i < 64; i++) {
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
    alert("You lost the game\nrestart the page")
  }

  function checkIfPlayerWin() {
    if(correctGuess === BOMBS-1) {
      alert("You won the game\nrestart the page")
    }
  }

  function handleLeftClick(i) {
    if(!tiles[i][0]) {
      if(tiles[i][1]) {
        revealBombs()
      }
      else{
        revealTileAndTilesAround(i)
      }
    }
    
    forceUpdate()
  }
  
  function handleRightClick(i, e) {
    e.preventDefault()
    flagTile(i)

    checkIfPlayerWin()

    forceUpdate()
  }

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
      for(let i = 0; i < 64; i++) {
        let row = Math.floor(i / 8)
        let col = i % 8
  
        let count = 0
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            let position = ((row+r) * 8 + col+c) // flatten the array again
            let notSelf = (r !== 0 || c !== 0) // not pointing on it self
            let indexInBounds = 0 <= row+r && row+r <= 7 && 0 <= col+c && col+c <= 7 // check if the index is in bounds

            if(indexInBounds && notSelf) {  // compare all limits
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
      <div className="centerItems">
        <h1>Game of minesweeper</h1>
      </div>

      <div className="centerItems">
        <h2>{"Mines left: " + String(Flags)}</h2>
      </div>

      <div className="centerItems">
        <div className="BOARD grid grid-rows-8 grid-cols-8">
          <Board tiles={tiles} handleLeftClick={handleLeftClick} handleRightClick={handleRightClick} />
        </div>
      </div>
    </div>
  );
}

export default Game;
