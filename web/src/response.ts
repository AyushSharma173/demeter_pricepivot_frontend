export type IResponse={

    [storename:string]:{
        "sorted_by_score":Array<IProduct>
        "sorted_by_price":Array<IProduct>
    }
}

export type IProduct={
    product_rating: string
    distance: string
    badge: string
    stock_information: string
    status: string
    store_address: string
    hours: string
    product_id: string
    discount: number
    old_price: number
    value_per_unit: string
    extracted_availability: boolean
    positive_reviews: any[]
    delivery_options: string
    savings: string
    thumbnail: string
    negative_reviews: any[]
    extensions: any[]
    store_rating: number
    store_reviews: number
    product_hash: string
    extracted_price: number
    reasons_not_to_buy: string[]
    product_amount: string
    link: string
    tag: string
    description: string
    extracted_product_reviews: number
    price: number
    product_reviews: string
    reasons_to_buy: string[]
    extracted_product_rating: number
    store: string
    title: string
    score: number
    reviews?:Array<string>
  }

