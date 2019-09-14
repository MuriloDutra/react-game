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
                    />;
        }

        createBoard(quantity){
            let elements = [];
            for(var i = 1; i <= quantity; i++){
                elements.push(this.renderSquare(i));
            }
        }

        //Fazendo nove chamadas  para renderSquare, para criar as novo posições do jogo da velha e renderizar na tela
        render() {
            return (
              //CONTINUAR  
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
            });
        }

        jumpTo(step){ //Função utilizada para voltar para as jogadas passadas
            console.log(step);
            this.setState({
                stepNumber: step,           //Atualiza a jogada atual
                xIsNext: (step % 2) === 0,  //Se o número for par, recebe true
                positions: this.state.positions.slice(0, step),
            });
        }

        render() {
            let status;
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const current = history[this.state.stepNumber]; //Obtendo a jogada atual
            const winner = calculateWinner(current.squares);//Obtendo vencedor, caso haja
            const moves = history.map((step, move) => {
                const description = move ? `Go to move # ${move}` : `Go to game start`;
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}> 
                            {description}
                        </button>
                    </li>
                )
            });

            const list = this.state.positions.map((position, index) => { 
                if(index +1 == this.state.stepNumber)
                    return ( <li className="black-word" key={index}> {position} </li> ); //Deixando em negrito as posições da última jogada
                
                return ( <li key={index}> {position} </li> );
            });

            if(winner)
                status = `WINNER: ${winner}`;
            else
                status =  `Next player: ${this.state.xIsNext ? `X` : `O`}`;

            return (
                <div className="game">
                    <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{moves}</ol>
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