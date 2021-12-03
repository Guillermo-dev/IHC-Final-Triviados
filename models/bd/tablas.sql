CREATE TABLE IF NOT EXISTS preguntas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ( 'easy', 'medium', 'hard')),
    question VARCHAR(255) NOT NULL UNIQUE,
    correct_answer VARCHAR(25) NOT NULL,
    incorrect_answer1 VARCHAR(25) NOT NULL,
    incorrect_answer2 VARCHAR(25) NOT NULL,
    incorrect_answer3 VARCHAR(25) NOT NULL
);
