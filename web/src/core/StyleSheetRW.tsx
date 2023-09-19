import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { AppWindow } from "./designHelpers";


type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };
const refStyleObjects: Array<{ refStyleObject: any, getStyle: any }> = []


const StyleSheetRW = {

    create

}

function create<T extends NamedStyles<T> | NamedStyles<any>>(getStyle: () => (T | NamedStyles<T>)): T {

    let refStyleObject = getStyle()
    refStyleObjects.push({ refStyleObject, getStyle })
    return refStyleObject as any


}

AppWindow.addPriortyListener(1, (_) => {
    refStyleObjects.forEach(({ refStyleObject, getStyle }) => {
        Object.assign(refStyleObject, getStyle())
    })
    console.log("<>", "StyleSheetRW.ts", "Updated sheets")
})
export default StyleSheetRW