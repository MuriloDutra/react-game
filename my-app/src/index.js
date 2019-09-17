    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    

    function Square(props){ //Esta função criará as nove posicões do jogo da velha, retornando uma posição para cada chamada
        return (
            <button className="square" onClick={props.onClick}>
                {props.value} 
            </button>
        );
        //props.onClick é a função handleClick vinda do componente Game
    }
    
    class Board extends React.Component {

        renderSquare(i) {
            /*Esta função faz chamada ao componente Square e irá retornar o mesmo. Passa como props, value que é a posição clicada pelo usuário
             e a função que será executada, quando uma posição do jogo for clicada*/
            return <Square 
                        value={this.props.squares[i]}
                        onClick={() => this.props.onClick(i)}
                        key={i}
                    />;
        }

        createBoard(quantity){
            let elements = [];

            for(let i = 0; i <= quantity; i++)
                elements.push(this.renderSquare(i));
            
            return elements;
        }

        //Fazendo nove chamadas  para renderSquare, para criar as novo posições do jogo da velha e renderizar na tela
        render() {
            let squares = this.createBoard(9);
            let lines = [];
            const retLines = squares.map((square, index) => {
                lines.push(square);
                if((index +1) % 3 == 0){
                    let aux = lines;
                    lines = [];
                    return ( <div key={index}> { aux }</div> );
                }
            });

            return (
                <div>
                    {retLines}
                </div>
            );
        }
    }
    
    class Game extends React.Component {
        constructor(props){
            super(props);       //Passando os parâmetros para o construtor PAI da classe React.Component, 
            this.state = {
                history: [{     //Criando o state para armazenar as jogadas do jogo
                    squares: Array(9).fill(null), //Squares será o vetor responsável por guardar as nove posições do jogo no state
                }],
                stepNumber: 0,  //Para visualizar a jogada que está ocorrendo no momento
                xIsNext: true,  //Responsável por selecionar de quem será a jogada, do 'X' ou 'O'
                positions: [],
                moves: []
            }
        }

        //Função que será executada ao clique do usuário em uma posição. Esta função será passada como prop para o componente Board e consequentemente para Square
        handleClick(i){
            const history = this.state.history.slice(0, this.state.stepNumber + 1); //Recuperando o histórico até o limite da posição do momento/atual
            const current = history[history.length -1]; //Obtendo a confiuguração atual das nove posições
            const squares = current.squares.slice(); //Fazendo uma cópia do array de squares/quadrados atuais
            let positions = this.state.positions;
            
            if(calculateWinner(squares) || squares[i]) //Caso já haja um vencedor ou a posição clicada já tenha sido escolhida
                return;
            
            squares[i] = this.state.xIsNext ? `X` : `O`;//Atualizando a posição que o usuário clicar com o valor 'X' ou 'O'
            positions.push(verifyPosition(i +1));       //Obtendo a posição que o usuário clicou para criar a cronologia de posições clicadas pelo mesmo

            this.setState({
                history: history.concat([{ squares: squares }]),    //Atualizando o histórico, inserindo um novo vetor de square
                stepNumber: history.length,                         //Atualizando a jogada atual
                xIsNext: !this.state.xIsNext,                       //Atualizando de quem é a vez de jogar
                positions: positions,
                moves: this.createListOfPlays(history.length +1)
            });
        }

        jumpTo(step){ //Função utilizada para voltar para as jogadas passadas
            this.setState({
                stepNumber: step,           //Atualiza a jogada atual
                xIsNext: (step % 2) === 0,  //Se o número for par, recebe true
                positions: this.state.positions.slice(0, step),
                moves: this.createListOfPlays(step +1)
            });
        }

        reverse(moves){
            this.setState({
                moves: moves.reverse(),
            });
        }

        createListOfPlays(step){
            const history = this.state.history.slice(0, step);
            const moves = history.map((step, move) => {
                const description = move ? `Go to move # ${move}` : `Go to game start`;
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)} className="btn btn-secondary"> 
                            {description}
                        </button>
                    </li>
                )
            });

            return moves;
        }

        render() {
            let status;
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const current = history[this.state.stepNumber]; //Obtendo a jogada atual
            const winner = calculateWinner(current.squares);//Obtendo vencedor, caso haja
            
            const list = this.state.positions.map((position, index) => { 
                if(index +1 == this.state.stepNumber)
                    return ( <li className="black-word" key={index}> {position} </li> ); //Deixando em negrito as posições da última jogada
                
                return ( <li key={index}> {position} </li> );
            });

            if(winner)
                status = `WINNER: ${winner}`;
            else
                status =  `Player: ${this.state.xIsNext ? `X` : `O`}`;

            return (
                <div className="game">
                    <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                    </div>
                    <div className="game-info">
                        <div className="black-word">{status}</div>
                        <button className="btn btn-primary" onClick={() => this.reverse(this.state.moves)}>Inverter ordem</button>
                        <ol>{this.state.moves}</ol>
                    </div>
                    <div className="position-info">
                        <h4>Posições das jogadas</h4>
                        <ol>{ list }</ol>
                    </div>
                </div>
            );
        }
    }

    function calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
    }

    function verifyPosition(position){
        let column;
        position % 3 == 0 ? column = 3 : column = position % 3; //Se for múltiplo de 3

        if(position >= 1 && position <= 3 && position)
            return `[${column}, 1]`;
    
        if(position >= 4 && position <= 6 && position)
            return `[${column}, 2]`;

        if(position >= 7 && position <= 9 && position)
            return `[${column}, 3]`;
    }
    
    // ========================================
    
    ReactDOM.render(<Game />,document.getElementById('root'));