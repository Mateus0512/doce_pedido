import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet,  FlatList, Text, TouchableOpacity} from "react-native";
import { useVendasDatabase } from "../database/useVendasDatabase";
import { EstatisticasProdutosItem } from "@/componentes/estatisticasProdutosItem";
import { BackBar } from "@/componentes/backBar";
import { Menu } from "@/componentes/menu";
import { FontAwesome5 } from "@expo/vector-icons";
import { EstatisticasVendasItem} from "@/componentes/estatisticasVendasItem";



export default function VizualizarEstatistica(){
    const {nome} = useLocalSearchParams<{nome:string}>();
    const [estatisticas,setEstatisticas] = useState<{nome:string,quantidade:number}[]>([]);
    const [estatisticasVendas,setEstatisticasVendas] = useState<{mes:string,nome:string,quantidade:number,valor_total:number}[]>([]);
    const [ano,setAno] = useState(new Date().getFullYear().toString())

    const vendasDatabase = useVendasDatabase();

    function carregarEstatisticas() {
        if(nome=="Produtos"){
            carregarEstatisticasProdutos();
        }else if(nome=="Clientes"){
            carregarEstatisticasClientes();
        }else if(nome=="Vendas"){
           consultarEstatisticaVenda(ano);
        }
    }

    async function carregarEstatisticasProdutos() {
        const dadosProdutos = await vendasDatabase.listarQuantidadeVendasProdutos();
        //console.log(dadosProdutos);
        setEstatisticas(dadosProdutos);
    }

    async function carregarEstatisticasClientes() {
        const dadosClientes = await vendasDatabase.listarQuantidadeVendasClientes();
        setEstatisticas(dadosClientes);
    }

    async function consultarEstatisticaVenda(ano:string) {
        try {
            let estatisticasVendasTemporaria:{mes:string,nome:string,quantidade:number,valor_total:number}[] = [
                {mes:"01",nome:"Janeiro",quantidade:0,valor_total:0},
                {mes:"02",nome:"Fevereiro",quantidade:0,valor_total:0},
                {mes:"03",nome:"Março",quantidade:0,valor_total:0},
                {mes:"04",nome:"Abril",quantidade:0,valor_total:0},
                {mes:"05",nome:"Maio",quantidade:0,valor_total:0},
                {mes:"06",nome:"Junho",quantidade:0,valor_total:0},
                {mes:"07",nome:"Julho",quantidade:0,valor_total:0},
                {mes:"08",nome:"Agosto",quantidade:0,valor_total:0},
                {mes:"09",nome:"Setembro",quantidade:0,valor_total:0},
                {mes:"10",nome:"Oututro",quantidade:0,valor_total:0},
                {mes:"11",nome:"Novembro",quantidade:0,valor_total:0},
                {mes:"12",nome:"Dezembro",quantidade:0,valor_total:0},
            ]
            
            const result = await vendasDatabase.consultarValoresVendas(ano);

            if(result.length>0){
                for(let i=0;i<result.length;i++){
                    const mesIndex = Number(result[i].mes) - 1;
                    estatisticasVendasTemporaria[mesIndex].valor_total = result[i].valor_total;
                    estatisticasVendasTemporaria[mesIndex].quantidade = result[i].quantidade;
                }
            }

            setEstatisticasVendas(estatisticasVendasTemporaria);

        } catch (error) {
            console.log(error);
        }
    }

    function diminuirAno(){
        let anoAtual = Number(ano);
        anoAtual = anoAtual-1;

        setAno(String(anoAtual));
        consultarEstatisticaVenda(String(anoAtual));
    }

    function aumentarAno(){
        let anoAtual = Number(ano);

        anoAtual = anoAtual+1;

        setAno(String(anoAtual));
        consultarEstatisticaVenda(String(anoAtual));
    }

    useEffect(()=>{
        carregarEstatisticas();
    },[nome,ano]);


    return(
        <View style={{flex:1,backgroundColor:"#451a03"}}>

            <View style={style.container}>

                <BackBar/>
                <View style={style.containerTabela}>
                

                    {(nome=="Clientes" && (estatisticas.length>0)) &&
                    <>
                        {/* <View style={style.cabecalhoTabela}>
                            <Text style={style.tituloCabecalho}>Nome</Text>
                            <Text style={style.tituloCabecalho}>Quantidade</Text>
                        </View> */}
                        <FlatList data={estatisticas} keyExtractor={(item)=> item.nome} renderItem={({item})=> <EstatisticasProdutosItem nome={item.nome} quantidade={item.quantidade} ultimaLinha={item.nome==estatisticas[estatisticas.length-1].nome} />} contentContainerStyle={{paddingBottom:70,borderRadius:20}} 
                        ListHeaderComponent={
                        <View style={style.cabecalhoTabela}>
                            <Text style={style.tituloCabecalho}>Nome</Text>
                            <Text style={style.tituloCabecalho}>Quantidade</Text>
                        </View>}
                        stickyHeaderIndices={[0]}
                        style={{borderRadius:20,paddingTop:2}}
                        />
                    </>
                    
                    }
                    
                    {((nome=="Produtos") && (estatisticas.length>0)) && 
                    <>
                        {/* <View style={style.cabecalhoTabela}>
                            <Text style={style.tituloCabecalho}>Produto</Text>
                            <Text style={style.tituloCabecalho}>Quantidade</Text>
                        </View> */}
                        <FlatList data={estatisticas} keyExtractor={(item)=> item.nome} renderItem={({item})=> <EstatisticasProdutosItem nome={item.nome} quantidade={item.quantidade} ultimaLinha={item.nome==estatisticas[estatisticas.length-1].nome} />} contentContainerStyle={{paddingBottom:70,borderRadius:20}}
                        ListHeaderComponent={
                        <View style={style.cabecalhoTabela}>
                            <Text style={style.tituloCabecalho}>Produto</Text>
                            <Text style={style.tituloCabecalho}>Quantidade</Text>
                        </View>}
                        stickyHeaderIndices={[0]}
                        style={{borderRadius:20,paddingTop:2}}
                        
                         />
                    </> }

                    {(nome=="Vendas") &&
                    <>
                        <View style={style.selecionaAno}>
                            <TouchableOpacity onPress={()=> diminuirAno()}>
                                <FontAwesome5 name="chevron-left" size={30} color="#451a03"/>
                            </TouchableOpacity>
                            
                            <Text style={style.tituloAno}>{ano}</Text>
                            <TouchableOpacity onPress={()=> aumentarAno()}>
                                <FontAwesome5 name="chevron-right" size={30} color="#451a03"/>
                            </TouchableOpacity>
                            
                        </View>
                        {/* <View style={style.cabecalhoTabela}>
                            <Text style={style.tituloCabecalho}>Mês</Text>
                            <Text style={style.tituloCabecalho}>Quantidade de Vendas</Text>
                            <Text style={style.tituloCabecalho}>Valor</Text>
                        </View> */}
                        <FlatList data={estatisticasVendas} keyExtractor={(item)=> item.nome} renderItem={({item})=> <EstatisticasVendasItem nome={item.nome} ultimaLinha={item.nome=="Dezembro"} valor_total={item.valor_total} quantidade={item.quantidade}/>} contentContainerStyle={{paddingBottom:70,borderRadius:20}} 
                        ListHeaderComponent={
                        <View style={style.cabecalhoTabela}>
                            <Text style={style.tituloCabecalho}>Mês</Text>
                            <Text style={style.tituloCabecalho}>Quantidade de Vendas</Text>
                            <Text style={style.tituloCabecalho}>Valor</Text>
                        </View>}
                        stickyHeaderIndices={[0]}
                        style={{borderRadius:20,paddingTop:2}}
                        scrollEnabled={false}
                        
                        />
                        
                    </>
                    }
                        
                    
                    
                     
                </View>
                <Menu tela={nome} />
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
        backgroundColor: 'rgb(216, 27, 96)',
        height:110,
        
    },
    containerTabela:{
        padding:30,
        backgroundColor: "#fdf2f8",
        borderTopEndRadius:20,
        borderTopStartRadius:20,
        flex:1,
        
    },
    cabecalhoTabela:{
        width: "100%",
        height: 30,
        // borderTopWidth:1,
        // borderLeftWidth:1,
        // borderRightWidth:1,
        borderWidth:1,
        borderStartEndRadius:20,
        borderStartStartRadius:20,


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
    tituloCabecalho:{
        fontSize:15,
        fontWeight: "bold",
        alignContent:"center",
        textAlign: "center",
        alignSelf:"center",
        marginHorizontal:10,
        
        
    },
    selecionaAno:{
        width:"100%",
        height:50,
        backgroundColor:"#fff",
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:10,
        alignItems:"center",
        padding:10,
        borderWidth:1,
        borderColor: "#f472b6",
        borderRadius:20,

    
        // Sombras para iOS
        shadowColor: '#f472b6',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    tituloAno:{
        fontSize:14,
        fontWeight:"bold",
    }


});