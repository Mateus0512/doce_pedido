import { useVendasDatabase } from "@/app/database/useVendasDatabase";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, View, Text, Pressable, Alert} from "react-native";

export interface AgendaItemProps {
    title: string;
    dados: {
        id: number,
        nome: string;
        nome_aniversariante: string;
        tema_festa: string;
        valor_total: number;
    }[];
    listarItens: () => void 
}

export function AgendaItem({title, dados,listarItens}: AgendaItemProps){
    const vendasDatabase = useVendasDatabase();

    function confirmarEntrega(id:number){
        Alert.alert('Aviso', 'Deseja confirmar a entrega ?', [
            {
                text: "Cancelar",
                onPress: () => {}
            },
            {
                text: "Confirmar",
                onPress: () => confirmarStatus(id)
            }
        ]);
    }

    async function confirmarStatus(id:number) {
        try {
            await vendasDatabase.alterarStatus(id,1);
            Alert.alert("Venda entregue.")
            listarItens();
        } catch (error) {
            console.log(error);
        }
    }

    function compararDataEntrega(){
        const dataEntrega = new Date(title+"T00:00:00");
        const dataAtual = new Date();

        dataEntrega.setHours(0,0,0,0);
        dataAtual.setHours(0,0,0,0);

        if(dataEntrega<dataAtual){
            return true
        }else if(dataEntrega>dataAtual){
            return false
        }else{
            return true
        }
    }




    return(
        <View style={style.container}>
            <View style={style.container}>
                <Text style={style.title}>{`${title.split('-')[2]}/${title.split('-')[1]}/${title.split('-')[0]}`}</Text>
            </View>
            {dados.map(item=> {
                return(
                    <Pressable key={item.id+item.nome} style={style.card} onPress={()=> router.push({pathname:'/visualizarVenda',params: {id:item.id}})}>

                        <View style={style.viewNome}>
                            <Text>Cliente: {item.nome}</Text>
                            <Text>Tema da Festa: {item.tema_festa}</Text>
                            <Text>Valor Total: {item.valor_total}R$</Text>
                            
                        </View>

                        <View style={style.icones} >
                            {compararDataEntrega()==true &&
                                <Pressable  onPress={()=> confirmarEntrega(item.id)}>
                                    <FontAwesome name="check-square-o" size={32} color="#451a03" />
                                </Pressable>
                            }
                            
                        </View>

                    </Pressable>
                )
            })}
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        
        
    },
    title:{
        fontSize: 16,
        fontWeight:"bold",
        color:"#451a03"
    },
    card:{
        width: "100%",
        height: 100,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginVertical:10,
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
        
    }

});