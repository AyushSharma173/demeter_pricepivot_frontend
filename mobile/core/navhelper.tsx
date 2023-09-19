import React ,{ useEffect, useState } from "react";
import { Platform } from "react-native";
import { LayoutStack, Navigation } from "react-native-navigation"
import { connectCore } from "./core"
import { IComponent } from "./interfaces"
import {Provider} from 'react-redux'
import { store } from "./singleFileReduxManager";

export const APP_SCREEN_NAME="com.myApp.WelcomeScreen"
var componentId: string | null = null;
var componentIdStack: Array<string> = []
var navigate: any = null
type IMODE='stack' | 'tabs'
var currentTabSpecs:ITabSpecs=[]
var onTabChangeCallback:Array<(index:number)=>void>=[]
var selectedTab=0; //todo refactoring
var _passPropsStack:Array<any>=[]
export default class navhelper  {

  private static currentScreen:string=""
  private static selectedIndex:number=0;
  private  static _MODE : IMODE='stack';
  public static get MODE() : IMODE {
    return this._MODE;
  }
  public static set MODE(v : string) {
    throw 'Invalid assignment'
  }

  static getWebComponentId(){
       //@ts-ignore
       const location:{pathname:string}=document.location
    return this.currentScreen || location.pathname?.slice(1)
  }
  
  static getTabSpecs():{ tabs: ITabSpecs,selectedIndex:number}{
    return { tabs:currentTabSpecs, selectedIndex:navhelper.selectedIndex}
  }

  /* #region  Common Functions */
  static push(screenName: string,passProps?:any) {
    _passPropsStack.push(passProps)
    componentId && Navigation.push(componentId, {
      component: {
        name: screenName, // Push the screen registered with the 'Settings' key
        id: screenName,
        passProps,
      }
    });
  }
  
  static setRoot(specs: string | ITabSpecs, backgroundImage?: any) {
    if (typeof specs=='string'){
      this._MODE='stack'
      let screenName=specs
      this.currentScreen=screenName
      Navigation.setRoot({
        root: {
          stack: {
            children: [
              {
                component: {
                  name: screenName,
                  id:screenName,
                  options: {
                    backgroundImage: backgroundImage
                  }
                }
  
              }
            ]
          }
        }
      });
    }
    else {
      this._MODE='tabs'
      selectedTab=0
      currentTabSpecs=specs
     let children=  specs.map(x=>this.makeStack(x.name))
      Navigation.setRoot({
        root:{
          bottomTabs:{
            id:"BOTTOM_TABS_LAYOUT",
            children,
            options:{
              bottomTabs:{
                visible:false
              }
            }
          }
        }
      })
    }
  }
  static  goBack() {
    Navigation.pop(componentId!)
    _passPropsStack.pop()
    componentIdStack.pop()
    componentId = componentIdStack.slice(-1)[0]

  }
  static popToRoot(){
      Navigation.popToRoot(componentId!)
  }
  static  makeStack(root: string):{stack:LayoutStack} {
    return {
        stack: {
          children: [
            {
              component: {
                name: root,
                id: root,
              }
            }
          ]
        }
      }
  }
  static selectTab(index:number){
   selectedTab=index
   onTabChangeCallback.forEach(x=>x(index))
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT',{
      bottomTabs:{
        currentTabIndex:index,
  
      }
    })
  }
  /* #endregion */

  static setComponentId(newComponentId: string) {
    componentId = newComponentId
    componentIdStack.push(componentId)
  }
  static setHistory(newHistory: any) {

    navigate = newHistory
  }
  static  registerScreens<T extends (...args: any) => any>(screens: { [key: string]: IComponent }, HOCFunction: T) {

    Object.keys(screens).forEach(screenName => {
      const Mutant = HOCFunction(screens[screenName])
      let wixScreenName = screenName

      if (screenName == "default")
        wixScreenName = APP_SCREEN_NAME

      Navigation.registerComponent(wixScreenName,()=>(props:any)=><Provider store={store}>
        <Mutant  {...props}/>
      </Provider>, () => Mutant)
    })
  }

  static  getPassedProps(){
      if (Platform.OS!="web")
        return {}
      else {
          return _passPropsStack.slice(-1)[0]
      }
  }

}


export function useOnTabChange(){
  const [currentIndex,setCurrentIndex]=useState(selectedTab)

  useEffect(()=>{

    function onUpdate(i:number){
      setCurrentIndex(i)
    }
  onTabChangeCallback.push(onUpdate)
  return ()=>{onTabChangeCallback.splice(onTabChangeCallback.indexOf(onUpdate),1)}

  },[])
  return currentIndex;
}
Navigation.events().registerComponentDidAppearListener((e)=>
{
navhelper.setComponentId( e.componentId)
})
export type ITabSpecs=Array<{name:string,label?:string,selected:any,unselected:any,IsCurrent?:boolean}>

