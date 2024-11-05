import { Pressable , StyleSheet, View , Text} from "react-native";
import { ItemVendaProps } from '../app/database/useVendasDatabase';
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function VendasItem({id,nome,data_entrega,valor_total, status_entrega}:ItemVendaProps){
    let arrayData = data_entrega.split('-');
    let dataEntrega = arrayData[2]+"/"+arrayData[1]+'/'+arrayData[0]; 
    return(
        <Pressable style={style.container} onPress={()=> router.push({pathname:'/visualizarVenda',params:{id}})}>
            <View style={style.viewNome}>
                <Text  numberOfLines={1} ellipsizeMode="tail"   style={style.titulo}>{nome}</Text>
                <Text>{dataEntrega}</Text>
                <Text>{valor_total} R$</Text>
            </View>

            <View style={style.icones} >
                <Text>{status_entrega=="0" ? <MaterialCommunityIcons name="checkbox-blank-outline" size={24} />: <MaterialCommunityIcons name="checkbox-marked-outline" size={24} />}</Text>     
            </View>
        </Pressable>
    )
}

const style = StyleSheet.create({
    container:{
        width: "100%",
        height: 70,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderWidth: 1,
        borderColor: "#f472b6",
        borderRadius: 10,
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    viewNome:{
        marginLeft: 10,
        justifyContent: "space-around",
        flex:1
    },
    icones:{
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        gap: 15,
        marginRight:10,
        
    },
    titulo:{
        fontSize: 16,
        fontWeight: "bold",

    },
});