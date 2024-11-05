import { ClienteVendasItemProps} from "@/app/database/useVendasDatabase";
import { router } from "expo-router";
import { Pressable, StyleSheet, View, Text } from "react-native";


export function ClienteVendasItem({id,nome,data_entrega,nome_aniversariante,tema_festa,valor_total,status_entrega }:ClienteVendasItemProps){
    return(
        <Pressable style={style.container} onPress={()=> router.push({pathname:'/visualizarVenda',params:{id}})}>
                <View style={style.cabecalho}>
                    <Text style={style.titulo}>{tema_festa}</Text>
                </View>
                <View style={style.informacoes}>

                    <View>
                        <Text style={style.negrito}>{nome_aniversariante}</Text>
                        <Text >{`${data_entrega.split('-')[2]}/${data_entrega.split('-')[1]}/${data_entrega.split('-')[0]}`}</Text>
                        <Text>{valor_total}R$</Text>
                    </View>
                    <View style={style.alinharFinal}>
                        <Text>{status_entrega=="0" ? "Pendente" : "Entregue"}</Text>
                    </View>
                </View>

        </Pressable>
    )
}

const style = StyleSheet.create({
    container:{
        width:"100%",
        backgroundColor: "white",
        padding: 10,
        borderWidth: 1,
        borderColor: "#f472b6",
        borderRadius: 10,
        justifyContent: "space-between",
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    cabecalho:{
        flexDirection:"column",
        justifyContent:"flex-start"
    },
    titulo:{
        textAlign:"center",
        fontWeight:"bold",
        fontSize:16
    },
    negrito:{
        fontSize:14,
        fontWeight:"bold"
    },
    informacoes:{
        flexDirection:"row",
        justifyContent: "space-between"
    },
    alinharFinal:{
        justifyContent:"flex-end"
    }
});
