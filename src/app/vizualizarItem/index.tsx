import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {Pressable, StyleSheet, View,Text, Alert, FlatList, Linking} from 'react-native';
import { useClienteOuProdutoDatabase } from '../database/useClienteOuProdutoDatabase';
import { useEffect, useState } from 'react';
import { ClienteVendasItemProps, useVendasDatabase } from '../database/useVendasDatabase';

import { ClienteVendasItem } from '@/componentes/clienteVendasItem';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';

export default function VizualizarItem(){
    const {id,nome,telefone,preco,tabela} = useLocalSearchParams();
    const [itensClientes,setItensClientes] = useState<ClienteVendasItemProps[]>([]);
    const [quantidadeProdutoSelecionado,setQuantidadeProdutoSelecionado] = useState(0);

    const clientesOuProdutosDatabase = useClienteOuProdutoDatabase();
    const vendasDatabase = useVendasDatabase();

    async function deletarCliente() {
        try {
            await clientesOuProdutosDatabase.deletarCliente(Number(id));
            router.back();
        } catch (error:unknown) {
            if((error instanceof Error)&& error.message.includes("FOREIGN KEY constraint failed")){
                Alert.alert("Aviso","Esse cliente não pode ser excluído porque existe pelo menos uma venda dele.")
            }
            console.log(error);
        }
    }

    async function deletarProduto() {
        try {
            await clientesOuProdutosDatabase.deletarProduto(Number(id));
            router.back();
        } catch (error:unknown) {
            if((error instanceof Error)&& error.message.includes("FOREIGN KEY constraint failed")){
                Alert.alert("Aviso","Esse produto não pode ser excluído porque existe pelo menos uma venda dele.")
            }
            console.log(error);
        }
    }

    function deletarItem(){
        if(tabela=="clientes"){
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
            
            
        }else if(tabela=='produtos'){
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

    async function listarItensRelacionados() {
        try {
            const itensCliente = await vendasDatabase.listarClienteRelacionado(Number(id));
            setItensClientes(itensCliente);
        } catch (error) {
            console.log(error);
        }
    }

    async function contarProduto() {
        try {
            const quantidadeProduto = await vendasDatabase.contarVendasProdutos(Number(id));


            if(quantidadeProduto)
            setQuantidadeProdutoSelecionado(Number(quantidadeProduto.totalVendas));
        } catch (error) {
            console.log(error);
        }
    }

    function conversarNoWhatsApp(telefone:string=""){
        const newTelefone = telefone.replace(/\D/g, '');
        Linking.openURL(`http://api.whatsapp.com/send?phone=+55${newTelefone}&text=`);

    }

    useEffect(()=>{
        if(tabela=='clientes'){
            listarItensRelacionados();
        }else if(tabela=="produtos"){
            contarProduto();
        }
    },[tabela]);
    
    return(
        <View style={{flex:1,flexDirection:"column",backgroundColor:"#451a03"}}>
        <ExpoStatusBar backgroundColor='#451a03'/>
            <View style={style.container}>
                <Pressable onPress={()=> router.back()} >
                    <FontAwesome name="chevron-left" size={24} color="white" />
                </Pressable>
                <View style={style.containerInformacoes}>
                    <View >
                        <Text numberOfLines={3} ellipsizeMode="tail" style={style.informacoesItemTitulo}>{nome}</Text>
                        {tabela=="clientes" &&
                        <Text style={style.informacoesItem}>{telefone}</Text>
                        }
                        {tabela=="produtos" &&
                        <Text style={style.informacoesItem}>{preco} R$</Text>
                        }

                    </View>


                    <View style={style.icones}>

                    {tabela=="clientes" &&
                    <Pressable >
                        <FontAwesome name="whatsapp" size={28} color="white" onPress={()=> conversarNoWhatsApp(String(telefone))}/>
                    </Pressable>
                    }
                    <Pressable onPress={()=> router.push({pathname: `/editarItem`,params:{id,tabela:tabela}})}>
                        <FontAwesome name="edit" size={28} color="white" />
                    </Pressable>
                    <Pressable onPress={deletarItem}>
                        <FontAwesome name="trash-o" size={28} color="white"  />
                    </Pressable>
                    </View>
                </View>
            </View>

            <View style={style.containerListaItem}>
                {tabela === 'clientes' ? (
                    itensClientes.length > 0 ? (
                    <FlatList 
                    data={itensClientes} 
                    keyExtractor={(item) => String(item.id)} 
                    renderItem={({item}) => (
                        <ClienteVendasItem 
                        id={item.id} 
                        nome={item.nome} 
                        data_entrega={item.data_entrega} 
                        valor_total={item.valor_total} 
                        nome_aniversariante={item.nome_aniversariante}
                        tema_festa={item.tema_festa}
                        status_entrega={item.status_entrega}
                        />
                    )}

                    contentContainerStyle={{ gap: 10, paddingBottom: 70 }}
                    />
                ) : (
                    <Text>O {nome} não comprou ainda.</Text>
                    )
                ) : tabela === 'produtos' && (
                <Text>{nome} foi vendido {quantidadeProdutoSelecionado} vezes.</Text>
                )}
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        height: "20%",
        backgroundColor: "#451a03",
        justifyContent: "flex-end",
        gap:10,
        paddingHorizontal: 30,
        paddingBottom:10,
        borderColor: "white",
    
        // Sombras para iOS
        shadowColor: '#451a03',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    informacoesItemTitulo:{
        color:"white",
        fontSize:24,
        fontWeight:"bold",
        width:200,
        
    },
    informacoesItem:{
        color:"white",
        fontSize:16,
    },
    icones:{
        
        flexDirection:"row",
        gap:20,
        justifyContent:"flex-end",
        alignItems:"flex-end"
    },
    containerInformacoes:{
        flexDirection: "row",
        justifyContent:"space-between",
        
    },
    containerListaItem:{
        padding:30,
        backgroundColor: "#fdf2f8",
        flex: 1,
        borderTopEndRadius:20,
        borderTopStartRadius:20,
        
    }
});