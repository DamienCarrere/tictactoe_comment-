import { useState } from "react"; // On importe useState de React pour gérer les états (ex: historique des coups, joueur courant)

// Composant Square: représente une case du morpion
function Square({ value, onSquareClick }) {
	return (
		<button className="square" onClick={onSquareClick}>
			{" "}
			{/* bouton qui affiche soit X, soit O */}
			{value} {/* valeur affichée dans la case */}
		</button>
	);
}

// Plateau complet avec ses 9 cases
function Board({ xIsNext, squares, onPlay }) {
	// Fonction appelée quand on clique sur une case
	function handleClick(i) {
		// Si on a déjà un gagnant OU que la case est déjà remplie, on ne fait rien
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		// On copie le tableau des cases pour ne pas le modifier directement
		const nextSquares = squares.slice();
		// Selon le joueur courant, on met X ou O dans la case cliquée
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}
		// On envoie le nouveau plateau au composant parent
		onPlay(nextSquares);
	}

	// Vérifie si un joueur a gagné avec le plateau actuel
	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner; // On affiche le gagnant
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O"); // Sinon on affiche qui doit jouer
	}

	return (
		<>
			<div className="status">{status}</div>{" "}
			{/* Affiche le statut du jeu */}
			{/* Chaque ligne du plateau contient 3 cases */}
			<div className="board-row">
				<Square
					value={squares[0]}
					onSquareClick={() => handleClick(0)}
				/>
				<Square
					value={squares[1]}
					onSquareClick={() => handleClick(1)}
				/>
				<Square
					value={squares[2]}
					onSquareClick={() => handleClick(2)}
				/>
			</div>
			<div className="board-row">
				<Square
					value={squares[3]}
					onSquareClick={() => handleClick(3)}
				/>
				<Square
					value={squares[4]}
					onSquareClick={() => handleClick(4)}
				/>
				<Square
					value={squares[5]}
					onSquareClick={() => handleClick(5)}
				/>
			</div>
			<div className="board-row">
				<Square
					value={squares[6]}
					onSquareClick={() => handleClick(6)}
				/>
				<Square
					value={squares[7]}
					onSquareClick={() => handleClick(7)}
				/>
				<Square
					value={squares[8]}
					onSquareClick={() => handleClick(8)}
				/>
			</div>
		</>
	);
}

// Composant principal: gère l’historique et le déroulement du jeu
export default function Game() {
	// history garde en mémoire tous les plateaux successifs (au début un tableau de 9 cases vides)
	const [history, setHistory] = useState([Array(9).fill(null)]);
	// currentMove indique le coup en cours (utile pour revenir en arrière)
	const [currentMove, setCurrentMove] = useState(0);
	// Si le coup actuel est pair => c’est à X de jouer, sinon à O (modulo)
	const xIsNext = currentMove % 2 === 0;
	// Plateau correspondant au coup actuel
	const currentSquares = history[currentMove];

	// Quand on joue un coup, on met à jour l’historique
	function handlePlay(nextSquares) {
		// On coupe l’historique si on avait déjà fait un "retour en arrière"
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory); // On remplace l’historique
		setCurrentMove(nextHistory.length - 1); // On avance le curseur sur le nouveau coup
	}

	// Permet de revenir à un coup précédent
	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	// Génère la liste des coups sous forme de boutons
	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			description = "Go to move #" + move;
		} else {
			description = "Go to game start"; // Si pas de "move", alors on affiche le premier bouton: revenir au début
		}
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>{" "}
				{/* Bouton pour revenir à ce coup */}
			</li>
		);
	});

	return (
		<div className="game">
			<div className="game-board">
				{/* On affiche le plateau actuel */}
				<Board
					xIsNext={xIsNext}
					squares={currentSquares}
					onPlay={handlePlay}
				/>
			</div>
			<div className="game-info">
				{/* Liste des coups possibles pour revenir en arrière */}
				<ol>{moves}</ol>
			</div>
		</div>
	);
}

// Fonction qui vérifie s’il y a un gagnant
function calculateWinner(squares) {
	// Toutes les combinaisons gagnantes possibles
	const lines = [
		[0, 1, 2], // ligne du haut
		[3, 4, 5], // ligne du milieu
		[6, 7, 8], // ligne du bas
		[0, 3, 6], // première colonne
		[1, 4, 7], // deuxième colonne
		[2, 5, 8], // troisième colonne
		[0, 4, 8], // diagonale \
		[2, 4, 6], // diagonale /
	];
	// On boucle sur chaque combinaison
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]; // on récupère les 3 indices
		// Si les 3 cases sont identiques et pas vides alors on a un gagnant
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return squares[a]; // retourne "X" ou "O"
		}
	}
	return null; // pas de gagnant
}
