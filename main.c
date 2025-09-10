#include <stdio.h>
#include <stdlib.h>

#define SIZE 9

void printBoard(char squares[SIZE]) {
    printf("\n");
    for (int i = 0; i < SIZE; i++) {
        printf(" %c ", squares[i] ? squares[i] : ' ');
        if (i % 3 != 2) printf("|");
        if (i % 3 == 2 && i < SIZE - 1) printf("\n---+---+---\n");
    }
    printf("\n\n");
}


char calculateWinner(char squares[SIZE]) {
    int lines[8][3] = {
        {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
        {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
        {0, 4, 8}, {2, 4, 6}
    };

    for (int i = 0; i < 8; i++) {
        int a = lines[i][0], b = lines[i][1], c = lines[i][2];
        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }
    return 0;
}

void playGame() {
    char squares[SIZE] = {0};
    int moveCount = 0;
    int xIsNext = 1;

    while (1) {
        printBoard(squares);
        char winner = calculateWinner(squares);
        if (winner) {
            printf("Winner: %c\n", winner);
            break;
        }
        if (moveCount == SIZE) {
            printf("Match nul !\n");
            break;
        }

        printf("Next player: %c\n", xIsNext ? 'X' : 'O');
        printf("Enter your move (0-8): ");
        int pos;
        scanf("%d", &pos);

        if (pos < 0 || pos >= SIZE || squares[pos]) {
            printf("Invalid move, try again.\n");
            continue;
        }

        squares[pos] = xIsNext ? 'X' : 'O';
        xIsNext = !xIsNext;
        moveCount++;
    }

    printBoard(squares);
}

int main() {
    playGame();
    return 0;
}
