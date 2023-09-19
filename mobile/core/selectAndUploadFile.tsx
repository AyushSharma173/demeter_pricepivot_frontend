import { Asset, launchImageLibrary } from "react-native-image-picker"
import storage from '@react-native-firebase/storage'
import { Session } from "src/commons";
interface IFileInfo extends Asset{
    
}
type IOnFilePickedListener=(info:IFileInfo)=>void

export default async function selectAndUploadFile(path:string,onFilePicked?:IOnFilePickedListener,pickedFile?:File)
{
        console.log(path)
        let res=!pickedFile ? await     launchImageLibrary({
                mediaType:"photo",
            }): { didCancel:false,errorCode:false,errorMessage:"",assets:[{fileName:pickedFile.name,fileSize:pickedFile.size,uri:pickedFile}]}
            if (!res.didCancel && !res.errorCode && !res.errorMessage)
            {
                let asset=res.assets?.[0]!
                let ext=asset.fileName?.split('.').pop()?.toLowerCase()
                if (asset.fileSize!>Session.configs.file_size_limit_in_bytes)
                {
                        throw `Your file size is ${Math.round(asset.fileSize!/Math.pow(1024,2))} MB, which is greater than the limit ${Session.configs.file_size_limit_in_bytes/Math.pow(1024,2)} MB.`
                }
                if (!Session.configs.file_types.includes(ext!)){
                        throw `Your file of type ${ext} is not allowed. Valid types are ${Session.configs.file_types}`
                }
                
       
             await storage().ref(path).putFile(res.assets?.[0]?.uri!)
             onFilePicked && onFilePicked(  res.assets?.[0]!)
            }
           


}
