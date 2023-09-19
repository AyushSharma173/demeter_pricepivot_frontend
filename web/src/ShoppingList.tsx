import React, { useEffect, useState } from 'react';
import './AppNew.css';
import { TouchableOpacity } from 'react-native';
import { IProduct } from 'Response';


function rw(w: number,sw?:number) {
  let percentage = w /(sw || 1440 )* 100

  return percentage.toString() + "vw"
}
function rh(h: number, w: number) {

  let ratio = h / w

  return (100 * ratio * (w / 1440) + 'vw')
}

var Is_Mobile=false;
function ShoppingList() {

  const windowSize=useWindowSize();
  console.log("win",windowSize);
  Is_Mobile=windowSize.width<760
  let items:Array< IProduct>=JSON.parse(localStorage.getItem("shopping") ||"[]")

  return (
    <div className="AppNew">
     <TopBar />
     <div style={{display:'flex',flexDirection:'row'}}>
     <img  style={{marginLeft:'53px',marginTop:'12px'}} src="/Demeter-logos_black 1.png" width="107px"/>
     {/* <input style={{marginLeft:'85px',marginTop:'37px',width:'789px' ,fontSize:'18px',height:'31px'}}  placeholder='Search for items. Ex Milk, Lithium coins etc'/> */}
     </div>
     < div style={{width:'100%',marginTop:"37px",display:'flex',flexDirection:'row',paddingLeft:'71px',paddingRight:'8px'}} >
      <div style={{width:'884px',border:'1px solid black'}}>

       
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
          {items.map((item,i)=>(<div style={{height:"183px",width:'100%',outline:false ? undefined:'1px solid black',backgroundColor:false ? 'rgba(206, 233, 249, 1)':undefined,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:"flex-start"}}>
          
          <div style={{display:'flex',flex:2,flexDirection:"column",alignItems:"center"}}>
            <img style={{width:"113px",height:"64px",objectFit:"contain"}} src={item.thumbnail}/>
            <span style={{textAlign:"center",maxWidth:"267px",marginTop:'8px',fontSize:false ? '13px':'10px',fontWeight:false ? '700':'400',color:i==0 ? 'rgba(2, 89, 137, 1)':'black'}}>
             {item.title}
            </span>
          </div>
          <div style={{display:'flex',flex:1,height:'100%',justifyContent:"center",flexDirection:"column",alignItems:"center",borderLeft:"1px solid black"}}>
           <span style={{fontSize:'12px',marginTop:'8px',fontWeight:'700',color:'black',textAlign:"center"}}>{item.price}
           {/* <br/><br/>$0.40/count */}
           </span>
           <span style={{fontSize:'12px',marginTop:'8px',fontWeight:'700',color:'blue'}}><a style={{textDecoration:'none'}} href={item.link} target='__blank' >View in {item.store} Site</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Compare Prices</span>
           </div>  
          </div>
          ))}
          <div style={{height:"183px",width:'100%',outline:false ? undefined:'1px solid black',backgroundColor:false ? 'rgba(206, 233, 249, 1)':undefined,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:"flex-start"}}>
          
          <div style={{display:'flex',flex:2,flexDirection:"column",alignItems:"center"}}>
          
            <span style={{textAlign:"center",maxWidth:"267px",marginTop:'8px',fontSize:false ? '13px':'13px',fontWeight:true ? '700':'400',color:false? 'rgba(2, 89, 137, 1)':'black'}}>
              Total
            </span>
          </div>
          <div style={{display:'flex',flex:1,height:'100%',justifyContent:"center",flexDirection:"column",alignItems:"center",borderLeft:"1px solid black"}}>
           <span style={{fontSize:'12px',marginTop:'8px',fontWeight:'700',color:'black',textAlign:"center"}}>${items.reduce((a,p)=>a+p.price,0)}</span>
           </div>  
          </div>
        </div>
      </div>
     
      
     </div>
     <div style={{height:'100px'}}></div>
    </div>
  );
}


function TopBar() {
  let sections = ["Price Checker", "Your Shopping List", "Meal Planning"];
  let locs = ["/PriceChecker", "/ShoppingList", "#about", "/portal"];

  return (
    <div className="topbar-container">
      <div className="topbar-content">
        {Is_Mobile ? (
          <MobileMenu locs={locs} sections={sections} />
        ) : (
          <div className="topbar-links">
            {sections.map((s, i) => (
              <span key={s} className="topbar-link">
                <a href={locs[i]}>{s}</a>
              </span>
            ))}
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





export default ShoppingList;

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
