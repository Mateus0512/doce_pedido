import { View } from "react-native";
import Constants from "expo-constants";

export function StatusBar(){
    return(
        <View style={{height: Constants.statusBarHeight, backgroundColor: '#451a03', position:"absolute",top:0,left:0,right:0,zIndex: 1000}}></View>
    )
}