// ============================================================
//  SUDOKU GAME — script.js
//  DBMS Layer: localStorage simulates a relational scores table
//  Schema: scores { id, difficulty, score, time, mistakes, date }
// ============================================================

// ── Puzzle Bank ─────────────────────────────────────────────
// Beginner: 60 filled → 21 empty
// Easy:     55 filled → 26 empty
// Medium:   41 filled → 40 empty
// Hard:     33 filled → 48 empty

// Full solved grids — we remove cells programmatically to hit exact counts
const SOLVED_GRIDS = [
  [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ],
  [
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
  ],
  [
    [8,2,7,1,5,4,3,9,6],
    [9,6,5,3,2,7,1,4,8],
    [3,4,1,6,8,9,7,5,2],
    [5,9,3,4,6,8,2,7,1],
    [4,7,2,5,1,3,6,8,9],
    [6,1,8,9,7,2,4,3,5],
    [7,8,6,2,3,5,9,1,4],
    [1,5,4,7,9,6,8,2,3],
    [2,3,9,8,4,1,5,6,7]
  ]
];

// Returns a puzzle with exactly `emptyCount` cells removed
function makePuzzle(solvedGrid, emptyCount) {
  const flat = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      flat.push([r, c]);
  // Shuffle positions
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }
  const puzzle = solvedGrid.map(row => [...row]);
  for (let i = 0; i < emptyCount; i++) {
    const [r, c] = flat[i];
    puzzle[r][c] = 0;
  }
  return puzzle;
}

const EMPTY_COUNTS = { beginner: 21, easy: 26, medium: 40, hard: 48 };

const PUZZLE_SETS = {
  beginner: [
    makePuzzle(SOLVED_GRIDS[0], 21),
    makePuzzle(SOLVED_GRIDS[1], 21),
    makePuzzle(SOLVED_GRIDS[2], 21)
  ],
  easy: [
    makePuzzle(SOLVED_GRIDS[0], 26),
    makePuzzle(SOLVED_GRIDS[1], 26),
    makePuzzle(SOLVED_GRIDS[2], 26)
  ],
  medium: [
    [
      [0,0,0,2,6,0,7,0,1],
      [6,8,0,0,7,0,0,9,0],
      [1,9,0,0,0,4,5,0,0],
      [8,2,0,1,0,0,0,4,0],
      [0,0,4,6,0,2,9,0,0],
      [0,5,0,0,0,3,0,2,8],
      [0,0,9,3,0,0,0,7,4],
      [0,4,0,0,5,0,0,3,6],
      [7,0,3,0,1,8,0,0,0]
    ],
    [
      [3,0,6,5,0,8,4,0,0],
      [5,2,0,0,0,0,0,0,0],
      [0,8,7,0,0,0,0,3,1],
      [0,0,3,0,1,0,0,8,0],
      [9,0,0,8,6,3,0,0,5],
      [0,5,0,0,9,0,6,0,0],
      [1,3,0,0,0,0,2,5,0],
      [0,0,0,0,0,0,0,7,4],
      [0,0,5,2,0,6,3,0,0]
    ],
    [
      [0,2,0,0,0,0,0,0,0],
      [0,0,0,6,0,0,0,0,3],
      [0,7,4,0,8,0,0,0,0],
      [0,0,0,0,0,3,0,0,2],
      [0,8,0,0,4,0,0,1,0],
      [6,0,0,5,0,0,0,0,0],
      [0,0,0,0,1,0,7,8,0],
      [5,0,0,0,0,9,0,0,0],
      [0,0,0,0,0,0,0,4,0]
    ]
  ],
  hard: [
    [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,3,0,8,5],
      [0,0,1,0,2,0,0,0,0],
      [0,0,0,5,0,7,0,0,0],
      [0,0,4,0,0,0,1,0,0],
      [0,9,0,0,0,0,0,0,0],
      [5,0,0,0,0,0,0,7,3],
      [0,0,2,0,1,0,0,0,0],
      [0,0,0,0,4,0,0,0,9]
    ],
    [
      [8,0,0,0,0,0,0,0,0],
      [0,0,3,6,0,0,0,0,0],
      [0,7,0,0,9,0,2,0,0],
      [0,5,0,0,0,7,0,0,0],
      [0,0,0,0,4,5,7,0,0],
      [0,0,0,1,0,0,0,3,0],
      [0,0,1,0,0,0,0,6,8],
      [0,0,8,5,0,0,0,1,0],
      [0,9,0,0,0,0,4,0,0]
    ],
    [
      [0,0,0,2,0,0,0,0,0],
      [0,8,0,0,0,7,0,9,0],
      [0,0,0,0,4,0,0,0,0],
      [3,0,0,0,0,0,0,0,8],
      [0,0,2,0,0,0,5,0,0],
      [7,0,0,0,0,0,0,0,6],
      [0,0,0,0,5,0,0,0,0],
      [0,4,0,3,0,0,0,2,0],
      [0,0,0,0,0,8,0,0,0]
    ]
  ]
};



// ── Config ───────────────────────────────────────────────────
const MAX_MISTAKES = 3;

// ── State ───────────────────────────────────────────────────
let puzzle    = [];
let solution  = [];
let userGrid  = [];
let selected  = null;
let mistakes  = 0;
let timerSec  = 0;
let timerInt  = null;
let gameActive = false;

// ── Utilities ───────────────────────────────────────────────
function deepCopy(arr) { return arr.map(row => [...row]); }

function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (grid[br + r][bc + c] === num) return false;
  return true;
}

function findEmpty(grid) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (grid[r][c] === 0) return [r, c];
  return null;
}

function solveSudoku(grid) {
  const empty = findEmpty(grid);
  if (!empty) return true;
  const [r, c] = empty;
  for (let n = 1; n <= 9; n++) {
    if (isValid(grid, r, c, n)) {
      grid[r][c] = n;
      if (solveSudoku(grid)) return true;
      grid[r][c] = 0;
    }
  }
  return false;
}

// ── Timer ───────────────────────────────────────────────────
function startTimer() {
  clearInterval(timerInt);
  timerSec = 0;
  timerInt = setInterval(() => {
    timerSec++;
    const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
    const s = String(timerSec % 60).padStart(2, '0');
    document.getElementById('timer').textContent = m + ':' + s;
  }, 1000);
}

function getTimerStr() {
  const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const s = String(timerSec % 60).padStart(2, '0');
  return m + ':' + s;
}

// ── Game Control ────────────────────────────────────────────
function newGame() {
  const diff = document.getElementById('diff').value;
  let pick;
  if (diff === 'beginner' || diff === 'easy') {
    const grid = SOLVED_GRIDS[Math.floor(Math.random() * SOLVED_GRIDS.length)];
    pick = makePuzzle(grid, EMPTY_COUNTS[diff]);
  } else {
    const set = PUZZLE_SETS[diff];
    pick = deepCopy(set[Math.floor(Math.random() * set.length)]);
  }
  puzzle   = deepCopy(pick);
  solution = deepCopy(pick);
  solveSudoku(solution);
  userGrid = deepCopy(puzzle);
  selected  = null;
  mistakes  = 0;
  gameActive = true;
  document.getElementById('mistakes').textContent = '0 / ' + MAX_MISTAKES;
  document.getElementById('mistakes').style.color = '';
  document.getElementById('score').textContent    = '0';
  // Count givens and show difficulty hint
  const givens = pick.flat().filter(v => v !== 0).length;
  const diffHint = { beginner: '60 clues — Beginner', easy: '55 clues — Easy', medium: '41 clues — Intermediate', hard: '33 clues — Expert' }[diff];
  hideMsg();
  showMsg('Level: ' + diff.toUpperCase() + ' · ' + diffHint, 'info');
  startTimer();
  renderBoard();
  renderNumpad();
}

function gameOver() {
  gameActive = false;
  clearInterval(timerInt);
  renderBoard();
  showMsg('Game Over! You made 3 mistakes. Restarting in 3 seconds...', 'err');
  document.getElementById('mistakes').style.color = '#f87171';
  setTimeout(() => { newGame(); }, 3000);
}

function clearSelected() {
  if (!selected) return;
  const [r, c] = selected;
  if (puzzle[r][c] === 0) { userGrid[r][c] = 0; renderBoard(); }
}

function inputNum(n) {
  if (!selected || !gameActive) return;
  const [r, c] = selected;
  if (puzzle[r][c] !== 0) return;
  userGrid[r][c] = n;
  if (n !== solution[r][c]) {
    mistakes++;
    document.getElementById('mistakes').textContent = mistakes + ' / ' + MAX_MISTAKES;
    if (mistakes >= MAX_MISTAKES) {
      gameOver();
      return;
    }
  }
  renderBoard();
  checkWin();
}

function checkBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, i) => {
    const r = Math.floor(i / 9), c = i % 9;
    cell.classList.remove('error', 'correct');
    if (userGrid[r][c] !== 0 && puzzle[r][c] === 0) {
      if (userGrid[r][c] !== solution[r][c]) cell.classList.add('error');
      else cell.classList.add('correct');
    }
  });
}

function solve() {
  if (!gameActive) return;
  userGrid = deepCopy(solution);
  gameActive = false;
  clearInterval(timerInt);
  renderBoard();
  showMsg('Puzzle auto-solved! No score recorded.', 'err');
}

function checkWin() {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (userGrid[r][c] !== solution[r][c]) return;

  gameActive = false;
  clearInterval(timerInt);
  const diff = document.getElementById('diff').value;
  const base  = { beginner: 50, easy: 100, medium: 200, hard: 400 }[diff];
  const score = Math.max(10, base - mistakes * 10 - Math.floor(timerSec / 10));
  document.getElementById('score').textContent = score;
  showMsg(`Congratulations! Solved in ${getTimerStr()} with ${mistakes} mistake(s). Score: ${score}`, 'win');
  dbSaveScore(diff, score, getTimerStr(), mistakes);
  renderLeaderboard();
}

// ── Render ──────────────────────────────────────────────────
function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const val = userGrid[r][c];
      if (val !== 0) cell.textContent = val;
      const isGiven = puzzle[r][c] !== 0;
      if (isGiven) cell.classList.add('given');
      else if (val !== 0) cell.classList.add('user');
      if (selected) {
        const [sr, sc] = selected;
        if (sr === r && sc === c) cell.classList.add('selected');
        else if (sr === r || sc === c ||
          (Math.floor(sr/3)===Math.floor(r/3) && Math.floor(sc/3)===Math.floor(c/3)))
          cell.classList.add('highlight');
      }
      if ((c + 1) % 3 === 0 && c < 8) cell.classList.add('border-r');
      if ((r + 1) % 3 === 0 && r < 8) cell.classList.add('border-b');
      cell.addEventListener('click', () => { selected = [r, c]; renderBoard(); });
      board.appendChild(cell);
    }
  }
}

function renderNumpad() {
  const np = document.getElementById('numpad');
  np.innerHTML = '';
  for (let n = 1; n <= 9; n++) {
    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.textContent = n;
    btn.addEventListener('click', () => inputNum(n));
    np.appendChild(btn);
  }
}

// ── Messages ────────────────────────────────────────────────
function showMsg(text, type) {
  const el = document.getElementById('msg');
  el.textContent = text;
  el.className = 'msg show ' + type;
}
function hideMsg() {
  document.getElementById('msg').className = 'msg';
}

// ── DBMS Layer (localStorage) ───────────────────────────────
// Simulates a relational table:
//   TABLE scores (
//     id        INTEGER PRIMARY KEY,
//     difficulty TEXT,
//     score     INTEGER,
//     time      TEXT,
//     mistakes  INTEGER,
//     date      TEXT
//   )
const DB_KEY = 'sudoku_scores_db';

function dbSaveScore(difficulty, score, time, mistakes) {
  let records = dbGetAll();
  const newRecord = {
    id: Date.now(),          // auto-increment-like unique ID
    difficulty,
    score,
    time,
    mistakes,
    date: new Date().toLocaleDateString('en-IN')
  };
  records.push(newRecord);
  // ORDER BY score DESC — keep top 10 (like SQL LIMIT 10)
  records.sort((a, b) => b.score - a.score);
  records = records.slice(0, 10);
  localStorage.setItem(DB_KEY, JSON.stringify(records));
}

function dbGetAll() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  } catch {
    return [];
  }
}

function dbClearAll() {
  localStorage.removeItem(DB_KEY);
  renderLeaderboard();
}

function renderLeaderboard() {
  const records = dbGetAll();
  const lb = document.getElementById('leaderboard');
  if (!records.length) {
    lb.innerHTML = '<div class="lb-empty">No records yet — complete a puzzle to save your score!</div>';
    return;
  }
  const rankClass = ['gold', 'silver', 'bronze'];
  lb.innerHTML = records.map((r, i) => `
    <div class="lb-row">
      <span class="lb-rank ${rankClass[i] || ''}">#${i + 1}</span>
      <span class="lb-diff ${r.difficulty}">${r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}</span>
      <span class="lb-info">${r.time} &nbsp;·&nbsp; ${r.mistakes} err &nbsp;·&nbsp; ${r.date}</span>
      <span class="lb-score">${r.score}</span>
    </div>
  `).join('');
}

// ── Keyboard Input ───────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key >= '1' && e.key <= '9') inputNum(parseInt(e.key));
  if (e.key === 'Backspace' || e.key === 'Delete') clearSelected();
  if (e.key === 'ArrowUp'    && selected) { selected[0] = Math.max(0, selected[0]-1); renderBoard(); }
  if (e.key === 'ArrowDown'  && selected) { selected[0] = Math.min(8, selected[0]+1); renderBoard(); }
  if (e.key === 'ArrowLeft'  && selected) { selected[1] = Math.max(0, selected[1]-1); renderBoard(); }
  if (e.key === 'ArrowRight' && selected) { selected[1] = Math.min(8, selected[1]+1); renderBoard(); }
});

// ── Init ─────────────────────────────────────────────────────
newGame();
renderLeaderboard();
