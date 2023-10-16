import { IResponse } from "response";
import axios from "axios";
import { cleaner } from "cleaner";

export function get_recommendations({query}:{query:string}):Promise<IResponse>{

    return new Promise(r=>{

        axios.post("http://3.18.66.136:5002/get_recommendations",{
            
            query
        })
        .then(x=>{
            r(JSON.parse((x.data.output as string).replaceAll("NaN",'"NaN"')))
        })
       
    })
}