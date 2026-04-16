# Sudoku Game with Simulated DBMS

A full-stack style web application featuring a classic Sudoku experience with persistent score tracking.

## 📝 Problem Statement
Traditional paper Sudoku lacks interactivity and progress tracking. This digital version solves the issue of permanent mistakes and provides a way to store historical performance data without a complex back-end.

## 🎯 Objectives
* **Dynamic Logic:** Generate puzzles across 4 difficulty levels.
* **Algorithmic Solving:** Use a backtracking algorithm to ensure solvability.
* **Data Persistence:** Simulate a relational database using `localStorage`.
* **User Stats:** Track mistakes, time, and high scores.

## 🏗️ System Architecture
The project follows a modular 3-tier structure:
* **Frontend:** Responsive HTML5/CSS3 Grid.
* **Logic:** JavaScript engine managing game states and recursive validation.
* **Storage:** Pseudo-relational DBMS using JSON objects in the browser's local storage.

## 🚀 How to Play
1. Select a difficulty (Beginner to Hard).
2. Click "New Game."
3. Click a cell and use your keyboard or the on-screen numpad to enter numbers.
4. Try to finish without making 3 mistakes!
