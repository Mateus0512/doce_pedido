import { View, StyleSheet, Text } from "react-native";

interface EstatisticasProdutosItemProps{
    nome:string
    ultimaLinha: boolean
    quantidade: number
}


export function EstatisticasProdutosItem({nome,quantidade,ultimaLinha}:EstatisticasProdutosItemProps){
    return(
        <View style={!ultimaLinha ? style.container : style.ultimaLinha}>
            <Text style={style.textoTabela}>{nome}</Text>
            <Text style={style.textoTabela}>{quantidade}</Text> 
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
        marginHorizontal:10
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
    }
});