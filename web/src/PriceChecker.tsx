import { useEffect, useState } from 'react';
import './AppNew.css';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { get_recommendations } from 'apiCalls';
import { IProduct, IResponse } from 'Response';


function rw(w: number,sw?:number) {
  let percentage = w /(sw || 1440 )* 100

  return percentage.toString() + "vw"
}
function rh(h: number, w: number) {

  let ratio = h / w

  return (100 * ratio * (w / 1440) + 'vw')
}

var Is_Mobile=false;
function PriceChecker() {

  const windowSize=useWindowSize();
  console.log("win",windowSize);
  Is_Mobile=windowSize.width<760
  const [response,setResponse]=useState<IResponse >(null as any)


  let sections=[...Object.keys(response || {}),"Recommendation"]
  const [selectedSectionIndex,setSelectedSectionIndex]= useState<number>(0)
  const [sortBy,setSortBy]=useState<"sorted_by_score" | "sorted_by_price">("sorted_by_score")
  const [selectedItemIndex,setSelectedItemIndex]= useState<number>(0)
  let items=response && sections.length>1 ? response[sections[selectedSectionIndex]][sortBy]: []
 
  let item2:IProduct | undefined=undefined
  let item3:IProduct | undefined=undefined


  try {
      if (sections.length>2)
     item2=response[sections[(selectedSectionIndex+1)%(sections.length-1)]][sortBy][0]
  }
  catch(_){

  }
  try {
    if (sections.length>3)
    item3=response[sections[(selectedSectionIndex+2)%(sections.length-1)]][sortBy][0]
  }
  catch(_){

  }

  useEffect(()=>{
    const params:any = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop as string),
    });
    params.query ? get_recommendations({query:params.query}).then (r=>setResponse(r))
    : setResponse({})
  },[])
  
  console.log(items[selectedItemIndex])


  return (
    <div className="AppNew">
     <TopBar />
     <div style={{display:'flex',flexDirection:'row'}}>
     <img  style={{marginLeft:'53px',marginTop:'12px'}} src="/Demeter-logos_black 1.png" width="107px"/>
     <input defaultValue={(new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop as string),
    }) as any).query} onKeyDown={(e)=>{if (e.key=='Enter' && (e.target as any).value?.trim()) {
      setResponse(null as any)
      get_recommendations({query:(e.target as any).value}).then (r=>{
        
        setSelectedSectionIndex(0)
        setSortBy("sorted_by_score")
        setSelectedItemIndex(0)
        setResponse(r)
        
      })
     }}} style={{marginLeft:'85px',marginTop:'37px',width:'789px' ,fontSize:'18px',height:'31px'}}  placeholder='Search for items. Ex Milk, Lithium coins etc'/>
     </div>
     {!response && <ActivityIndicator style={{marginTop:'120px'}} size={"large"} />}
     {response && sections.length==1 && <p style={{alignSelf:'center',fontSize:'20px'}}>No results found. Try again with different keywords.</p>}
     {!!response && sections.length>1 &&<div id="ResultDiv" style={{width:'100%',marginTop:"37px",display:'flex',flexDirection:'row',paddingLeft:'71px',paddingRight:'8px'}} >
      <div style={{width:'884px',border:'1px solid black'}}>

        <div style={{width:'884px',height:'87px',backgroundColor:'white',display:"flex",flexDirection:"column",justifyContent:'space-between'}}>
            <div style={{width:'884px',display:'flex',justifyContent:'space-between',flexDirection:'row',height:'33px'}}>
                {sections.map((x,i)=>(<div key={x} onClick={()=>x!='Recommendation' && setSelectedSectionIndex(i)} style={{cursor:"pointer", height:'100%',border:'1px solid black',backgroundColor:i==selectedSectionIndex ? 'rgba(69, 185, 250, 1)' :'rgba(228, 245, 255, 1)',display:'flex',justifyContent:'center',alignItems:"center",paddingLeft:'14px',paddingRight:'14px'}}><span style={{fontSize:'18px',color:i==selectedSectionIndex ? 'white':'black',fontWeight:i==selectedSectionIndex ?'bold':undefined}}>{x}</span>{x=='Recommendation' && <img style={{marginTop:'-8px'}} width="40px" height="29px" src="/2385865 1.png"/>}</div>))

                }
            </div>
            <div style={{alignSelf:"flex-end",height:'50px',marginRight:'43px'}}>
                  <span style={{fontSize:'13px',color:'black'}}>Sort by </span>
                  <select onChange={(e)=>{ setSortBy( e.target.value as any) }} style={{backgroundColor:"rgba(69, 185, 250, 1)",fontSize:"13px",color:"white"}} >
                    <option value={"sorted_by_score"} >Relevance</option>
                    <option value={"sorted_by_price"} >Price</option>
                  </select>
            </div>
        </div>
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
          {items.map((item,i)=>(<div onClick={()=>setSelectedItemIndex(i)} style={{cursor:"pointer",height:"183px",minWidth:'294px',outline:i==selectedItemIndex ? undefined:'1px solid black',backgroundColor:i==selectedItemIndex ? 'rgba(206, 233, 249, 1)':undefined,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:"center"}}>
           <img style={{width:"113px",height:"64px",objectFit:"contain"}} src={item.thumbnail}/>
           <span style={{textAlign:"center",maxWidth:"267px",marginTop:'8px',fontSize:i==selectedItemIndex ? '13px':'10px',fontWeight:i==selectedItemIndex ? '700':'400',color:i==selectedItemIndex ? 'rgba(2, 89, 137, 1)':'black'}}>
           {item.title}
           </span>
           <span style={{fontSize:'12px',marginTop:'8px',fontWeight:'600',color:'black'}}>${item.price}
           {/* {'\t'}$0.40/count */}
           </span>
           <a href={item.link} target='__blank' style={{fontSize:'12px',marginTop:'8px',fontWeight:'700',color:'blue',textDecoration:"none"}}>View in {sections[selectedSectionIndex]} Site</a>
          </div>))}
        </div>
      </div>
      <div style={{width:'338px',marginLeft:'17px'}}>
        
          <div style={{minWidth:'293px',border:true ? undefined:'1px solid black',backgroundColor:false ? 'rgba(206, 233, 249, 1)':undefined,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:"center"}}>
              <span style={{fontSize:"18px",alignSelf:'center',color:"black",width:"169px",textAlign:"center",marginBottom:"13px"}}>Product Information for {sections[selectedSectionIndex]}</span>
              <img style={{width:"113px",height:"64px",objectFit:"contain"}} src={items[selectedItemIndex].thumbnail}/>
              <span style={{textAlign:"center",maxWidth:"267px",marginTop:'8px',fontSize:true ? '13px':'10px',fontWeight:false ? '700':'500',color:false ? 'rgba(2, 89, 137, 1)':'rgba(20, 0, 255, 1)'}}>
                {items[selectedItemIndex].title}
              </span>
              <span style={{fontSize:'12px',marginTop:'8px',fontWeight:'600',color:'black'}}>${items[selectedItemIndex].price}
              {/* {'\t'}$0.40/count */}
              </span>
              <span style={{fontSize:'12px',alignSelf:"flex-start",marginLeft:"9px",marginTop:'8px',fontWeight:'400',color:'black'}}>Rating: <b>{items[selectedItemIndex].product_rating}</b>/5</span>
              <span style={{fontSize:'15px',marginTop:'8px',fontWeight:'700',color:'black',alignSelf:"flex-start"}}>Reviews</span>
              { typeof items[selectedItemIndex]?.reviews=='object' && typeof items[selectedItemIndex]?.reviews?.slice=='function' && items[selectedItemIndex]?.reviews?.slice(0,3).map(r=>(<>
                <span style={{fontSize:'12px',fontWeight:'700',color:'black',alignSelf:"flex-start"}}></span>
              <span style={{fontSize:'12px',fontWeight:'400',color:'black',alignSelf:"flex-start"}}> {r}</span>
             <br/>
              </>))}
              <div style={{width:'100%',display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:'44px'}}>
                  <span onClick={()=>addToShoppingList(items[selectedItemIndex])}  style={{width:"143px",fontWeight:'800',marginLeft:"12px",fontSize:"13px",backgroundColor:"rgba(0, 29, 184, 1)",color:"white",height:"22px",justifyContent:"center",display:"inline-flex",alignItems:"center",cursor:"pointer"}}>Add to Shopping List</span>
                  <span style={{width:"143px",fontWeight:'800',marginRight:"12px",fontSize:"13px",backgroundColor:"rgba(69, 185, 250, 1)",color:"white",height:"22px",justifyContent:"center",display:"inline-flex",alignItems:"center"}}>Track Price</span>
              </div>
          </div>
          {item2 && <div style={{minWidth:'293px',marginTop:"20px",border:true ? undefined:'1px solid black',backgroundColor:false ? 'rgba(206, 233, 249, 1)':undefined,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:"center"}}>
              <span style={{fontSize:"18px",alignSelf:'center',color:"black",width:"169px",textAlign:"center",marginBottom:"13px"}}>At {item2!.store}</span>
              <img style={{width:"113px",height:"64px",objectFit:"contain"}} src={item2!.thumbnail}/>
              <span style={{textAlign:"center",maxWidth:"267px",marginTop:'8px',fontSize:true ? '12px':'10px',fontWeight:false ? '700':'500',color:false ? 'rgba(2, 89, 137, 1)':'rgba(20, 0, 255, 1)'}}>
                {item2!.title}
              </span>
              <span style={{fontSize:'12px',marginTop:'44px',fontWeight:'600',color:'black'}}>${item2.price}
              {/* {'\t'}$0.40/count */}
              </span>
              
              <div style={{width:'100%',display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:'8px'}}>
                  <span onClick={()=>addToShoppingList(item2!)} style={{cursor:"pointer", width:"143px",fontWeight:'800',marginLeft:"12px",fontSize:"13px",backgroundColor:"rgba(0, 29, 184, 1)",color:"white",height:"22px",justifyContent:"center",display:"inline-flex",alignItems:"center"}}>  Add to Shopping List</span>
                  <span style={{width:"143px",fontWeight:'800',marginRight:"12px",fontSize:"13px",backgroundColor:"rgba(69, 185, 250, 1)",color:"white",height:"22px",justifyContent:"center",display:"inline-flex",alignItems:"center"}}>Track Price</span>
              </div>
          </div>}
          {item3 && <div style={{minWidth:'293px',marginTop:"20px",border:true ? undefined:'1px solid black',backgroundColor:false ? 'rgba(206, 233, 249, 1)':undefined,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:"center"}}>
              <span style={{fontSize:"18px",alignSelf:'center',color:"black",width:"169px",textAlign:"center",marginBottom:"13px"}}>At {item3!.store}</span>
              <img style={{width:"113px",height:"64px",objectFit:"contain"}} src={item3!.thumbnail}/>
              <span style={{textAlign:"center",maxWidth:"267px",marginTop:'8px',fontSize:true ? '12px':'10px',fontWeight:false ? '700':'500',color:false ? 'rgba(2, 89, 137, 1)':'rgba(20, 0, 255, 1)'}}>
                {item3!.title}
              </span>
              <span style={{fontSize:'12px',marginTop:'44px',fontWeight:'600',color:'black'}}>${item3.price}
              {/* {'\t'}$0.40/count */}
              </span>
              
              <div style={{width:'100%',display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:'8px'}}>
                  <span onClick={()=>addToShoppingList(item3!)} style={{cursor:"pointer", width:"143px",fontWeight:'800',marginLeft:"12px",fontSize:"13px",backgroundColor:"rgba(0, 29, 184, 1)",color:"white",height:"22px",justifyContent:"center",display:"inline-flex",alignItems:"center"}}>  Add to Shopping List</span>
                  <span style={{width:"143px",fontWeight:'800',marginRight:"12px",fontSize:"13px",backgroundColor:"rgba(69, 185, 250, 1)",color:"white",height:"22px",justifyContent:"center",display:"inline-flex",alignItems:"center"}}>Track Price</span>
              </div>
          </div>}
          
      </div>
      
     </div>}
     <div style={{height:'100px'}}></div>
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
                  <a href={loc} className={i === 0 ? "active" : ""}>{s}</a>
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









export default PriceChecker;

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
function addToShoppingList(item:IProduct){

  let items:Array< IProduct>=JSON.parse(localStorage.getItem("shopping") ||"[]")

  if (items.find(x=>x.product_hash==item.product_hash))
  {
    alert("Item already added to shopping list.")
  }
  else {
     items.push(item)
     localStorage.setItem("shopping",JSON.stringify(items))
     alert("Item added to shopping list!")
  }

}