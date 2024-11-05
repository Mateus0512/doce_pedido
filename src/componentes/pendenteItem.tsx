import { ClienteVendasItemProps } from "@/app/database/useVendasDatabase";
import { router } from "expo-router";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Dimensions } from "react-native";

export function PendenteItem(item:ClienteVendasItemProps){
    return(
        <Pressable style={style.container} onPress={()=> router.push({pathname:'/visualizarVenda',params:{id:item.id}})}>
            <View style={style.status}>
                <Text style={style.tituloStatus}>Pendente</Text>
            </View>
            <View style={style.conteudoCard}>
                <View style={style.conteudoCardEsquerda}>
                    <View>
                        <Text style={style.tituloCard}>Tema da festa</Text>
                        <Text style={style.subtitulo}>{item.tema_festa}</Text>
                    </View>
                    <View>
                        <Text style={style.tituloCard}>Nome do aniversariante</Text>
                        <Text style={style.subtitulo}>{item.nome_aniversariante}</Text>
                    </View>
                    <View>
                        <Text style={style.tituloCard}>Data entrega</Text>
                        <Text style={style.subtitulo}>{`${item.data_entrega.split('-')[2]}/${item.data_entrega.split('-')[1]}/${item.data_entrega.split('-')[0]}`}</Text>
                    </View>
                </View>
                <View style={style.conteudoCardDireita}>
                    <View>
                        <Text style={style.tituloCard}>Cliente</Text>
                        <Text style={style.subtitulo}>{item.nome}</Text>
                    </View>
                    <View></View>
                    <View>
                        <Text style={style.tituloCard}>Valor total</Text>
                        <Text style={style.subtitulo}>{item.valor_total}R$</Text>
                    </View>
                </View>
            </View>

            
            
        </Pressable>
    )
}

const style = StyleSheet.create({
    container:{
        width:(Number(Dimensions.get('window').width)*0.83),
        height:200,
        backgroundColor:"#fff",
        marginTop:30,
        borderRadius:20,
        borderColor: "#f472b6", 
        borderWidth: 1,   
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    status:{
        width:100,
        backgroundColor:"#451a03",
        padding:10,
        borderColor: "#451a03", 
        borderWidth: 1,   
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
        
        borderTopStartRadius:20,
        borderBottomEndRadius:20,

        
    },
    tituloStatus:{
        color:"#fff",
        fontWeight:"bold"
    },
    tituloCard:{
        fontSize:14,
        fontWeight:"bold",
        color:"#ec4899"
    },
    conteudoCard:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
    },
    conteudoCardEsquerda:{
        justifyContent:"space-around",
        marginLeft:10,
        flexDirection:"column"

    },
    conteudoCardDireita:{
        justifyContent:"space-around",
        marginLeft:10,
        flexDirection:"column",
        marginRight:20
    },
    subtitulo:{
        color:"#451a03",
        fontWeight:"bold"
    }
});