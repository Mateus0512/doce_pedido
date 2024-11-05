import {  FontAwesome5 } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams , useSegments} from "expo-router";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

export function BackBar(){

    const params = useLocalSearchParams<{nome:string}>();
    const [titulo,setTitulo] = useState('');
    const segments = useSegments();

    useEffect(()=>{
        if(params.nome=="Clientes"){
            if(segments[0]=="visualizarCadastros"){
                setTitulo('Clientes Cadastrados');
            }else if(segments[0]=="vizualizarEstatistica"){
                setTitulo("Estatisticas de Clientes");
            }
            
        }else if(params.nome=="Produtos"){
            if(segments[0]=="visualizarCadastros"){
                setTitulo("Produtos Cadastrados");
            }else if(segments[0]=="vizualizarEstatistica"){
                setTitulo("Estatisticas de Produtos");
            }
        }else if(params.nome=="Agenda"){
            setTitulo("Pedidos Pendentes");
        }else if(params.nome=="Vendas"){
            if(segments[0]=="visualizarCadastros"){
                setTitulo("Vendas Realizadas");
            }else if(segments[0]=="vizualizarEstatistica"){
                setTitulo("Estatisticas das vendas");
            }
            
            
        }
    },[params.nome]);

    return(
        <View style={style.container}>
            <ExpoStatusBar backgroundColor="#451a03"/>
            <View >
                
            </View>
            <Text style={style.titulo}>{titulo}</Text>
            <View style={style.viewBotoes}>
                {((params.nome=="Clientes" && (segments[0]=="visualizarCadastros") || (params.nome=="Produtos" && segments[0]=="visualizarCadastros"))&&
                    <>
                    <Pressable style={style.botao} onPress={()=> router.navigate('/cadastrarItem/'+params.nome as Href)}>
                        <FontAwesome5 name="plus" size={20} color="#451a03" />
                    </Pressable>
                    <Pressable style={style.botao} onPress={()=> router.navigate('/vizualizarEstatistica/'+ params.nome as Href)}>
                        <FontAwesome5 name="chart-bar" size={20} color="#451a03" />
                    </Pressable>
                    </>
                )}

                {((params.nome=="Vendas") && (segments[0]=="visualizarCadastros") &&
                <>
                    <Pressable style={style.botao} onPress={()=> router.navigate('/cadastrarVenda/' as Href)}>
                        <FontAwesome5 name="plus" size={20} color="#451a03" />
                    </Pressable>
                    <Pressable style={style.botao} onPress={()=> router.navigate('/vizualizarEstatistica/'+ params.nome as Href)}>
                        <FontAwesome5 name="chart-bar" size={20} color="#451a03" />
                    </Pressable>
                </>
                )}
                
            </View>
        </View>
    ) 
}

const style = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-end",
        paddingHorizontal:30,
        paddingBottom:10,
        backgroundColor: '#451a03',
        height:110,
        
        borderColor: "#451a03",
        
        // borderBottomEndRadius:20,
        // borderBottomStartRadius:20,
    
        // Sombras para iOS
        shadowColor: '#451a03',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    titulo:{
        color:"#fff",
        fontSize:14,
        fontWeight:"bold"

 
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
    viewBotoes:{
        flexDirection: "row",
        gap:10
    }

});