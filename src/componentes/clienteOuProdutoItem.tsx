import { ClienteOuProdutosDatabaseProps, useClienteOuProdutoDatabase } from "@/app/database/useClienteOuProdutoDatabase";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";


export interface ClienteOuProdutoItemProps extends ClienteOuProdutosDatabaseProps {
    listarItens: () => void
    tabela: string
    
}

export function ClienteOuProdutoItem({id,nome,telefone,preco,tabela, listarItens}:ClienteOuProdutoItemProps){
    const clientesOuProdutosDatabase = useClienteOuProdutoDatabase();

    async function deletarCliente() {
        try {
            await clientesOuProdutosDatabase.deletarCliente(id);
            listarItens();
        } catch (error:unknown) {
            if((error instanceof Error)&& error.message.includes("FOREIGN KEY constraint failed")){
                Alert.alert("Aviso","Esse cliente não pode ser excluído porque existe pelo menos uma venda dele.")
            }
            console.log(error);
        }
    }

    async function deletarProduto() {
        try {
            await clientesOuProdutosDatabase.deletarProduto(id);
            
            listarItens();
        } catch (error:unknown) {
            if((error instanceof Error)&& error.message.includes("FOREIGN KEY constraint failed")){
                Alert.alert("Aviso","Esse produto não pode ser excluído porque existe pelo menos uma venda dele.")
            }
            console.log(error);
        }
    }

    function deletarItem(){
        if(tabela=="Clientes"){
            Alert.alert('Aviso','Deseja excluir o cliente ?',[
                {
                    text: "Cancelar",
                    onPress: () => {}
                },
                {
                    text: "Excluir",
                    onPress: () => deletarCliente()
                }
            ])
            
        }else if(tabela=="Produtos"){
            Alert.alert('Aviso','Deseja excluir o produto ?',[
                {
                    text: "Cancelar",
                    onPress: () => {}
                },
                {
                    text: "Excluir",
                    onPress: () => deletarProduto()
                }
            ])
            
        }
    }

    function conversarNoWhatsApp(telefone:string=""){
        const newTelefone = telefone.replace(/\D/g, '');
        Linking.openURL(`http://api.whatsapp.com/send?phone=+55${newTelefone}&text=`);

    }

    return(
        <Pressable style={style.container} onPress={()=> router.push({pathname:'/vizualizarItem',params: {id,nome,telefone,preco,tabela:tabela.toLowerCase()} })}>
            <View style={style.viewNome}>
                <Text  numberOfLines={1} ellipsizeMode="tail"   style={style.titulo}>{nome}</Text>
                <Text>{tabela=="Clientes" && telefone } {tabela=="Produtos" && preco+" R$"}</Text>
            </View>
            <View style={style.icones} >
                <Pressable onPress={deletarItem} >
                    <FontAwesome name="trash-o" size={32} color="#451a03" />
                </Pressable>
                <Pressable onPress={()=> router.push({pathname: `/editarItem`,params:{id,tabela:tabela.toLowerCase() }})}>
                    <FontAwesome name="edit" size={32} color="#451a03"  />
                </Pressable>
                {tabela=="Clientes" &&
                <Pressable onPress={()=> conversarNoWhatsApp(telefone)}>
                    <FontAwesome name="whatsapp" size={32} color="#451a03"  />
                </Pressable>
                }
                
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