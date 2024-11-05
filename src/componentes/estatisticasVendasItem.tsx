import { View, Text, StyleSheet } from "react-native";

export interface EstatisticasVendasItemProps{
    nome:string
    ultimaLinha: boolean
    quantidade: number
    valor_total:number 
}

export function EstatisticasVendasItem({nome,quantidade,ultimaLinha,valor_total}:EstatisticasVendasItemProps){
    return(
        <View style={!ultimaLinha ? style.container : style.ultimaLinha}>
            <View style={style.view}>
                <Text style={style.textoTabelaPontaEsquerda}>{nome}</Text>
            </View>
            
            <View style={style.view}>
                <Text style={style.textoTabelaCentro}>{quantidade}</Text>
            </View>
            <View style={style.view}>
                <Text style={style.textoTabelaPontaDireita}>{valor_total+"R$"}</Text> 
            </View>
             
        </View>
    )
}


const style = StyleSheet.create({
    container:{
        width: "100%",
        height: 30,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        overflow:"hidden",
        
        flexDirection:"row",
        justifyContent: "space-between",
        backgroundColor:"#fff",
        borderColor: "#f472b6",

    
        // Sombras para iOS
        shadowColor: '#f472b6',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    
    },
    textoTabela:{
        alignContent:"center",
        textAlign: "center",
        alignSelf:"center",
        marginHorizontal:10,
        

    },
    ultimaLinha:{
        width: "100%",
        height: 30,
        
        flexDirection:"row",
        justifyContent: "space-between",
        backgroundColor:"#fff",
        borderBottomWidth:1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#f472b6",
        borderEndStartRadius:20,
        borderEndEndRadius:20,

    
        // Sombras para iOS
        shadowColor: '#f472b6',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    textoTabelaCentro:{
        alignContent:"center",
        textAlign: "center",
        alignSelf:"center",
    },
    textoTabelaPontaEsquerda:{
        alignContent:"center",
        textAlign: "center",
        alignSelf:"flex-start",
        marginHorizontal:10,

    },
    textoTabelaPontaDireita:{
        alignContent:"center",
        textAlign: "center",
        alignSelf:"flex-end",
        marginHorizontal:10,

    },
    view:{
        width:"33%",
        alignItems:"center",
        justifyContent:"center"
    }
    
});