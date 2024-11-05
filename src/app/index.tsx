import {View,StyleSheet} from "react-native";
import { Href, router } from "expo-router";
import { useEffect } from "react";
import LottieView from "lottie-react-native";

export default function App(){

    useEffect(()=>{
        setTimeout(()=>{
            router.replace('/home/' as Href)
        },4000)
    },[])


    return(
        <View style={{flex:1}}> 
            <View style={style.animacao}>
                <LottieView source={require('../../assets/images/animacao.json')} autoPlay style={{width:"100%",height:"100%", backgroundColor: '#fdf2f8',}} />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    animacao:{
        flex:1,
        position:"absolute",
        backgroundColor:"#fff",
        zIndex:20,
        top:0,
        left:0,
        right:0,
        bottom:0
    }
});



