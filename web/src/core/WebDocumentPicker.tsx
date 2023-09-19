import React, { useRef } from "react";

export default class WebDocumentPicker extends React.Component{
   
    inputRef=React.createRef<any>()
    _fileChanged=false

    state={value:""}
    render(){
       
        return (
            <input ref={this.inputRef as any} 
           
            type="file" style={{display:"none"}}/>
        )
    }

     pickFile(){
        return new Promise<{name:string,size:number,uri:string}> ((resolve,reject)=>{
        this._fileChanged=false
        const onChange=(e)=>{
            this._fileChanged=true
                const obj=  e.target.files[0]
                if (obj)
                obj.uri=obj 
                else reject("no file") 
        resolve(obj)
          
            
            this.inputRef.current.value=""
            this.inputRef.current.removeEventListener("change",onChange)
        }
        this.inputRef.current.addEventListener("change",onChange)
        const listener=()=>{
            setTimeout(() => {
                if (this._fileChanged ){
                    
                }                
                else {
                    reject("no file") 
                    this.inputRef.current.removeEventListener("change",onChange)
                }
            }, 1000);
            window.removeEventListener("focus",listener)
        }
        window.addEventListener("focus",listener)
        this.inputRef.current?.click()        
    })
    }
}