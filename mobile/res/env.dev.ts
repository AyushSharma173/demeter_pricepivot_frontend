import { Platform } from "react-native"

export default class env_dev{

    static   type:'mock' | 'dev' | 'prod'='dev'
    static serverURL='http://localhost:5001/notset/us-central1/'
    static logLevel:'none' | 'protected' | 'all'='all'
    
    static NO_PAY=false // false is the desired flag

    static DO_NOT_REQUIRE_DOCS=true
   
}