<?php

namespace models;

use Mysqli;
use mysqli_driver;


abstract class Connection {

    private static $conn = null;
    //TODO:
    public static function getConnection(){
        if(self::$conn == null){
            try {
                // localhost:3307;laboratorio;root;;
                $config = explode(';', file_get_contents('config/db-config.conf'));
                self::$conn = new Mysqli($config[0], $config[1], $config[2], $config[3]);
                
            }catch(Exception $e){

            }
        }
        return self::$conn;
    }
}
