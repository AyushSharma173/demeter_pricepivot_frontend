declare module "react-native" {

    export  * from "@types/react-native"
    import { Image as CurImage, ImageBackground as CurImageBackground } from "react-native"
    export const Image:CurImage &{ source:string}
    export const ImageBackground:CurImageBackground & {source:string}
}


