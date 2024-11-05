import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { StatusBar } from "./statusBar";
import { StyleSheet, View, Text, Pressable} from "react-native";
import { FontAwesome} from "@expo/vector-icons";
import { router } from "expo-router";

export function Cabecalho(props:{titulo:string,botaoVoltar:boolean}){
    return(
        <>
        <ExpoStatusBar backgroundColor="#451a03" style="light"/>
        <StatusBar/>
        
        <View style={style.cabecalho}>
            {props.botaoVoltar &&
                <Pressable onPress={()=> router.back()} style={style.botaoVoltar}>
                    <FontAwesome name="chevron-left" size={22} color="white" />
                </Pressable>
            }
            
            <Text style={style.titulo}>{props.titulo}</Text>

            
            
        </View>
        </>
    )
}

const style = StyleSheet.create({
    cabecalho:{
        height:110,
        width:"100%",
        backgroundColor:"#451a03",
        justifyContent:"flex-end",
        alignItems:"center",
        borderColor: "#451a03", 
        borderWidth: 1,   
        zIndex:10,
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
        // borderBottomEndRadius:20,
        // borderBottomStartRadius:20,
        
    },
    titulo:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold",
        marginBottom:10,
    },
    botaoVoltar:{
        position:"absolute",
        left:25,
        bottom:5,
        padding:5
    },
    botaoQuantidade:{
        position:"absolute",
        right:15,
        bottom:5,
        padding:5,
        backgroundColor:"#fff",
        borderRadius:20,

    },
    tituloBotao:{
        color:"#451a03",
        fontSize:16,
        fontWeight:"bold",
        
        justifyContent:"center",
    },
    botao:{
        backgroundColor:"white",
        borderRadius:50,
        padding:2,
        borderColor: "#000", 
        borderWidth: 1,
        zIndex:10,
        width:30,
        height:30,
        justifyContent:"center",
        alignItems:"center",   
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    

});