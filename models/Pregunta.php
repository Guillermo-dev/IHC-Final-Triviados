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
        $conn = Connection::getCopnnection();

        $query = sprintf("SELECT id, difficulty, question, correct_answer, incorrect_answer1, incorrect_answer2. incorrect_answer3 
            FROM preguntas WHERE dificulty ='%s'", $difficulty);

        $result = mysqli_query($conn, $query);
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);

            $pregunta = new Pregunta();
            $pregunta->setId(1);
            $pregunta->setDifficulty('easy');
            $pregunta->setQuestion('Esta es la pregunta');
            $pregunta->setCorrect_answer('Correcto');
            $pregunta->addIncorrect_answers('Incorrecto 1');
            $pregunta->addIncorrect_answers('Incorrecto 2');
            $pregunta->addIncorrect_answers('Incorrecto 3');

        } else 
            throw new Exception ('No existen preguntas disponibles');
        
        return $pregunta;
    }
}