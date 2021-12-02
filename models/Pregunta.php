<?php

namespace models;

use JsonSerializable;
use Exception;

class Pregunta  implements JsonSerializable {
    
    private $id;

    private $difficulty;

    private $question;

    private $correct_answer;

    private $incorrect_answers;

    public function __construct(int $id = 0, string $difficulty = '', string $question='', string $correct_answer='', array $incorrect_answers=[]){
        $this->id = $id;
        $this->difficulty = $difficulty;
        $this->question = $question;
        $this->correct_answer = $correct_answer;
        $this->incorrect_answers = $incorrect_answers;
    }

    public function getId(): int{
        return $this->id;
    }

    public function getDifficulty():string{
        return $this->difficulty;
    }

    public function getQuestion():string{
        return $this->question;
    }

    public function getCorrect_answer():string{
        return $this->correct_answer;
    }

    public function getIncorrect_answers():array{
        return $this->incorrect_answers;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function setDifficulty(string $difficulty): void {
        $this->difficulty = $difficulty;
    }

    public function setQuestion(string $question): void {
        $this->question = $question;
    }

    public function setCorrect_answer(string $correct_answer): void {
        $this->correct_answer = $correct_answer;
    }

    public function setIncorrect_answers(array $incorrect_answers): void {
        $this->incorrect_answers = $incorrect_answers;
    }

    public function addIncorrect_answers(string $incorrect_answer):void {
        array_push($this->incorrect_answers, $incorrect_answer);
    }

    public function jsonSerialize(): array {
        return get_object_vars($this);
    }

    /**************************** Metodos BD ****************************/

    public static function getPregunta(string $difficulty): Pregunta{
        $conn = Connection::getConnection();

        $query = sprintf("SELECT id, difficulty, question, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3 
            FROM preguntas WHERE difficulty ='%s'", $difficulty);

        $result = mysqli_query($conn, $query);
        if(!$result) 
            throw new Exception ('Error en la carga de pregunta');
        
        $preguntas = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {;
                $pregunta = new Pregunta();
                $pregunta->setId($row['id']);
                $pregunta->setDifficulty($row['difficulty']);
                $pregunta->setQuestion($row['question']);
                $pregunta->setCorrect_answer($row['correct_answer']);
                $pregunta->addIncorrect_answers($row['incorrect_answer1']);
                $pregunta->addIncorrect_answers($row['incorrect_answer2']);
                $pregunta->addIncorrect_answers($row['incorrect_answer3']);
                array_push($preguntas, $pregunta);
            }
            $i = rand(0, count($preguntas)-1); 

            if(isset($_SESSION['partida'])){
                while(in_array($preguntas[$i]->getQuestion(), $_SESSION['partida']['preguntas'])){
                    $i = rand(0, count($preguntas)-1);
                }
            }
        } else 
            throw new Exception ('No existen preguntas disponibles');
        
        return $preguntas[$i];
    }
}