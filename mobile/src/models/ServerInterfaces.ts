export class  ServerError{
    message:string=""
    constructor(msg:string){
        this.message=msg
    }
}
export class Product {
    name:string=""
    paymentLink:string=""
}
export type  ProductResponse=Array<Product>