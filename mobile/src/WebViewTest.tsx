import { FULL_SCREEN } from 'core/designHelpers';
import React, { Component, useEffect, useRef, useState } from 'react';
import { Button, Clipboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc';
import WebView from 'react-native-webview';

const Example = (props:any) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzkwNGE0NzFjNDBmODI2MTU0MWNkMzFjMjMxMTE4MDBiLTE2NjYzNDM4NjIiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJ6QGdtYWlsLmNvbSIsInZpZGVvIjp7InJvb20iOiJsQGdtYWlsLmNvbSx6QGdtYWlsLmNvbSJ9fSwiaWF0IjoxNjY2MzQzODYyLCJleHAiOjE2NjYzNDc0NjIsImlzcyI6IlNLOTA0YTQ3MWM0MGY4MjYxNTQxY2QzMWMyMzExMTgwMGIiLCJzdWIiOiJBQ2YyZDA4NTAwMWE4OThjYjNiOWZiNmRiNTAwMTMyMjlmIn0.0QJzdDm0JHlniQj-NZKozJ8QIA1oxHaQ_G1c_BQW6yg');
  const twilioRef = useRef<any>(null);

  const _onConnectButtonPress = () => {
    twilioRef.current?.connect({ accessToken: token });
    setStatus('connecting');
  }
  
  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled:any) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}:any) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({ roomName, error }:any) => {
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = (error:any) => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }:any) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

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

    setVideoTracks(videoTracksLocal);
  };

  return (
    <View style={styles.container}>
      {
        status === 'disconnected' &&
        <View>
          <Text style={styles.welcome}>
            React Native Twilio Video
          </Text>
          <TextInput
            style={styles.input}
            autoCapitalize='none'
            value={token}
            onChangeText={(text) => setToken(text)}>
          </TextInput>
          <Button
            title="Connect"
            style={styles.button}
            onPress={_onConnectButtonPress}/>
        
        </View>
      }

      {
        (status === 'connected' || status === 'connecting') &&
          <View style={styles.callContainer}>
          {
            status === 'connected' &&
            <View style={styles.remoteGrid}>
              {
                Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
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
          <View
            style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}>
              <Text style={{fontSize: 12}}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}>
              <Text style={{fontSize: 12}}>{ isAudioEnabled ? "Mute" : "Unmute" }</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}>
              <Text style={{fontSize: 12}}>Flip</Text>
            </TouchableOpacity>
            <TwilioVideoLocalView
              enabled={true}
              style={styles.localVideo}
            />
          </View>
        </View>
      }

      <TwilioVideo
        ref={ twilioRef }
        onRoomDidConnect={ _onRoomDidConnect }
        onRoomDidDisconnect={ _onRoomDidDisconnect }
        onRoomDidFailToConnect= { _onRoomDidFailToConnect }
        onParticipantAddedVideoTrack={ _onParticipantAddedVideoTrack }
        onParticipantRemovedVideoTrack= { _onParticipantRemovedVideoTrack }
      />
    </View>
  );
}

const styles=StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
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
      width: 150,
      height: 250,
      position: "absolute",
      right: 10,
      bottom: 10,
    },
    remoteGrid: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    remoteVideo: {
      marginTop: 20,
      marginLeft: 10,
      marginRight: 10,
      width: 100,
      height: 120,
    },
    optionsContainer: {
      position: "absolute",
      left: 0,
      bottom: 0,
      right: 0,
      height: 100,
      backgroundColor: "blue",
      flexDirection: "row",
      alignItems: "center",
    },
    optionButton: {
      width: 60,
      height: 60,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 100 / 2,
      backgroundColor: "grey",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  function WebViewT(){

    //Clipboard.setString("https://buy.stripe.com/test_7sI5my2dW2HG7de9AA")

  return(<WebView 
    useWebView2
    enableApplePay={true}
    useWebKit={true}
  source={{uri:"https://buy.stripe.com/test_7sI5my2dW2HG7de9AA"}} style={FULL_SCREEN}
   >
    
  </WebView>)
  }
  export default Example