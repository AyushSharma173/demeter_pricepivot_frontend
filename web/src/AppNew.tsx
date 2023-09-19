import React, { useEffect, useState } from 'react';
import './AppNew.css';

import { TouchableOpacity } from 'react-native';


function rw(w: number,sw?:number) {
  let percentage = w /(sw || 1440 )* 100

  return percentage.toString() + "vw"
}
function rh(h: number, w: number) {

  let ratio = h / w

  return (100 * ratio * (w / 1440) + 'vw')
}

var Is_Mobile=false;
function AppNew() {

  const windowSize=useWindowSize();
  console.log("win",windowSize);
  Is_Mobile=windowSize.width<760

  return (
    <div className="AppNew">
     <TopBar />
     <img  style={{alignSelf:'center',marginTop:'99px'}} src="/Demeter-logos_black 1.png" width="297px"/>
     <input 
     onKeyDown={(e:any)=>{
      if (e.key=='Enter' && e.target.value){
      window.location.href=`/PriceChecker?query=${e.target.value}`
      }

     }}
     style={{alignSelf:'center',marginTop:'99px',width:'789px' ,fontSize:'15px'}}  placeholder='Search Example: Milk, Eggs, Vacuum cleaner..'/>
    </div>
  );
}




function TopBar() {
  let sections = ["Price Checker", "Your Shopping List", "Meal Planning"];
  let locs = ["https://gameonllc.bamboohr.com/careers", "#support", "#about", "/portal"];

  return (
    <div className="topbar-container">
      <div className="topbar-content">
        {Is_Mobile ? (
          <MobileMenu locs={locs} sections={sections} />
        ) : (
          <div className="topbar-links">
            {sections.map((s, i) => {
              let loc = "";
              switch (i) {
                case 0:
                  loc = "/PriceChecker";
                  break;
                case 1:
                  loc = "/ShoppingList";
                  break;
                case 2:
                  loc = "#about";
                  break;
                case 3:
                  loc = "/portal";
                  break;
                default:
                  loc = "/portal";
              }
              return (
                <span key={s} className="topbar-link">
                  <a href={loc}>{s}</a>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileMenu(p:{locs:Array<string>,sections:Array<string>}){
    const [opened,setOpened]=useState(false)

  return(<>
    <TouchableOpacity onPress={()=>setOpened(true)}>
    <img src="/svgs/menu.svg" />
    </TouchableOpacity>
    <div style={{display:opened ?'block':'none',position:'fixed',backgroundColor:colors.darkGreen,height:'100vh',top:0,left:0,zIndex:1000,width:"100vw"}} >
      <div style={{marginTop:'32px',paddingLeft:'16px',paddingRight:'16.5px',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:'30px'}}>
    <img src='/svgs/go_long.svg' 
      style={{ height:Is_Mobile ? '26px': rh(26, 150), width:Is_Mobile?'150px': rw(150), alignSelf: "center", display: "flex" }} className="App-logo" alt="logo" />
         <TouchableOpacity onPress={()=>setOpened(false)}> 
         <div style={{color:'white',display:'flex',fontSize:'32px'}}>X</div>
         </TouchableOpacity>
      </div>
      {p.sections.map((x,i)=>{

        return (<a key={x} href={p.locs[i]} style={{color:'white',marginLeft:'16px',marginRight:'16px',padding:'20px',backgroundColor:'rgba(57, 81, 96, 1)',marginBottom:'20px',textDecoration:"none",display:'flex'}}>{x}</a>)
      })

      }
    </div>
    </>)
}

export default AppNew;

// NOTE: Move to new file to reuse
export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<any>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      
      windowSize.height!=window.innerHeight && windowSize.width!=window.innerWidth  && setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
