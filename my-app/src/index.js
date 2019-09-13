    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    
    /*class Position extends React.Component{
        constructor(props){
            super(props);
            this.state = { step: Array(9).fill(null), stepNumber: 0 }
        }

        fillArrayPositions(){
            let positions = verifyPositions(this.props.value);
        
            let array = positions.map((position) => {
                if(position)
                    return position;
            });

            let list = array.map((position) => {
                return ( <li key={}>{position}</li> )
            });

            return list;
        }

        render(){
            let list = this.fillArrayPositions();
            return(
                <div>
                    <h4>Posições dos cliques</h4>
                    <ol>{list}</ol>
                </div>
            )
        }
    }*/

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
        
        //Fazendo nove chamadas  para renderSquare, para criar as novo posições do jogo da velha e renderizar na tela
        render() {
            return (
                <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
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
            }
        }

        //Função que será executada ao clique do usuário em uma posição. Esta função será passada como prop para o componente Board e consequentemente para Square
        handleClick(i){ 
            const history = this.state.history.slice(0, this.state.stepNumber + 1); //Recuperando o histórico até o limite da posição do momento/atual
            const current = history[history.length -1]; //Obtendo a confiuguração atual das nove posições
            const squares = current.squares.slice(); //Fazendo uma cópia do array de squares/quadrados atuais
            const positions = this.state.positions;

            if(calculateWinner(squares) || squares[i]) //Caso já haja um vencedor ou a posição clicada já tenha sido escolhida
                return;
            
            squares[i] = this.state.xIsNext ? `X` : `O`; //Atualizando a posição que o usuário clicar com o valor
            positions.push(i +1);
            console.log(verifyPositions(positions));

            this.setState({
                history: history.concat([{ squares: squares }]),    //Atualizando o histórico, inserindo um novo vetor de square
                stepNumber: history.length,                         //Atualizando a jogada atual
                xIsNext: !this.state.xIsNext,                       //Atualizando de quem é a vez de jogar
                positions: positions,
            });
        }

        jumpTo(step){ //Função utilizada para voltar para as jogadas passadas
            this.setState({
                stepNumber: step,           //Atualiza a jogada atual
                xIsNext: (step % 2) === 0,  //Se o número for par, recebe true
            });
        }

        render() {
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

            let status;

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
                        <ol></ol>
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

    function verifyPositions(positions){
        let ret = [];
        let column;
        positions.forEach((position) => {
            position % 3 == 0 ? column = 3 : column = position % 3; //Se for múltiplo de 3, 

            if(position >= 1 && position <= 3 && position)
                ret.push(`[1,${column}]`);
        
            if(position >= 4 && position <= 6 && position)
                ret.push(`[2,${column}]`);

            if(position >= 7 && position <= 9 && position)
                ret.push(`[3,${column}]`);
        });

        return ret;
    }
    
    // ========================================
    
    ReactDOM.render(<Game />,document.getElementById('root'));