import { fs, rh, rw } from "core/designHelpers";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Video from 'twilio-video';
import {BsMicFill,BsMicMute,BsCameraVideoOff as BsVideoMute,BsCameraVideoFill as BsVideoFill} from 'react-icons/bs'
import navhelper from "core/navhelper";
import Header from "src/components/Header";
import { coreOptions } from "core/core";
import ProIndividualChat from "../../../provider/ProTabs/ProChat/ProIndividualChat";
import ChatScreen from "../../../ChatScreen";
import cloud from "src/cloud/cloud";
import { useWindowSize } from "src/screens/windowSize";

interface TwilioVideoCallProps {
	token: string, 
	is_provider: boolean,
	to: { email: string, name: string, img: any, bookingId: string, isTrialBooking: boolean, dateTimeUTC: string }
}

export default function TwilioVideoCallWeb({ token, to, is_provider }: TwilioVideoCallProps) {
    const [room, setRoom] = useState<any>(null);
    const [participants, setParticipants] = useState<any>([]);
    const shouldDisplayChat = useWindowSize().width > 992 ? true : false;

    const getOtherPersonTitle = () => {
        return to?.name || '';
    }

    useEffect(() => {
    
        const participantConnected = (participant: any) => {
            setParticipants((prevParticipants: any) => [...prevParticipants, participant]);

            if(is_provider) {
                if(to.isTrialBooking) {
                    cloud.setUserSubStatus({userEmail: to.email, subStatus: "trial_completed"});
                }

                cloud.setMeetingCompleted({bookingId: to.bookingId, dateTimeUTC: to.dateTimeUTC});
            }            
        };
    
        const participantDisconnected = (participant: any) => {

            setParticipants((prevParticipants: any) =>
                prevParticipants.filter((p: any) => p !== participant)
            );
           
        };
     
        Video.connect(token).then((room: any) => {
            console.log(room)
            setRoom(room);
            room.on('participantConnected', participantConnected);
            room.on('participantDisconnected', participantDisconnected);
            room.participants.forEach(participantConnected);
        }).catch(e => {
            console.log(e)
        })


        return () => {
            setRoom((currentRoom: any) => {
                if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                    currentRoom.localParticipant.tracks.forEach(function (trackPublication: any) {
                        trackPublication.track.stop();
                    });
                    currentRoom.disconnect();
                    return null;
                } else {
                    return currentRoom;
                }
            });
        };
    }, []);

    const remoteParticipants = participants.map((participant: any) => (
        <Participant 
					otherPersonTitle={getOtherPersonTitle()}
					key={participant.sid} participant={participant} 
				/>
    ));
 
    console.log(">>", participants)

    return (<View style={{width:"100%",paddingHorizontal:rw(16),paddingBottom:rh(16),height:"100%",display:"flex",flexDirection:"column"}}>
    <Header title="Call" noPadHorizontal />
 <Text style={{fontSize:fs(24)}}>
    {!!room ? `Call connected` 
    :"You may be asked to grant camera and mic permissions.\nConnecting...."}
    </Text>
 
    <View style={{marginTop: 5, width:'100%',display:"flex",flex:1,flexDirection:'row',backgroundColor:"rgba(255,255,255,0.3)"}}>
    <View style={{flex: 3}}>
			{remoteParticipants}
			<View style={{position:"absolute",bottom:rh(40),right:rw(0)}}>
{!!room?.localParticipant &&
            <Participant
                key={room?.localParticipant.sid}
                participant={room?.localParticipant}
                isLocal
								otherPersonTitle={getOtherPersonTitle()}
            />}
    </View>
		</View>
    
			{shouldDisplayChat && <View style={{ flex: 1, padding: 60 }}>
				{ !is_provider && 
					<ChatScreen 
						to={to}
						is_main_view={false}
					/> 
				}
				{ is_provider && 
					<ProIndividualChat
						is_main_view={false}
						to={to}
					/> 
				}
			</View>}
		</View>
    
   
    </View>)



}

const Participant = ({ participant,isLocal, otherPersonTitle }: { participant: any,isLocal?:boolean, otherPersonTitle?: string }) => {

    const [videoTracks, setVideoTracks] = useState<Array<any>>([]);
    const [audioTracks, setAudioTracks] = useState<Array<any>>([]);

    const [muted,setMute]=useState(false)
    const [videoMuted,setVideoMute]=useState(true)

    const videoRef = useRef<any>();
    const audioRef = useRef<any>();
    
    const trackpubsToTracks = (trackMap: any) => 
                                Array.from(trackMap?.values())
                                .map((publication: any) => publication.track)
                                .filter(track => track !== null);

    useEffect(() => {

        const trackSubscribed = (track: any) => {
            if (track.kind === 'video') {
                setVideoTracks((videoTracks: any) => [...videoTracks, track]);
            } else {
                setAudioTracks(audioTracks => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = (track: any) => {
            if (track.kind === 'video') {
                setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
            } else {
                setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
            }
        };


        setVideoTracks(trackpubsToTracks(participant?.videoTracks));
        setAudioTracks(trackpubsToTracks(participant?.audioTracks));

        participant.on('trackSubscribed', trackSubscribed);
        participant.on('trackUnsubscribed', trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);
       
    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            isLocal &&  videoTracks.forEach(t=>t.disable())
            try{
            videoTrack.attach(videoRef.current);
            }
            catch(e){
                    console.warn(e)
            }
            return () => {
                try {
                videoTrack.detach();
                }
                catch(e){
                    console.warn(e)
                }
            };
        }   
    }, [videoTracks]);  

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            try {
            audioTrack.attach(videoRef.current);
            }
            catch(e){
                    
            }
            return () => {
                try {
                audioTrack.detach();
                }
                catch(e){
                    console.warn(e)
                }
            };
        }
    }, [audioTracks]);

    const styleLocal={width:rw(200),height:rh(200),backgroundColor:'black'}
    const styleOther={backgroundColor:'black'}
    const muteIcon=muted ?<BsMicMute color="gray" style={{height:rh(32),width:rh(32)}}/> : <BsMicFill color="green" style={{height:rh(32),width:rh(32)}}/>
    const videoIcon=videoMuted ?<BsVideoMute color="gray" style={{height:rh(32),width:rh(32)}}/> : <BsVideoFill color="green" style={{height:rh(32),width:rh(32)}}/>
    useEffect(
        ()=>{
            if (audioTracks && isLocal){
            if (muted){
                audioTracks.forEach(t=>t.disable())
            }
            else {
                audioTracks.forEach(t=>t.enable())
            }
        }
        }
        
        ,[muted])
        useEffect(
            ()=>{
                if (videoTracks && isLocal){
                if (videoMuted){
                    videoTracks.forEach(t=>t.disable())
                }
                else {
                    videoTracks.forEach(t=>t.enable())
                }
            }
            }
            
            ,[videoMuted])
    
    return (
        <div >
            <View style={{display:"flex",flex:1,flexDirection:"column"}} >
            <video width="100%" height={rh(722)} style={isLocal ? styleLocal:styleOther} ref={videoRef} autoPlay={true} />
						<div style={{position:'absolute',top: 5, left: 5, color: '#fff', }}>
							{ isLocal ? 'You' : otherPersonTitle }
						</div>
        <div style={{position:'absolute',bottom:0,left:0,display:'flex',flexDirection:'row'}}>
      { !! isLocal &&    
       <TouchableOpacity onPress={()=>setMute(!muted)}>
      {muteIcon}
       </TouchableOpacity>
       }
         { !! isLocal &&    
       <TouchableOpacity onPress={()=>setVideoMute(!videoMuted)}>
      {videoIcon}
       </TouchableOpacity>
       }
       </div>
      </View>

            <audio ref={audioRef} autoPlay={true} muted={true} />
        </div>
    );
}

coreOptions(Participant, {
    useSafeAreaView: true,
    noBottomBar: true,
    getBodyStyle: () => ({ width: "100%", height: "100%" }),

})
