import { useEffect, useState } from "react";
import { Dimensions, PixelRatio, Platform } from "react-native";

const [DESIGN_WIDTH, DESIGN_HEIGHT] = [375, 812];

function chooseWidth(width:number, height:number){
  if (width<height)
  return width;
  else 
  return height*0.47
}

export class AppWindow {
  private static listeners: Array<(w: number, h: number) => any> = []

  private static setScale() {
    if (this.WIN_WIDTH < this.WIN_HEIGHT)
      this._SCALE = this.WIN_WIDTH / DESIGN_WIDTH;
    else
      this._SCALE = this.WIN_HEIGHT / DESIGN_HEIGHT;

  }

  public static initialize() {
    let w = Dimensions.get('window')
    this._WIN_HEIGHT =Platform.OS=="web" ? w.height-24:  w.height
    this._WIN_WIDTH = chooseWidth( w.width,this.WIN_HEIGHT)
    this.setScale()
    this.addPriortyListener(0, (w, h) => {

      this._WIN_HEIGHT = Platform.OS=="web" ? h-24: h
      this._WIN_WIDTH = chooseWidth(w,h)
      FULL_SCREEN.height=AppWindow.WIN_HEIGHT
      FULL_SCREEN.width=AppWindow.WIN_WIDTH
      this.setScale()
      console.log("<i>", "designHelpers.ts", "AppWindow", "update! runnning with ", this._WIN_WIDTH, this.WIN_HEIGHT)
    })

    Dimensions.addEventListener("change", ({ window }) => {
      this.listeners.forEach(listener => listener(window.width,Platform.OS=="web" ? window.height:  window.height))
    })
    console.log("<i>", "designHelpers.ts", "AppWindow", "runnning with ", this._WIN_WIDTH, this.WIN_HEIGHT)

  }

  public static addPriortyListener(priority: number | null, listener: (w: number, h: number) => any) {

    priority = priority || this.listeners.length
    this.listeners[priority] = listener
    return { remove: () => this.listeners.splice(this.listeners.indexOf(listener), 1) }

  }


  public static update(width: any, height: any) {
    if (height)
      this._WIN_HEIGHT = height
    if (width)
      this._WIN_WIDTH = width
  }
  private static _WIN_HEIGHT: number;
  public static get WIN_HEIGHT(): number {
    return this._WIN_HEIGHT
  }
  public static set WIN_HEIGHT(v: number) {
    throw "Invalid attempt to assign value to WIN_HEIGHT"
  }

  private static _WIN_WIDTH: number;
  public static get WIN_WIDTH(): number {
    return this._WIN_WIDTH
  }
  public static set WIN_WIDTH(v: number) {
    throw "Invalid attempt to assign value to WIN_WIDTH"
  }


  private static _SCALE: number = -1
  public static get SCALE(): number {
    return this._SCALE
  }
  public static set SCALE(v: number) {
    throw "Invalid attempt to assign value to SCALE"
  }
}
AppWindow.initialize()

// const {height:SCREEN_HEIGHT,width:SCREEN_WIDTH} =Dimensions.get('screen')




export function rw(w: number) {
  return (w / DESIGN_WIDTH) * AppWindow.WIN_WIDTH
}

export function rh(h: number) {
  return (h / DESIGN_HEIGHT) * AppWindow.WIN_HEIGHT
}


export const FULL_SCREEN = {
  width:  AppWindow.WIN_WIDTH,
  height: AppWindow.WIN_HEIGHT,
}

export function fs(size: number) {

  const newSize = size
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`
}

export function useAppWindow() {
  const [currentWindow, setWindow] = useState<any>({w:Dimensions.get('window').width,h:Dimensions.get('window').height})

  useEffect(() => {

    const sub = AppWindow.addPriortyListener(null, (w, h) => {
      console.log("<i>","designHelpers.ts", "useAppWindow updated")
      setWindow({ w, h })
    })
    return () => { sub.remove() }
  }, [])
  return currentWindow
}