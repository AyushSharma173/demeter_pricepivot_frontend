import app from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging'

messaging().requestPermission()
//    messaging().registerDeviceForRemoteMessages().then(x=>{
//     console.log(x)
//    }).then(x=>{
//     console.log(x)
//    })
messaging().getToken().then(x=>{
    console.log(x)
})
messaging().onMessage((x)=>{
alert(x)
})
    console.log(app.app().name,app.app().options)


    messaging().requestPermission()
//    messaging().registerDeviceForRemoteMessages().then(x=>{
//     console.log(x)
//    }).then(x=>{
//     console.log(x)
//    })
messaging().getToken().then(x=>{
    console.log(x)
})
messaging().onMessage((x)=>{
alert(x)
})
    console.log(app.app().name,app.app().options)