import StyleSheetRW from "core/StyleSheetRW";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";
import { fs, rgba, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import { TouchableOpacity } from "react-native";
import { coreOptions } from "core/core";
import ConHeader from "src/components/ConHeader";

import colors from "res/colors";

import types from "res/refGlobalTypes";
import { Navigation } from "react-native-navigation";
import { getAppStore, updateStore, useAppStore } from "src/models/ReduxStore";

import { BlurView } from "@react-native-community/blur";
import env from "res/env";
import InfoBar from "src/components/InfoBar";
import cloud from "src/cloud";
import  database  from "@react-native-firebase/database"
import gear_svg from "res/svgs/gear.svg"
import { BetaOnly, decodeKey, getDateTime, getThreadId, Logout, Session } from "src/commons";
import clientStorage from "core/clientStorage";
import BottomBar from "src/components/BottomBar";
import { Alert } from "react-native";
import Avatar from "src/components/Avatar";
import moment from "moment";
import TextField from "src/components/TextField";

interface AdminHomeprops {
  componentId: any;
}
var ref:any=undefined
var listener:any=undefined
function onLogout(){
  ref?.off("value",listener)
  ref=undefined
  console.log("Realtime closed")

}

//var cache:any=localStorage.getItem("cacheUsers")
export default function AdminHome(props: AdminHomeprops) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Array<types.IUserAudit&{key:string}>>([]);
  const [filter,setFilter]=useState( "yopmail,mailinator")
  const filteredUsers=filter  && users && users.length ? users.filter(x=>{
    let words=filter.split(",")
    return  !words.some(y=> decodeKey(x.key)?.toLowerCase().includes(y))


  })
  :
  users
  const onFocus = () => {
    
    //cache ? setUsers(JSON.parse(cache)): 
    setLoading(true)
    cloud.admin.getUsers().then(u=>{
        let sorted=u.sort((a,b)=> ((a.signed_on || "") >(b.signed_on || "" ) ? -1:1))
       // localStorage.setItem("cacheUsers",JSON.stringify(sorted))
        setUsers(sorted)
    }).finally(()=>setLoading(false))
    //cache && console.log("Cache load")
 

    
  };

  useEffect(() => {
    if (Platform.OS != "web") {
      let s = Navigation.events().registerComponentDidAppearListener((x) => {
        if (x.componentId == props.componentId) {
          onFocus();
        }
      });

      return () => s.remove();
    } else onFocus();
  }, []);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={{  }}>
          <ConHeader title="Admin" 
          
          rightComponent={()=>(<Text
            onPress={()=>{
                Alert.alert("Sign Out?","You would me signed out of your Game On! account",[{text:"No"},{text:"Yes",onPress:Logout}])
            }}
           >Log out</Text>)}
          />
        </View>
        <TextField label="Filter"
        value={filter}
        onChangeText={t=>setFilter(t)}
        bodyStyle={{marginHorizontal:0,marginBottom:rh(10)}}
      
      />
        <Text style={{}}>Showing {filteredUsers.length} filtered users sorted by creation date.</Text>
        {filteredUsers.map((u,i)=>{
            let s=JSON.stringify(u,null,4)
        return (<UserCard key={u.key} user={u} />)
      })

      }
      
      </ScrollView>
      {loading && (
        <View
          style={{
            position: "absolute",
            alignItems: "center",
            height: "100%",
            backgroundColor: "rgba(127,127,127,0.5)",
            width: rw(375),
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color="black" />
        </View>
      )}
    </>
  );
}
function UserCard(props:{user:types.IUserAudit &{key:string}}){
    let c=props.user
     return (
        <View  key={c.key} >
          <View
           
            style={{
              marginTop: 15,
              flex: 1,
              flexDirection: 'row',
            }}>
            <Avatar
              name={c.full_name || '-'}
              source={c.img?.startsWith("http") ? {uri:c.img}: { uri:'data:image/png;base64,'+c.img} }
              style={{
                width: rw(50),
                height: rh(50),
                borderRadius: rh(25),
                borderWidth:1
              
              }}
            />

            <View
              style={{
                flex: 1,
                marginLeft: 12,
                alignSelf: 'center'
              }}>
              <Text
                style={{
                  fontFamily: 'Outfit',
                  fontWeight: '600',
                  color : c.deleted_on ? "gray":undefined
                }}>
                {c.full_name} {c.verified_on ? "(verified)":""}
              </Text>
              <Text
                style={{
                  color:colors.darkGreen,
                  marginTop: 3,
                }}>
                  {decodeKey(c.key)}
                  {'\n'}
                  Account created: {c.signed_on ? getDateTime(c.signed_on) :"Not known"} 
                  {'\n'}
                  Signup completed: {c.created_on ? getDateTime(c.created_on) :"Not completed"}
                  {c.verified_on && '\nVerified on: ' + getDateTime(c.verified_on)}
                  {'\n'}
                  Payment: {c.payment_on ? getDateTime(c.payment_on) : (c.is_on_trial ? "Trial" : "Not paid")} 
                  {'\n'}
                  Booked: {c.booked_on ? getDateTime(c.booked_on) :"No Booking"} 
                  {c.scheduled_on && '\nLatest meeting: ' + getDateTime(c.scheduled_on)}
                  {c.deleted_on && '\nDeleted on: ' + getDateTime(c.deleted_on)}
                  
              </Text>
            </View>
           
          </View>
          <View
            style={{
              marginTop: 10,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              width: '100%',
              opacity: 0.15,
            }}
          />
        </View>
      );
}

coreOptions(AdminHome, {
  useSafeAreaView: true,
  getBodyStyle: () => ({}),
});

const styles = StyleSheetRW.create(() => ({
  recomendedContainer: {
    borderRadius: 14,
    overflow: "hidden",
    flex: 0,
    backgroundColor: "white",
    paddingHorizontal: rw(10),
    paddingVertical: rh(5),
    flexDirection: "row",
    alignSelf: "flex-start",
    minHeight: fs(16) * (Platform.OS == "web" ? 1.5 : 1.4),
    alignItems: "flex-start",
  },
}));
