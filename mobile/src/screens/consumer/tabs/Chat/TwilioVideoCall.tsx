import { coreOptions } from 'core/core';
import { fs, FULL_SCREEN, rh, rw } from 'core/designHelpers';
import navhelper from 'core/navhelper';
import React, { Component, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Clipboard, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc';
import WebView from 'react-native-webview';
import colors from 'res/colors';
import { useAppStore } from 'src/models/ReduxStore';
import TwilioVideoCallWeb from './TwilioVideoCallWeb';
import SafeAreaInsets from 'src/components/SafeAreaInsets';
import video_off_svg from "res/svgs/video_off.svg"
import mic_mute_svg from "res/svgs/mic_mute.svg"
import refresh from "res/svgs/refresh.svg"
import end_call from "res/svgs/end_call.svg"
import defaultProfile_png from "res/img/defaultProfile.png"
import FarImage from 'core/FarImage';
import KeepAwake from 'react-native-keep-awake';
var mounted=false;
const TwilioVideoCall = (props:any) => {
  const active_provider=useAppStore(p=>p.active_provider)
  const [compact,setCompact]=useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState(props.token);
  const twilioRef = useRef<any>(null);
  const [pro_video_disabled, set_pro_video_disabled]=useState(true)
  const subscription_status=useAppStore(p=>p.subscription_status)
    const IsSubError=subscription_status && subscription_status!='active'

  const _onConnectButtonPress = () => {
    twilioRef.current?.connect({ accessToken: token });
    setStatus('connecting');
  }
  
  useEffect(()=>{
    mounted=true
    if (IsSubError){
      Platform.OS=='web' ?setTimeout(()=>navhelper.goBack(),1000)
      : props.onEnd()
    }
    else 
    _onConnectButtonPress()
    return ()=>{
        mounted=false
    }
  },[])
  const _onEndButtonPress = () => {
    mounted=false
    twilioRef.current.disconnect();
    props.onEnd()
    //navhelper.goBack()
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled:any) => setIsAudioEnabled(isEnabled));
  };
  const _onVideoButtonPress = () => {
    twilioRef.current
      .setLocalVideoEnabled(!isVideoEnabled)
      .then((isEnabled:any) => setIsVideoEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}:any) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({ roomName, error }:any) => {

    console.log('[Disconnect]ERROR: ', error,typeof error,mounted);
    mounted=false
    twilioRef.current?.disconnect();
    props.onEnd()
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = (error:any) => {
    console.log('[FailToConnect]ERROR: ', error);
    mounted=false
    twilioRef.current?.disconnect();
    props.onEnd()
    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }:any) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);
    set_pro_video_disabled(!track.enabled)
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }:any) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(new Map([...videoTracksLocal]));
  };
  if (Platform.OS=="web")
  return TwilioVideoCallWeb(props);

  console.log("Render")
  return (
    <View onStartShouldSetResponder={()=>{
      setCompact(false)
      return compact
    }} style={[styles.container,compact ?{ height:rh(215),width:rw(120),top:rh(119),right:rw(16)}:{}]}>
      {
       ( status === 'disconnected') &&
  
      
        <ActivityIndicator color={"black"}  size={"large"}/>
        
  
      }

      {
        (status === 'connected' || status === 'connecting') &&
          <View style={styles.callContainer}>
            {status=='connected' && <KeepAwake />}
          {
           
            <View style={styles.remoteGrid}>
              <View style={{position:'absolute',width:'100%',height:"100%",justifyContent:'center',alignItems:'center'}} >
                <FarImage source={{uri:active_provider?.img}} loadingIndicatorSource={defaultProfile_png} style={{height:rh(161),width:rh(161),borderRadius:100}}/>
                { (status === 'connected' && !!Array.from(videoTracks).length) ?
                  <Text style={[styles.font,{fontSize:fs(16)}]}>{active_provider?.name} is in the call</Text>
                  :
                  <Text style={[styles.font,{fontSize:fs(16)}]}>Session with{'\n'}{active_provider?.name}</Text>
                }
                </View>
              { status === 'connected' && !pro_video_disabled && Array.from(videoTracks).slice(-1).map (([trackSid, trackIdentifier],) => {
                  
                  return (
                    <TwilioVideoParticipantView
                      style={styles.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />
                  )
                })
              }
            </View>
          }
          { !compact && <>
          <View
            style={[styles.optionsContainer,{bottom:SafeAreaInsets.BOTTOM}]}>
           
            <CallButton
              Icon={video_off_svg}
              onPress={_onVideoButtonPress}
              title={ isVideoEnabled ? "Turn off\nvideo" : "Turn on\nvideo" }
              disabled={!isVideoEnabled}
            />
            <CallButton
              Icon={mic_mute_svg}
              onPress={_onMuteButtonPress}
              title={ isAudioEnabled ? "Mute\n" : "Unmute\n" }
              disabled={!isAudioEnabled}
            />
            <CallButton
              Icon={refresh}
        
              onPress={_onFlipButtonPress}
              title={"Switch\nCamera"}/>
            
            <CallButton
              Icon={end_call}
              onPress={_onEndButtonPress}
                title={"End Call\n"}/>
            
           
          </View>
          <TouchableOpacity onPress={()=>{ setCompact(true) }}  style={{backgroundColor:'rgba(0,0,0,0.2)',alignItems:'center',justifyContent:"center",width:rw(44),height:rh(44),borderRadius:100, position:'absolute',top:rh(50),left:10}}>
              <Text style={{color:'white'}}>V</Text>
          </TouchableOpacity>
          <TwilioVideoLocalView
              enabled={true}
              style={styles.localVideo}
              applyZOrder={true}
            />
         </>}
        </View>
      }

      <TwilioVideo
        ref={ twilioRef }
        onRoomDidConnect={ _onRoomDidConnect }
        onRoomDidDisconnect={ _onRoomDidDisconnect }
        onRoomDidFailToConnect= { _onRoomDidFailToConnect }
        onParticipantAddedVideoTrack={ _onParticipantAddedVideoTrack }
        onParticipantRemovedVideoTrack= { _onParticipantRemovedVideoTrack }
        onParticipantEnabledVideoTrack={()=>{
        set_pro_video_disabled(false)

        }}
        onParticipantDisabledVideoTrack={()=>{
            set_pro_video_disabled(true)

        }}
      />
    </View>
  );
}
function CallButton(props:{onPress:any,title:string,Icon:any,disabled?:boolean}){
  const {Icon,disabled}=props
  const fill=disabled ? colors.lightGreen : 'white'
  
  return ( <TouchableOpacity
  style={{alignItems:'center'}}
    onPress={props.onPress}>
       <View style={[styles.optionButton,Platform.OS=='android' ?{borderWidth:2,borderColor:disabled ? "white":'rgba(0,0,0,0.25)'}: {backgroundColor: disabled ? "white":'rgba(0,0,0,0.25)'}]} >
        <Icon fill={fill} stroke={fill} style={{height:rh(44),width:rw(44)}}/>
       </View>
    <Text style={styles.font} numberOfLines={2}>{props.title}</Text>
  </TouchableOpacity>)

}

TwilioVideoCall.connectConfig={noPhoneWindow:Platform.OS=='web' }

const styles=StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:colors.darkGreen,
      justifyContent:"center",
      alignItems:"center",
      position:'absolute',
    
      width:'100%',
      height:'100%'
    },
    callContainer: {
      flex: 1,
      position: "absolute",
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
    },
    welcome: {
      fontSize: 30,
      textAlign: "center",
      paddingTop: 40,
    },
    input: {
      height: 50,
      borderWidth: 1,
      marginRight: 70,
      marginLeft: 70,
      marginTop: 50,
      textAlign: "center",
      backgroundColor: "white",
    },
    button: {
      marginTop: 100,
    },
    localVideo: {
      flex: 1,
      width: rw(120),
      height: rh(215),
      position: "absolute",
      right: 10,
      top: rh(50),

    },
    remoteGrid: {
      flex: 1,

      flexWrap: "wrap",

     
    },
    remoteVideo: {
    
      width: '100%',

      flex:1,

   

    },
    optionsContainer: {
      position: "absolute",
      left: 0,
      bottom: 0,
      right: 0,
      height: 100,
      
      flexDirection: "row",
      alignItems: "center",
      justifyContent:'space-between',
      paddingHorizontal:rw(16)
    },
    optionButton: {
      width: 60,
      height: 60,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 100 / 2,
      backgroundColor:'rgba(0,0,0,0.25)',
      justifyContent: "center",
      alignItems: "center",
    },
    font:{
      fontFamily:"Outfit",
      fontSize:fs(12),
      fontWeight:"400",
      color:"white",
      marginTop:rh(4),
      textAlign:'center'
    }
  });

 
  coreOptions(TwilioVideoCall,{noBottomBar:true})
  export default TwilioVideoCall