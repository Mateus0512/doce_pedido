import { Cabecalho } from "@/componentes/cabecalho";
import { Menu } from "@/componentes/menu";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { ClienteVendasItemProps, useVendasDatabase } from "../database/useVendasDatabase";
import { useEffect, useState } from "react";
import { PendenteItem } from "@/componentes/pendenteItem";

export default function Home(){
    const [pendentes,setPendentes] = useState<ClienteVendasItemProps[]>([]);
    const vendasDatabase = useVendasDatabase();


    async function listarPendentes() {
        try {
            const lista = await vendasDatabase.listarAgenda();
            setPendentes(lista);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        listarPendentes();
    },[])
    return(
        <View style={{flex:1}}> 
        <View style={style.container}>
       
       <Cabecalho titulo="Doce Pedido" botaoVoltar={false}/>
       
       <View style={style.corpo}>
       
           <Text style={style.tituloServicos}>Serviços</Text>
           <View style={style.viewServicos}>
               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/cadastrarItem/Clientes')}>
                   <FontAwesome5 name="user-plus" size={24} color="#451a03"/>
                   <Text style={style.textoItemServico}>Cadastrar Clientes</Text>
               </TouchableOpacity>

               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/cadastrarItem/Produtos')}>
                   <FontAwesome5 name="birthday-cake" size={24} color="#451a03"/>
                   <Text style={style.textoItemServico}>Cadastrar Produtos</Text>
               </TouchableOpacity>

               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/cadastrarVariosItens/Clientes')}>
                   <MaterialCommunityIcons name="account-multiple-plus" size={24} color="#451a03"/>
                   <Text style={style.textoItemServico}>Cadastrar Vários Clientes</Text>
               </TouchableOpacity>

               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/cadastrarVariosItens/Produtos')}>
                   <FontAwesome5 name="birthday-cake" size={24} color="#451a03"/>
                   <Text style={style.textoItemServico}>Cadastrar Vários Produtos</Text>
               </TouchableOpacity>

               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/vizualizarEstatistica/Clientes')}>
                   <FontAwesome5 name="chart-bar" size={24} color="#451a03"/>
                   <Text style={style.textoItemServico}>Estatisticas Clientes</Text>
               </TouchableOpacity>

               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/vizualizarEstatistica/Produtos')}>
                   <FontAwesome5 name="chart-bar" size={24} color="#451a03"/>
                   <Text style={style.textoItemServico}>Estatisticas Produtos</Text>
               </TouchableOpacity>

               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/cadastrarVenda')}>
                   <FontAwesome5 name="store" size={24} color="#451a03"/>
                   <Text  style={style.textoItemServico}>Cadastrar Venda</Text>
               </TouchableOpacity>

               <TouchableOpacity style={style.itensServico} onPress={()=> router.push('/vizualizarEstatistica/Vendas')}>
                    <FontAwesome5 name="chart-bar" size={24} color="#451a03"/>
                   <Text  style={style.textoItemServico}>Estatisticas Vendas</Text>
               </TouchableOpacity>
           </View>

           <FlatList data={pendentes} keyExtractor={item=> String(item.id)} renderItem={({item})=> <PendenteItem id={item.id} data_entrega={item.data_entrega} nome={item.nome} nome_aniversariante={item.nome_aniversariante} status_entrega={item.status_entrega} tema_festa={item.tema_festa} valor_total={item.valor_total} />} contentContainerStyle={{gap: 10}} horizontal/>
           

       </View>
   </View>
   <Menu tela="Home"/>
   
   </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#451a03"

    },
    tituloServicos:{
        fontSize:22,
        fontWeight:"bold",
        marginBottom:10,
        color:"#451a03"
    },
    corpo:{
        flex:1,
        padding:30,
        backgroundColor: "#fdf2f8",
        borderTopEndRadius:20,
        borderTopStartRadius:20,
    },
    viewServicos:{
        flexDirection:"row",
        flexWrap:"wrap",
        gap:10,
        justifyContent:"space-between",
        
        

    },
    itensServico:{
        flexDirection:"column",
        gap:5,
        padding:10,
        backgroundColor:"#fff",
        width:"45%",
        borderRadius:20,
        borderColor: "#f472b6", 
        borderWidth: 1,   
        zIndex:10,
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    textoItemServico:{
        fontWeight:"bold",
        color:"#451a03",
    }

});