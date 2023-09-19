
export const ERROR_STRINGS={
   INVALID_EMAIL: "Please enter a valid email address.",
   INVALID_PASSWORD:
`Please enter a valid password. It must
● be longer than 8 characters
● contain at least 1 upper-case letter
● contain at least 1 lower-case letter
● contain at least one number.
`
}

export function IsValidEmail(email:string){

  return  new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(email) ? undefined
          :ERROR_STRINGS.INVALID_EMAIL

}

export function IsValidPassword(password:string){
    return (
        password?.length >8  
        && new RegExp(/[A-Z]/).test(password)
        && new RegExp(/[a-z]/).test(password)
        && new RegExp(/[0-9]/).test(password) 
        ) ? undefined : ERROR_STRINGS.INVALID_PASSWORD
}

type IValidateEntry={[key:string]:any,rule:(value:any)=>string | undefined }

export function validateAll(list:Array<IValidateEntry>){
    var result:any={}
    list.forEach(entry=>{
       
        let name=Object.keys(entry).filter(x=>x!="rule").pop() 
        console.log(name)
        let errorMsg=entry.rule(entry[name!])
        if (errorMsg)
        {
            result[name!]=errorMsg
        }

    })
    return result;

}