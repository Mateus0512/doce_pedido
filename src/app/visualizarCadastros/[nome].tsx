import {useLocalSearchParams } from "expo-router"
import { View , StyleSheet,FlatList, TextInput, TouchableWithoutFeedback, Keyboard} from "react-native";
import { useEffect, useState } from "react";
import { ClienteOuProdutosDatabaseProps, useClienteOuProdutoDatabase } from "../database/useClienteOuProdutoDatabase";
import { ClienteOuProdutoItem } from "@/componentes/clienteOuProdutoItem";

import { ItemVendaProps, useVendasDatabase } from "../database/useVendasDatabase";
import { VendasItem } from "@/componentes/vendasItem";

import { AgendaItem, AgendaItemProps } from "@/componentes/agendaItem";

import { BackBar } from "@/componentes/backBar";
import { Menu } from "@/componentes/menu";


interface AgendaItem {
    id: number,
    nome: string;
    nome_aniversariante: string;
    tema_festa: string;
    valor_total: number;
}


export default function VisualizarCadastros(){
    const [nomePesquisado,setNomePesquisado] = useState('');
    const [clientes,setClientes] = useState<ClienteOuProdutosDatabaseProps[]>([]);
    const [produtos,setProdutos] = useState<ClienteOuProdutosDatabaseProps[]>([]);
    const [vendas, setVendas] = useState<ItemVendaProps[]>([]);
    const [campoPesquisa,setCampoPesquisa] = useState(false);
    const [agenda, setAgenda] = useState<AgendaItemProps[]>([]);

    const params = useLocalSearchParams<{nome:string}>();

    const clientesOuProdutosDatabase = useClienteOuProdutoDatabase();
    const vendasDatabase = useVendasDatabase();


    async function listarItens(){
        if(params.nome==="Agenda"){
            const result = await vendasDatabase.listarAgenda();

            let agendaProvisoria: { [key: string]: AgendaItem[] } = {};

            result.map(item=>{
                if(!agendaProvisoria[item.data_entrega]){
                    agendaProvisoria[item.data_entrega] = [];
                }
                agendaProvisoria[item.data_entrega].push({id:item.id ,nome:item.nome,nome_aniversariante:item.nome_aniversariante, tema_festa: item.tema_festa, valor_total: item.valor_total});
            })

            let novaAgenda:AgendaItemProps[] = []; 
            Object.keys(agendaProvisoria).map(indice=>{
                novaAgenda.push({title: indice, dados: agendaProvisoria[indice],listarItens});
            })

            novaAgenda = novaAgenda.sort((a, b) => {
                const [anoA, mesA, diaA] = a.title.split('-').map(Number);
                const [anoB, mesB, diaB] = b.title.split('-').map(Number);
            
                // Comparação pelo ano
                if (anoA < anoB) return -1;
                if (anoA > anoB) return 1;
            
                // Comparação pelo mês
                if (mesA < mesB) return -1;
                if (mesA > mesB) return 1;
            
                // Comparação pelo dia
                if (diaA < diaB) return -1;
                if (diaA > diaB) return 1;
            
                return 0;
            });

            //console.log(novaAgenda[0].dados);
            setAgenda(novaAgenda);

        }
        
        else if(params.nome==="Clientes"){
            try {
                const result = await clientesOuProdutosDatabase.procurarClientePeloNome(nomePesquisado);
                //console.log(result)
                setClientes(result);


            } catch (error) {
                console.log(error);
            }
        }else if(params.nome==="Produtos"){
            try {
                const result = await clientesOuProdutosDatabase.procurarProdutoPeloNome(nomePesquisado);
                setProdutos(result);
            } catch (error) {
                console.log(error);
            }
        }else if(params.nome==="Vendas"){
            try {
                const result = await vendasDatabase.listarVendas(nomePesquisado);
                // const produtosVendidos = await vendasDatabase.listarVendasProdutos();
                // console.log(produtosVendidos);
                setVendas(result);
            } catch (error) {
                console.log(error);
            }
            
        }

        
    }

    
    useEffect(()=>{
        listarItens();
    },[params.nome,nomePesquisado]);

    

    return(
        <View style={{flex:1,backgroundColor:"#451a03"}}>
            <BackBar/>
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={style.container}>
            

                {params.nome==="Agenda" && 
                    <>

                      <FlatList data={agenda} keyExtractor={(item)=> item.title} renderItem={({item}) => <AgendaItem title={item.title} dados={item.dados} listarItens={listarItens} />}  contentContainerStyle={{gap: 10,paddingBottom:70}} />
                    </>
                }
                
                {params.nome==="Clientes" &&
                    <>
                    <TextInput placeholderTextColor="gray" placeholder="Procurar Pessoa" style={campoPesquisa ? style.input_selecionado : style.input } onFocus={()=> setCampoPesquisa(true)} onBlur={()=> setCampoPesquisa(false)} onChangeText={setNomePesquisado} />
                    <FlatList data={clientes} keyExtractor={(item)=> String(item.id)} renderItem={({item})=> <ClienteOuProdutoItem id={item.id} nome={item.nome} telefone={item.telefone} listarItens={listarItens} tabela="Clientes" /> } contentContainerStyle={{gap: 10,paddingBottom:70}} />

                    </>
                }
                {params.nome=="Produtos" &&
                <>
                <TextInput placeholderTextColor="gray" placeholder="Procurar Produto" style={campoPesquisa ? style.input_selecionado : style.input } onFocus={()=> setCampoPesquisa(true)} onBlur={()=> setCampoPesquisa(false)} onChangeText={setNomePesquisado}/>
                <FlatList data={produtos} keyExtractor={(item)=> String(item.id)} renderItem={({item})=> <ClienteOuProdutoItem id={item.id} nome={item.nome} preco={item.preco} listarItens={listarItens} tabela="Produtos"    /> } contentContainerStyle={{gap: 10,paddingBottom:70}} />

                </> 
                 }   
                
               {params.nome=="Vendas" && 
                    <>
                    <TextInput placeholderTextColor="gray" placeholder="Procurar Cliente" style={campoPesquisa ? style.input_selecionado : style.input } onFocus={()=> setCampoPesquisa(true)} onBlur={()=> setCampoPesquisa(false)} onChangeText={setNomePesquisado}/>
                    <FlatList data={vendas} keyExtractor={(item)=> String(item.id)} renderItem={({item})=> <VendasItem id={item.id} nome={item.nome} data_entrega={item.data_entrega} valor_total={item.valor_total} status_entrega={item.status_entrega}   />}  contentContainerStyle={{gap: 10,paddingBottom:70}}/>

                    </>
                }
                
            </View>
            </TouchableWithoutFeedback>
            <Menu tela={params.nome}/>

        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        backgroundColor: "#fdf2f8",
        padding:30,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        
    },
    input:{
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 10,
        borderColor: "#fff", 
        borderWidth: 1,   
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    input_selecionado:{
        borderColor: "#f472b6",
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: "white", 
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,   
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
        
    }

});