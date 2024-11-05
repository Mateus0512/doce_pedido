import { FontAwesome } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { Alert, Pressable, StyleSheet, View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {  useVendasDatabase, VizualizarProdutosVendaProps, VizualizarVendaProps } from "../database/useVendasDatabase";



export default function VizualizarVenda(){
    const {id} = useLocalSearchParams<{id:string}>();
    const [venda,setVenda] = useState<VizualizarVendaProps>();
    const [produtos,setProdutos] = useState<VizualizarProdutosVendaProps[]>([]);

    const vendasDatabase = useVendasDatabase();

    async function deletarVenda() {
        try {
            await vendasDatabase.deletarVenda(Number(id));
            router.back();
        } catch (error) {
            console.log(error);
        }
    }

    function deletar() {
        try {
            Alert.alert('Aviso','Deseja excluir a venda ?',[
                {
                    text: "Cancelar",
                    onPress: () => {}
                },
                {
                    text: "Excluir",
                    onPress: () => deletarVenda()
                }
            ])
        } catch (error) {
            console.log(error);
        }
    }

    async function carregarVenda() {
        try {
            const dadosVenda = await vendasDatabase.listarVenda(Number(id));
            if(dadosVenda)
            setVenda(dadosVenda);

            const dadosProdutos = await vendasDatabase.listarProdutoVenda(Number(id));
            if(dadosProdutos)
            setProdutos(dadosProdutos);
            
        } catch (error) {
            console.log(error);
        }
    }

    async function alterarEntrega() {
        try {
            Alert.alert('Aviso', 'Deseja alterar a entrega ?',[
                {
                    text:"Cancelar",
                    onPress: () => {}
                },
                {
                    text: "Confirmar",
                    onPress: () => trocarStatus()
                }
            ])
            
        } catch (error) {
            console.log(error);
        }
    }

    async function trocarStatus() {
        try {
            if(venda){
                if(venda.status_entrega=="0"){
                    await vendasDatabase.alterarStatus(Number(id),1);
                }else{
                    await vendasDatabase.alterarStatus(Number(id),0);
                }
                Alert.alert("O status da venda foi alterado.")
            }
            
            carregarVenda();
        } catch (error) {
            console.log(error);
        }
    }

    function compararDataEntrega(){
        const dataEntrega = new Date(venda?.data_entrega+"T00:00:00");
        const dataAtual = new Date();

        dataEntrega.setHours(0,0,0,0);
        dataAtual.setHours(0,0,0,0);

        if(dataEntrega < dataAtual){
            return true
        }else if(dataEntrega > dataAtual){
            return false
        }else{
            return true
        }
    }



    useEffect(()=>{
        carregarVenda();
        
    },[id])


    return(
        <View style={{flex:1,backgroundColor:"#451a03"}}>
            <ExpoStatusBar style="light"  backgroundColor='#451a03'/>
            <View style={style.container}>
                <View style={style.barraOpcoes}>
                    <View >
                        <Pressable onPress={()=> router.navigate('/visualizarCadastros/Vendas')}>
                            <FontAwesome name="chevron-left" size={22} color="white" />
                        </Pressable>
                    </View>
                    <View style={style.barraOpcoesDireita}>
                        {compararDataEntrega()==true &&
                            <Pressable  onPress={alterarEntrega}>
                                <FontAwesome name="check-square-o" size={28} color="white" />
                            </Pressable>
                        
                        }
                        
                        <Pressable onPress={()=> router.navigate('/editarVenda/'+id as Href)}>
                            <FontAwesome name="edit" size={28} color="white" />
                        </Pressable>
                        <Pressable onPress={deletar}>
                            <FontAwesome name="trash-o" size={28} color="white"  />
                        </Pressable>
                        
                    </View>
                </View>
                <View style={style.visualizarFormulario}>

                
                <ScrollView style={style.containerInformacoes}>
                    {venda && 
                    <View style={style.informacoes}>
                    <View style={style.item}>
                        <Text style={style.titulo}>Nome do Cliente</Text>
                        <Text>{venda.nome}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Data do Pedido</Text>
                        <Text>{`${venda.data_pedido.split('-')[2]}/${venda.data_pedido.split('-')[1]}/${venda.data_pedido.split('-')[0]}`}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Data de Entrega</Text>
                        <Text>{`${venda.data_entrega.split('-')[2]}/${venda.data_entrega.split('-')[1]}/${venda.data_entrega.split('-')[0]}`}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Nome do Aniversariante</Text>
                        <Text>{venda.nome_aniversariante}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Tema da Festa</Text>
                        <Text>{venda.tema_festa}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Idade a Completar</Text>
                        <Text>{venda.idade_completar}</Text>
                    </View>

                    {produtos.length > 0 && 
                        produtos.map((produto,index)=>{
                            return (
                                <View key={index} >
                                    <View style={style.item}>
                                        <Text style={style.titulo}>Produto {index+1}</Text>
                                        <Text>{produto.nome_produto}</Text>
                                    </View>
                                    <View style={style.item}>
                                        <Text style={style.titulo}>Quantidade</Text>
                                        <Text>{produto.quantidade}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }

                    <View style={style.item}>
                        <Text style={style.titulo}>Valor de Entrada</Text>
                        <Text>{venda.valor_entrada}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Valor Total</Text>
                        <Text>{venda.valor_total}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Data do Pagamento Restante</Text>
                        <Text>{`${venda.data_pagamento_restante.split('-')[2]}/${venda.data_pagamento_restante.split('-')[1]}/${venda.data_pagamento_restante.split('-')[0]}`}</Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.titulo}>Status do Pedido</Text>
                        <Text>{venda.status_entrega=="0" ? "Pendente" : "Entregue"}</Text>
                    </View>
                    <View style={style.ultimoItem}>
                        <Text style={style.titulo}>Observações</Text>
                        <Text>{venda.observacoes}</Text>
                    </View>
                    </View>
                    }
                </ScrollView>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,


    },
    barraOpcoes:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-end",
        paddingHorizontal:30,
        paddingBottom:10,
        backgroundColor: '#451a03',
        height:110,
        borderColor: "#451a03",

    
        // Sombras para iOS
        shadowColor: '#451a03',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
        
        
    },
    barraOpcoesDireita:{
        flexDirection:"row",
        gap:20
    },
    containerInformacoes:{
        paddingTop:10,
        paddingHorizontal:5,
        paddingBottom:100,

        
    },
    item:{
        marginVertical: 5,
        gap: 2
    },
    titulo:{
        fontSize:15,
        fontWeight:"bold"
    },
    ultimoItem:{
        marginVertical: 5,
        gap: 2,
        paddingBottom:50
    },
    informacoes:{
        borderRadius:20,
        
        padding:25,

        overflow:"hidden"
    },
    visualizarFormulario:{
        borderTopEndRadius:20,
        borderTopStartRadius:20,
        flex:1,
        backgroundColor:"#fdf2f8"
    }


});