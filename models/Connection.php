<?php

namespace models;

use Mysqli;
use Exception;


abstract class Connection {

    private static $conn = null;
    //TODO:
    public static function getConnection() {
        if (self::$conn == null) {
            try {
                // localhost:3306;root;;triviadosDB;
                $config = explode(';', file_get_contents('config/db-config.conf'));
                self::$conn = new Mysqli($config[0], $config[1], $config[2], $config[3]);
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return self::$conn;
    }
}
