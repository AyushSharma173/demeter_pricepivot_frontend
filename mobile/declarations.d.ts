
interface IMG_RESOURCE extends any {

}
declare module "*.jpg" {

  const content: IMG_RESOURCE
  export default content;
}

declare module "*.png" {

  const content: IMG_RESOURCE
  export default content;
}

declare function  alert(...args:any) :void

declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare const localStorage=any